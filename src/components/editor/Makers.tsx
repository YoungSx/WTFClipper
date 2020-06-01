import React from 'react';
import Track from './Track/Track'
import { getTracks } from '../../redux/makers';

export default class Makers extends React.Component {
    render () {
        let tracks = getTracks()
        const trackItems = tracks.map((track) => {
            return <Track track={track}></Track>
        })
        return (
            <>
                { trackItems }
            </>
        )
    }
}