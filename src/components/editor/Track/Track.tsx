import React from 'react'
import { connect } from 'react-redux'
import BaseItem from './BaseItem'

import { pixelToTime, timeToPixel } from '../../../utils/time'

import { TrackModel, BaseFileType, MediaFileType, FILETYPE } from '../../../model/type'
import { ADD_RESOURCE_TO_TRACK } from '../../../redux/constants/makers'

import store from '../../../redux'

import { getInsertPos } from '../../../redux/makers'
import { getResourceFile } from '../../../redux/resource'

interface TrackProps {
    track: TrackModel
    className: string,
    globalDuration: number
}

interface TrackState {
    eleId: string,
    trackEle: any
}

class Track extends React.Component<TrackProps, TrackState> {
    constructor (props: TrackProps) {
        super(props)
        this.state = {
            eleId: 'track_' + this.props.track.id,
            trackEle: null
        }
    }

    componentDidMount () {
        this.setState({
            trackEle: document.getElementById(this.state.eleId)
        }, () => {
            this.bindTrackEvent()
        })
    }

    bindTrackEvent () {
        const trackDrop = (e: any) => {
            this.trackOnDrop(e, e.dataTransfer.getData("rid"))
        }
        this.state.trackEle.addEventListener('drop', trackDrop)
    }

    trackOnDrop (e: any, rid: string) {
        e.preventDefault()
        e.stopPropagation()
        let time = pixelToTime(e.layerX)
        this.addResourceToTrack(rid, time)
    }

    addResourceToTrack (rid: string, time: number) {
        let file = getResourceFile(store.getState().resource, rid)
        if (file !== null && file.type === FILETYPE.VIDEO) {
            let insertPos = getInsertPos(store.getState().makers, time, file.duration, this.props.track)
            if (insertPos.valid)
                store.dispatch({
                    type: ADD_RESOURCE_TO_TRACK,
                    file: file,
                    timeFrom: insertPos.from,
                    clip_duration: insertPos.duration,
                    trackId: this.props.track.id,
                    itemIndex: insertPos.index
                })
        }
    }

    render () {
        let trackItems = this.props.track.items.map((item, index) => {
            return <BaseItem key={`track_${ item.id }`} item={ item } index={ index } track={ this.props.track }></BaseItem>
        })
        let inlineStyle = {
            width: `${timeToPixel(this.props.globalDuration)+60}px`
        }
        return (
            <>
                <div id={ this.state.eleId }
                    className={ this.props.className }
                    style={inlineStyle}
                    onDragOver={ e => e.preventDefault() }>
                    { trackItems }
                </div>
            </>
        )
    }
}

const mapStateToProps = (state: any, ownProps: any) => {
    return {
        tracks: state['makers']['tracks'],
        track: ownProps.track,
        className: ownProps.className,
        globalDuration: state['makers']['duration']
    }
}

export default connect(
    mapStateToProps,
    {
        store
    }
)(Track as any)
