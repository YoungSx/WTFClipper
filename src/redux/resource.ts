const initialState = {
    libraries: {
        private: {
            media: [
                // example
                {
                    id: 'mymedias1',
                    type: 'video',
                    url: '{%RESOURCE_HOME%}/private/media/mymedias1.mp4'
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

const resource = (state = initialState, action: { type: any }) => {
    switch (action.type) {
        default:
            return state
    }
}

export default resource