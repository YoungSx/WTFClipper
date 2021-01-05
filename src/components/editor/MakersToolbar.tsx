import React from 'react'
import { Button, Divider } from 'antd'

import { DELETE_ITEMS } from '../../redux/constants/makers'

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

    deleteItem () {
        store.dispatch({
            type: DELETE_ITEMS,
            ids: store.getState().makers.itemSelections
        })
    }

    render () {
        return (
            <>
                <div className={this.props.className}>
                    <Button
                        style={{ height: '32px', margin: '4px', float: 'left' }}
                        onClick={() => { this.deleteItem() }}>
                        Delete
                    </Button>
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