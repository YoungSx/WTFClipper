import React from 'react';
import BaseItem from './BaseItem'
import style from './style/track.module.css'

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
            return <BaseItem className={style.track_item} item={item}></BaseItem>
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