import React from 'react'
import { connect } from 'react-redux'
import MakersToolbar from './MakersToolbar'
import Track from './Track/Track'
import Timeline from './Track/Timeline'
import style from './Track/style/track.module.css'

import { pixelToTime, timeToPixel } from '../../utils/time'

import { MakersStoreModel, FILETYPE } from '../../model/type'
import { ADD_RESOURCE_TO_NEW_TRACK, SET_ITEM_SELECTIONS, SET_MAKERS_CURRENTTIME } from '../../redux/constants/makers'

import store from '../../redux'

import { getResourceFile } from '../../redux/resource'
import { getInsertPos } from '../../redux/makers'

interface MakersState {
    tracksAreaEle: any,
    header: {
        offset: number,
        width: number
    },
    playheadEle: any,
    playheadStyle: any
}

class Makers extends React.Component<MakersStoreModel, MakersState> {
    constructor (props: MakersStoreModel) {
        super(props)
        this.state = {
            tracksAreaEle: null,
            header: {
                offset: 0, // positive
                width: 0
            },
            playheadEle: null,
            playheadStyle: {
                display: 'none',
                left: '0px'
            }
        }
    }

    componentDidMount () {
        this.setState({
            tracksAreaEle: document.getElementById('tracks_area'),
            playheadEle: document.getElementById('playhead')
        }, () => {
            // init Element position info
            this.tracksAreaScroll()
            this.bindMakersEvent()
        })
    }

    componentWillReceiveProps(nextProps: MakersStoreModel) {
        this.setPlayheadLeft(nextProps.currentTime)
    }

    bindMakersEvent () {
        const tracksAreaOnDrop = (e: any) => {
            this.tracksAreaOnDrop(e, e.dataTransfer.getData("rid"))
        }
        const tracksAreaScroll = (e: any) => {
            this.tracksAreaScroll()
        }
        const tracksAreaClick = (e: any) => {
            store.dispatch({
                type: SET_ITEM_SELECTIONS,
                ids: []
            })
        }
        this.state.tracksAreaEle.addEventListener('dragover', (e: any) => {
            e.preventDefault()
        })
        this.state.tracksAreaEle.addEventListener('drop', tracksAreaOnDrop)
        this.state.tracksAreaEle.addEventListener('scroll', tracksAreaScroll)
        this.state.tracksAreaEle.addEventListener('click', tracksAreaClick)
    }

    tracksAreaOnDrop (e: any, rid: string) {
        e.preventDefault()
        e.stopPropagation()
        let x = e.layerX + this.state.header.offset
        let time = pixelToTime(x)
        let file = getResourceFile(store.getState().resource, rid)
        /**
         * TODO:
         * track 目标轨道暂定 0
         */
        this.addResourceToNewTrack(rid, time, 0)
    }

    addResourceToNewTrack (rid: string, time: number, trackIndex: number) {
        let file = getResourceFile(store.getState().resource, rid)
        if (file !== null && file.type === FILETYPE.VIDEO) {
            store.dispatch({
                type: ADD_RESOURCE_TO_NEW_TRACK,
                file: file,
                timeFrom: time,
                clip_duration: file.duration,
                itemIndex: 0,
                trackIndex: trackIndex
            })
        }
    }

    tracksAreaScroll () {
        this.setState({
            header: {
                offset: this.state.tracksAreaEle.scrollLeft,
                width: this.state.tracksAreaEle.getBoundingClientRect().width
            }
        }, () => {
            this.setPlayheadLeft(this.props.currentTime)
        })
    }

    setPlayheadLeft (time: number) {
        let currentTimeRealPixel = timeToPixel(this.props.currentTime) - this.state.header.offset
        if (currentTimeRealPixel < 0 || currentTimeRealPixel > this.state.header.width) {
            this.state.playheadEle.style.display = 'none'
            this.setState({
                playheadStyle: {
                    display: 'none',
                    left: '0px'
                }
            })
        } else {
            this.setState({
                playheadStyle: {
                    display: 'block',
                    left: String(currentTimeRealPixel) + 'px'
                }
            })
        }
    }

    timelineClick (time: number) {
        store.dispatch({
            type: SET_MAKERS_CURRENTTIME,
            time
        })
    }

    render () {
        const trackItems = this.props['tracks'].map((track) => {
            return <Track className={style.track} key={`track_${track.id}`} track={track}></Track>
        })
        return (
            <>
                <MakersToolbar className={style.makers_toolbar}></MakersToolbar>
                <div id="playhead"
                    className={style.playhead} 
                    style={this.state.playheadStyle}></div>
                <Timeline
                    className={style.timeline}
                    header={this.state.header}
                    onTimelineClick={(time: number) => this.timelineClick(time)}></Timeline>
                <div id="tracks_area" className={style.tracks_area}>
                    { trackItems }
                </div>
            </>
        )
    }
}

const mapStateToProps = (state: any, ownProps: any) => {
    return {
        tracks: state['makers']['tracks'],
        currentTime: state['makers']['currentTime']
    }
}

export default connect(
    mapStateToProps,
    {
        store
    }
)(Makers as any)
