import React from 'react';

import { pixelToTime, timeToPixel } from '../../../utils/time'
import { addZero } from '../../../utils/tool'

interface TimelineProps {
    className: string,
    header: {
        offset: number,
        width: number
    },
    onTimelineClick: any
}

interface TimelineState {
    canvasEle: any
}

export default class Timeline extends React.Component<TimelineProps, TimelineState> {
    constructor (props: TimelineProps) {
        super(props)
        this.state = {
            canvasEle: null
        }
    }

    componentDidMount () {
        this.setState({
            canvasEle: document.getElementById('timeline-canvas')
        }, () => {
            this.reSize()
        })
    }

    componentWillReceiveProps(nextProps: TimelineProps) {
        if (this.state.canvasEle !== null) this.reSize()
    }

    reSize () {
        this.state.canvasEle.width = this.props.header.width
        this.state.canvasEle.height = 30
        this.drawScale()
    }

    drawScale () {
        let context = this.state.canvasEle.getContext('2d')
        let convasReact = this.state.canvasEle.getBoundingClientRect()
        // clear
        context.clearRect(0, 0, convasReact.width, convasReact.height)
        let lineWidth = 1
        let lineHeight = convasReact.height
        let startOffset = 0 - Math.abs(this.props.header.offset % timeToPixel(1000))
        context.lineWidth = lineWidth
        context.strokeStyle = 'black'
        context.fillStyle = 'black'
        for (let i = 0; i <= 20; i++) {
            let cellPixels = 60
            let seconds = Number(((i * pixelToTime(cellPixels))
                            + Math.floor(Math.abs(this.props.header.offset / cellPixels))
                            * pixelToTime(cellPixels))
                            .toFixed(2)) / 1000
            let msTime = Math.round((seconds % 1) * 100)
            let minuTime = Math.round(seconds / 60)
            let sTime = Math.round(seconds / 1 - minuTime * 60)
            let timeText = minuTime <= 0 ? sTime + ':' + addZero(msTime)
              : addZero(minuTime) + ':' + addZero(sTime) + ':' + addZero(msTime)
            context.font = 12 + 'px'
            context.fillText(timeText, startOffset + i * cellPixels + 5, 17.5)
            for (let j = 0; j < 10; j++) {
                context.beginPath()
                if (j % 5 === 0) {
                    context.moveTo(startOffset + i * cellPixels + j * (cellPixels / 10), lineHeight * 0.75)
                } else {
                    context.moveTo(startOffset + i * cellPixels + j * (cellPixels / 10), lineHeight * 0.25)
                }
                context.lineTo(startOffset + i * cellPixels + j * (cellPixels / 10), 0)
                context.closePath()
                context.stroke()
            }
          }
    }
    
    timelineClick (e: any) {
        e.persist()
        let time = pixelToTime(e.clientX + this.props.header.offset)
        this.props.onTimelineClick(time)
    }

    render () {
        return (
            <>
                <div id="timeline" className={this.props.className} onClick={e => this.timelineClick(e)}>
                    <canvas id="timeline-canvas"></canvas>
                </div>
            </>
        )
    }
}