const initialState = {
    tracks: [
        {
            id: 'uj8ajnm32tnb',
            items: [
                {
                    id: 'xxxxxxitem1'
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