import React from 'react';
import BaseItem from './BaseItem'

interface TrackProps {
    track: {
        id: string,
        items: any[]
    }
}

export default class Track extends React.Component<TrackProps> {
    render () {
        let trackItems = this.props.track.items.map((item) => {
            return <BaseItem item={item}></BaseItem>
        })
        return (
            <>
                { trackItems }
            </>
        )
    }
}