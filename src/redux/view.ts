import { SET_PLAY_STATUS } from './constants/view'

const initialState = {
    isPlaying: false
}

const setPlayStatus = (state = initialState, status: boolean) => {
    return Object.assign({}, state, {
        isPlaying: status
    })
}

export const view = (state = initialState, action: any) => {
    switch (action.type) {
        case SET_PLAY_STATUS:
            return setPlayStatus(state, action.status)
        default:
            return state
    }
}

export default view
