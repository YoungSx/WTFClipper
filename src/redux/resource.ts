const initialState = {
    libraries: {
        private: {
            media: [
                // example
                {
                    id: "38682f5e-5c5e-4425-8fb4-1a042401e55c",
                    type: 'video',
                    path: "C:\\Users\\shangxin\\Videos\\2020-05-01-20-08-10.mkv",
                    name: "2020-05-01-20-08-10.mkv",
                    displayName: "2020-05-01-20-08-10"
                },
                {
                    id: "38685f5e-5c5e-4425-8fb4-1a042401e55c",
                    type: 'video',
                    path: "C:\\Users\\shangxin\\Videos\\2020-05-01-20-08-10.mkv",
                    name: "2020-05-01-20-08-10.mkv",
                    displayName: "2020-05-01-20-08-10"
                },
                {
                    id: "38682f5e-5c5e-4625-8fb4-1a042401e55c",
                    type: 'video',
                    path: "C:\\Users\\shangxin\\Videos\\2020-05-01-20-08-10.mkv",
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

const resource = (state = initialState, action: { type: any }) => {
    switch (action.type) {
        default:
            return state
    }
}

export default resource