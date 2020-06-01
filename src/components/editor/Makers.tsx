import React from 'react';
import { getTracks } from '../../redux/makers';

export default class Makers extends React.Component {
    render () {
        let tracks = getTracks()
        return (
            <>
            </>
        )
    }
}