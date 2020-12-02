import React from 'react';
import BaseItem from './BaseItem'

import { TrackModel } from '../../../model/type'

interface TrackProps {
    track: TrackModel,
    className: string
}

export default class Track extends React.Component<TrackProps> {
    render () {
        let trackItems = this.props.track.items.map((item, index) => {
            return <BaseItem key={`track_${ item.id }`} item={ item } index={ index } track={ this.props.track }></BaseItem>
        })
        return (
            <>
                <div className={ this.props.className }>
                    { trackItems }
                </div>
            </>
        )
    }
}