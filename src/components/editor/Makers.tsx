import React from 'react';
import Track from './Track/Track'
import { getTracks } from '../../redux/makers';
import style from './Track/style/track.module.css'

export default class Makers extends React.Component {
    render () {
        let tracks = getTracks()
        const trackItems = tracks.map((track) => {
            return <Track className={style.track} track={track}></Track>
        })
        return (
            <>
                { trackItems }
            </>
        )
    }
}