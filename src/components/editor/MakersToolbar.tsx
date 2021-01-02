import React from 'react'
import { Button, Divider } from 'antd'

import Transcoder from '../../utils/transcoder'

import store from '../../redux'

interface MakersToolbarProps {
    className: string
}

export default class MakersToolbar extends React.Component<MakersToolbarProps> {
    output () {
        let descriptor = store.getState().makers.tracks
        if (descriptor.length > 0) {
            const transcoder = new Transcoder()
            transcoder.produce({
                id: 'h7h8b8g8g8g8',
                createTime: +new Date(),
                updateTime: +new Date(),
                tracks: descriptor
            })
        }
    }

    render () {
        return (
            <>
                <div className={this.props.className}>
                    <Button type="primary"
                        style={{ height: '32px', margin: '4px', float: 'right' }}
                        onClick={() => { this.output() }}>
                        Output
                    </Button>
                </div>
            </>
        )
    }
}