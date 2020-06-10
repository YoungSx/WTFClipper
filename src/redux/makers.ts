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
                }
            ]
        }
    ]
}

export const getTracks = (state = initialState) => state.tracks

const makers = (state = initialState, action: { type: any }) => {
    switch (action.type) {
        default:
            return state
    }
}

export default makers