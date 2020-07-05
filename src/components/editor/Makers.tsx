import React from 'react';
import MakersToolbar from './MakersToolbar'
import Track from './Track/Track'
import Timeline from './Track/Timeline'
import { getTracks } from '../../redux/makers';
import style from './Track/style/track.module.css'

export default class Makers extends React.Component {
    render () {
        let tracks = getTracks()
        const trackItems = tracks.map((track) => {
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