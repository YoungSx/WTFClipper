import { BaseFileType, MediaFileType, TrackItemModel, TrackModel, FILETYPE, TRACKITEMTYPE, MakersStoreModel } from '../model/type'
import { UPDATE_ITEM, UPDATE_ITEM_TIME, ADD_RESOURCE_TO_TRACK, ADD_TRACK,ADD_RESOURCE_TO_NEW_TRACK,
        SET_ITEM_SELECTIONS, DELETE_ITEMS, CLIP_ITEMS, ZOOM_LEVEL_CHANGE, SET_MAKERS_CURRENTTIME } from './constants/makers'

import { deepCopy, inArray } from '../utils/tool'
import { UUID } from '../utils/file'

const initialState: MakersStoreModel = {
    tracks: [],
    itemSelections: [],
    duration: 0,
    zoomLevel: 2,
    currentTime: 0
}

export const getTracks = (state = initialState) => state.tracks

const getGlobalDuration = (state = initialState) => {
    let maxDuration = 0
    state.tracks.forEach(track => {
        let lastItem = track.items[track.items.length - 1]
        if (lastItem.type === TRACKITEMTYPE.VIDEO && lastItem.from + lastItem.clip_duration > maxDuration) maxDuration = lastItem.from + lastItem.clip_duration
    })
    return maxDuration
}

const updateItemTime = (state = initialState, itemInfoList: any[]) => {
    let newState = deepCopy(state)
    itemInfoList.forEach(itemInfo => {
        let trackIndex = 0, itemIndex = 0, founded = false
        for (; trackIndex < state.tracks.length && !founded; trackIndex++) {
            for (; itemIndex < state.tracks[trackIndex].items.length && !founded; itemIndex++) {
                if (state.tracks[trackIndex].id === itemInfo.trackId
                    && state.tracks[trackIndex].items[itemIndex].id === itemInfo.itemId) {
                        newState.tracks[trackIndex].items[itemIndex] = Object.assign(newState.tracks[trackIndex].items[itemIndex], {
                            from: itemInfo.from,
                            clip_from: itemInfo.clip_from,
                            clip_duration: itemInfo.clip_duration
                        })
                }
            }
        }
    })
    return Object.assign(newState, {
        duration: getGlobalDuration(newState)
    })
}

const fileToItem = (file: BaseFileType | MediaFileType) => {
    let path
    if ((file.type === FILETYPE.VIDEO || file.type === FILETYPE.AUDIO) && 'path' in file) path = file.path

    let type: TRACKITEMTYPE
    switch (file.type) {
        case FILETYPE.VIDEO:
            type = TRACKITEMTYPE.VIDEO
            break
        case FILETYPE.AUDIO:
            type = TRACKITEMTYPE.AUDIO
            break
        default:
            type = TRACKITEMTYPE.PICTURE
    }

    return {
        id: UUID(),
        rid: file.id,
        type: type,
        from: 0,
        clip_from: 0,
        clip_duration: 0,
        path
    }
}

export const getInsertPos = (state = initialState, time: number, duration: number, track: TrackModel) => {
    time = time > 0 ? time : 0
    let result: {
        valid: boolean,
        index: number,
        from: number,
        duration: number
    }
    // init
    result = {
        valid: false,
        index: -1,
        from: -1,
        duration: -1
    }
    // 插到最后
    if (track.items.length == 0 || time >= (track.items[track.items.length - 1].from + track.items[track.items.length - 1].clip_duration)) {
        result = {
            valid: true,
            index: track.items.length ? track.items.length : 0,
            duration: duration,
            from: time
        }
    } else {
        // 去插缝（包括最前面）
        for (let i = -1; i < track.items.length - 1; i++) {
            let preTlEnd = i >= 0 ? track.items[i].from + track.items[i].clip_duration : 0
            let nextTlStart = track.items[i + 1].from
            // 找到缝隙
            if (time > preTlEnd && time < nextTlStart) {
                // 如果 time + duration 没超出下一个 tlStart
                if (time + duration <= nextTlStart) {
                    result = {
                        valid: true,
                        index: i + 1,
                        duration: duration,
                        from: time
                    }
                    break
                } else if (nextTlStart - preTlEnd >= duration) {
                    // time + duration 超出下一个 from, 且 tlEnd 接下一个 from, duration 可以原长向前延伸
                    result = {
                        valid: true,
                        index: i + 1,
                        duration: duration,
                        from: nextTlStart - duration
                    }
                    break
                } else {
                    // time + duration 超出下一个 from, 且中间缝隙不足以放下整个，tlEnd 接下一个 from, duration 取缝隙大小
                    result = {
                        valid: true,
                        index: i + 1,
                        duration: nextTlStart - preTlEnd,
                        from: preTlEnd
                    }
                    break
                }
            }
        }
    }
    return result
}

const createTrack = () => {
    return {
        id: UUID(),
        items: []
    }
}

const addTrack = (state = initialState, trackIndex: number) => {
    let track: TrackModel = createTrack()
    state.tracks.splice(trackIndex, 0, track)
    return state
}

const addResourceToNewTrack = (state = initialState, file: BaseFileType, timeFrom: number, clip_duration: number, itemIndex: number, trackIndex: number) => {
    state = addTrack(state, trackIndex)
    return addResourceToTrack(state, file, timeFrom, clip_duration, state.tracks[0].id, itemIndex)
}

const addItemToTrack = (state = initialState, item: TrackItemModel, trackId: string, itemIndex: number) => {
    let newState = deepCopy(state)
    for (let trackIndex = 0, founded = false; trackIndex < newState.tracks.length && !founded; trackIndex++) {
        if (newState.tracks[trackIndex].id == trackId) {
            newState.tracks[trackIndex].items.splice(itemIndex, 0, item)
        }
    }
    return Object.assign(newState, {
        duration: getGlobalDuration(newState)
    })
}

const addResourceToTrack = (state = initialState, file: BaseFileType, timeFrom: number, clip_duration: number, trackId: string, itemIndex: number) => {
    let item: TrackItemModel = Object.assign(fileToItem(file), {
        from: timeFrom,
        clip_duration: clip_duration
    })
    return addItemToTrack(state, item, trackId, itemIndex)
}

const setItemSelections = (state = initialState, ids: Array<string>) => {
    return Object.assign(state, {
        itemSelections: ids
    })
}

const deleteItems = (state = initialState, ids: Array<string>) => {
    let newState = deepCopy(state)
    if (ids.length === 0) return state
    for (let trackIndex = 0; trackIndex < newState.tracks.length; trackIndex++) {
        let track = newState.tracks[trackIndex]
        for (let itemIndex = 0; itemIndex < track.items.length; itemIndex++) {
            for (let i = 0; i < ids.length; i++) {
                if (track.items[itemIndex].id === ids[i]) {
                    // remove in ids
                    ids.splice(i, 1)
                    // remove in track
                    track.items.splice(itemIndex, 1)
                    itemIndex--
                    break
                }
            }
            // when this track is empty, remove it
            if (track.items.length === 0) {
                newState.tracks.splice(trackIndex, 1)
                trackIndex--
            }
            // when ids is empty, exit
            if (ids.length === 0) return newState
        }
    }
    // 正常不会走到这里，走到这里说明 ids 里面有剩余没在轨道中找到
    return newState
}

export const clipItems = (state = initialState, time: number, ids: Array<string>) => {
    let newState = deepCopy(state)
    let clipAll = ids.length > 0 ? false : true
    let count = 0

    if (time < 0) return state
    for (let trackIndex = 0; trackIndex < newState.tracks.length; trackIndex++) {
        let track = newState.tracks[trackIndex]
        for (let itemIndex = 0; itemIndex < track.items.length; itemIndex++) {
            let item = track.items[itemIndex]
            if (item.from + item.clip_duration < time) break
            if (item.from > time) continue

            if (item.from < time && item.from + item.clip_duration > time
                && (clipAll || (inArray(item.id, ids)))) {
                let halfItemRight = Object.assign(deepCopy(item), {
                    id: UUID(),
                    from: time,
                    clip_duration: item.clip_duration - (time - item.from)
                })
                let halfItemLeft = Object.assign(item, {
                    clip_duration: time - item.from
                })
                track.items[itemIndex] = halfItemLeft
                track.items.splice(itemIndex + 1, 0, halfItemRight)

                if (!clipAll) {
                    count++
                    if (count === ids.length) return newState
                }
                // next track
                break
            } else continue
        }
    }
    return newState
}

const zoomLevelChange = (state = initialState, level: number) => {
    return Object.assign(deepCopy(state), {
        zoomLevel: level
    })
}

const setCurrentTime = (state = initialState, time: number) => {
    return Object.assign(deepCopy(state), {
        currentTime: time
    })
}

const makers = (state = initialState, action: any) => {
    switch (action.type) {
        case UPDATE_ITEM:
            break
        case UPDATE_ITEM_TIME:
            return updateItemTime(state, action.itemInfoList)
        case ADD_RESOURCE_TO_TRACK:
            return addResourceToTrack(state, action.file, action.timeFrom, action.clip_duration, action.trackId, action.itemIndex)
        case ADD_RESOURCE_TO_NEW_TRACK:
            return addResourceToNewTrack(state, action.file, action.timeFrom, action.clip_duration, action.itemIndex, action.trackIndex)
        case SET_ITEM_SELECTIONS:
            return setItemSelections(state, action.ids)
        case DELETE_ITEMS:
            return deleteItems(state, action.ids)
        case CLIP_ITEMS:
            return clipItems(state, action.time, action.ids)
        case ZOOM_LEVEL_CHANGE:
            return zoomLevelChange(state, action.level)
        case SET_MAKERS_CURRENTTIME:
            return setCurrentTime(state, action.time)
        default:
            return state
    }
}

export default makers