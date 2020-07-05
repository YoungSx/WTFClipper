import React from 'react';
import BaseItem from './BaseItem'

interface TrackProps {
    track: {
        id: string,
        items: any[]
    },
    className: string
}

export default class Track extends React.Component<TrackProps> {
    render () {
        let trackItems = this.props.track.items.map((item) => {
            return <BaseItem key={`track_${item.id}`} item={item}></BaseItem>
        })
        return (
            <>
                <div className={this.props.className}>
                    { trackItems }
                </div>
            </>
        )
    }
}