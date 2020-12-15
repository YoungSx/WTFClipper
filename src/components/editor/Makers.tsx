import React from 'react'
import { connect } from 'react-redux'
import MakersToolbar from './MakersToolbar'
import Track from './Track/Track'
import Timeline from './Track/Timeline'
import style from './Track/style/track.module.css'

import { pixelToTime } from '../../utils/time'

import { MakersStoreModel, FILETYPE } from '../../model/type'
import { ADD_RESOURCE_TO_NEW_TRACK } from '../../redux/constants/makers'

import store from '../../redux'

import { getResourceFile } from '../../redux/resource'
import { getInsertPos } from '../../redux/makers'

interface MakersState {
    tracksAreaEle: any,
    header: {
        offset: number,
        width: number
    }
}

class Makers extends React.Component<MakersStoreModel, MakersState> {
    constructor (props: MakersStoreModel) {
        super(props)
        this.state = {
            tracksAreaEle: null,
            header: {
                offset: 0,
                width: 0
            }
        }
    }

    componentDidMount () {
        this.setState({
            tracksAreaEle: document.getElementById('tracks_area')
        }, () => {
            // init Element position info
            this.tracksAreaScroll()
            this.bindMakersEvent()
        })
    }

    bindMakersEvent () {
        const tracksAreaOnDrop = (e: any) => {
            this.tracksAreaOnDrop(e, e.dataTransfer.getData("rid"))
        }
        const tracksAreaScroll = (e: any) => {
            this.tracksAreaScroll()
        }
        this.state.tracksAreaEle.addEventListener('dragover', (e: any) => {
            e.preventDefault()
        })
        this.state.tracksAreaEle.addEventListener('drop', tracksAreaOnDrop)
        this.state.tracksAreaEle.addEventListener('scroll', tracksAreaScroll)
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
        })
    }

    render () {
        const trackItems = this.props['tracks'].map((track) => {
            return <Track className={style.track} key={`track_${track.id}`} track={track}></Track>
        })
        return (
            <>
                <MakersToolbar className={style.makers_toolbar}></MakersToolbar>
                <Timeline className={style.timeline}></Timeline>
                <div id="tracks_area" className={style.tracks_area}>
                    { trackItems }
                </div>
            </>
        )
    }
}

const mapStateToProps = (state: any, ownProps: any) => {
    return {
        tracks: state['makers']['tracks']
    }
}

export default connect(
    mapStateToProps,
    {
        store
    }
)(Makers as any)
