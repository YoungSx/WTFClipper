import React from 'react'
import { connect } from 'react-redux'
import MakersToolbar from './MakersToolbar'
import Track from './Track/Track'
import Timeline from './Track/Timeline'
import style from './Track/style/track.module.css'

import { MakersStoreModel } from '../../model/type'

import store from '../../redux'

class Makers extends React.Component<MakersStoreModel> {
    render () {
        const trackItems = this.props['tracks'].map((track) => {
            return <Track className={style.track} key={`track_${track.id}`} track={track}></Track>
        })
        return (
            <>
                <MakersToolbar className={style.makers_toolbar}></MakersToolbar>
                <Timeline className={style.timeline}></Timeline>
                <div className={style.tracks_area}>
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
