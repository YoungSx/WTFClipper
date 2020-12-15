import { SET_PRIVATE_RESOURCE } from './constants/resource'

const initialState = {
    libraries: {
        private: {
            media: [
                // example
                {
                    id: "38682f5e-5c5e-4425-8fb4-1a042401e55c",
                    type: 'video',
                    path: "C:\\Users\\shangxin\\Videos\\2020-05-01-20-08-10.mkv",
                    duration: 1000,
                    name: "2020-05-01-20-08-10.mkv",
                    displayName: "2020-05-01-20-08-10"
                }
            ]
        },
        public: {
            video: [],
            audio: [],
            text: [],
            sticker: [],
            mosaic: [],
            transition: []
        }
    }
}

export const getResource = (state = initialState) => state.libraries

export const getResourceFile = (state = initialState, rid: string) => {
    for (let i = 0; i < state.libraries.private.media.length; i++) {
        let file = state.libraries.private.media[i]
        if (rid === file.id) return file 
    }
    return null
}

export const resource = (state = initialState, action: any) => {
    switch (action.type) {
        case SET_PRIVATE_RESOURCE:
            return Object.assign({}, state, {
                libraries: {
                    private:{
                        media: action['resource']
                    }
                }
            })
        default:
            return state
    }
}

export default resource