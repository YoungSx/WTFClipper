import React from 'react'
import { connect } from 'react-redux'
import MakersToolbar from './MakersToolbar'
import Track from './Track/Track'
import Timeline from './Track/Timeline'
import style from './Track/style/track.module.css'

import { MakersStoreModel } from '../../model/type'

import store from '../../redux'

class Makers extends React.Component<MakersStoreModel> {
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
        const tracksAreaScroll = (e: any) => {
            this.tracksAreaScroll()
        }
        this.state.tracksAreaEle.addEventListener('scroll', tracksAreaScroll)
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
                <div className={style.tracks_area}>
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
