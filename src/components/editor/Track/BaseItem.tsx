import React from 'react';
import { timeToPixel } from '../../../utils/time'
import style from './style/track.module.css'

interface BaseItemProps {
    item: {
        id: string,
        clip_from: number,
        clip_duration: number,
        from: number
    }
}

interface BaseItemState {
    itemStyle: {}
}

export default class BaseItem extends React.Component<BaseItemProps, BaseItemState> {
    constructor (props:BaseItemProps) {
        super(props)
        this.state = {
            itemStyle: {
                left: '0px',
                width: '0px'
            }
        }
    }

    componentDidMount () {
        this.setItemLeft(timeToPixel(this.props.item.from), () => {
            this.setItemWidth(timeToPixel(this.props.item.clip_duration))
        })
    }

    setItemLeft (left: number, callback?: () => void) {
        this.setState({
            itemStyle: Object.assign({}, this.state.itemStyle, {
                left: left.toString() + 'px'
            })
        }, callback)
    }

    setItemWidth (width: number, callback?: () => void) {
        this.setState({
            itemStyle: Object.assign({}, this.state.itemStyle, {
                width: width.toString() + 'px'
            })
        }, callback)
    }

    render () {
        return (
            <>
                <div id={'track_item_' + this.props.item.id} style={this.state.itemStyle} className={style.track_item}>
                    <div id={'inner_track_item_' + this.props.item.id} className={style.inner_track_item}>
                        <div id={'inner_track_item_trimmer_left_' + this.props.item.id} className={`${style.inner_track_item_trimmer} ${style.inner_track_item_trimmer_left}`}></div>
                        <div id={'inner_track_item_body_' + this.props.item.id} className={style.inner_track_item_body}>
                            { this.props.item.id }
                        </div>
                        <div id={'inner_track_item_trimmer_right_' + this.props.item.id} className={`${style.inner_track_item_trimmer} ${style.inner_track_item_trimmer_right}`}></div>
                    </div>
                </div>
            </>
        )
    }
}