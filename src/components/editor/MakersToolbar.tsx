import React from 'react'
import { Button, Slider } from 'antd'

import { DELETE_ITEMS, ZOOM_LEVEL_CHANGE, CLIP_ITEMS } from '../../redux/constants/makers'

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

    zoomSliderChange (velue: number) {
        store.dispatch({
            type: ZOOM_LEVEL_CHANGE,
            level: velue
        })
    }

    clipItems () {
        store.dispatch({
            type: CLIP_ITEMS,
            time: store.getState().makers.currentTime,
            ids: store.getState().makers.itemSelections
        })
    }

    render () {
        return (
            <>
                <div className={this.props.className}>
                    <Button
                        style={{ height: '32px', margin: '4px' }}
                        onClick={() => { this.deleteItem() }}>
                        Delete
                    </Button>
                    <Button
                        style={{ height: '32px', margin: '4px', float: 'left' }}
                        onClick={() => { this.clipItems() }}>
                        Clip
                    </Button>
                    <Button type="primary"
                        style={{ height: '32px', margin: '4px' }}
                        onClick={() => { this.output() }}>
                        Output
                    </Button>
                    <Slider
                        min={1}
                        max={3}
                        defaultValue={2}
                        style={{ width: '100px', float: 'right', marginRight: '15px' }}
                        onAfterChange={this.zoomSliderChange} />
                </div>
            </>
        )
    }
}