import { UPDATE_ITEM, UPDATE_ITEM_TIME } from './constants/makers'

import { deepCopy } from '../utils/tool'

const initialState = {
    tracks: [
        {
            id: 'uj8ajnm32tnb',
            items: [
                {
                    id: 'xxxxxxitem1',
                    clip_from: 0,
                    clip_duration: 1000,
                    from: 2000
                },
                {
                    id: 'xxxxxxitem2',
                    clip_from: 0,
                    clip_duration: 1000,
                    from: 14000
                }
            ]
        }
    ],
    selectedTrackItemsId: [] 
}

export const getTracks = (state = initialState) => state.tracks

const updateItemTime = (state = initialState, itemInfoList: [any]) => {
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
    return newState
}

const makers = (state = initialState, action: any) => {
    switch (action.type) {
        case UPDATE_ITEM:
            break
        case UPDATE_ITEM_TIME:
            return updateItemTime(state, action.itemInfoList)
        default:
            return state
    }
}

export default makers