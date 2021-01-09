import React from 'react';

import { pixelToTime } from '../../../utils/time'

interface TimelineProps {
    className: string,
    header: {
        offset: number,
        width: number
    },
    onTimelineClick: any
}

export default class Timeline extends React.Component<TimelineProps> {
    timelineClick (e: any) {
        e.persist()
        let time = pixelToTime(e.clientX + this.props.header.offset)
        this.props.onTimelineClick(time)
    }

    render () {
        return (
            <>
                <div id="timeline" className={this.props.className} onClick={e => this.timelineClick(e)}></div>
            </>
        )
    }
}