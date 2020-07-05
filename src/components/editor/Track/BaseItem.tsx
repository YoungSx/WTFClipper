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
    itemStyle: {},
    trackItemId: string,
    innerTrackItemId: string,
    innerTrackItemTrimmerLeftId: string,
    innerTrackItemTrimmerRightId: string,
    innerTrackItemBodyId: string,
    itemMoveStartStatus: {
        x: number,
        y: number,
        left: number,
        top: number
    }
}

export default class BaseItem extends React.Component<BaseItemProps, BaseItemState> {
    constructor (props:BaseItemProps) {
        super(props)
        this.state = {
            itemStyle: {
                left: '0px',
                width: '0px'
            },
            trackItemId: 'track_item_' + this.props.item.id,
            innerTrackItemId: 'inner_track_item_' + this.props.item.id,
            innerTrackItemTrimmerLeftId: 'inner_track_item_trimmer_left_' + this.props.item.id,
            innerTrackItemTrimmerRightId: 'inner_track_item_trimmer_right_' + this.props.item.id,
            innerTrackItemBodyId: 'inner_track_item_body_' + this.props.item.id,
            itemMoveStartStatus: {
                x: 0,
                y: 0,
                left: 0,
                top: 0
            }
        }
    }

    componentDidMount () {
        this.setItemLeft(timeToPixel(this.props.item.from), () => {
            this.setItemWidth(timeToPixel(this.props.item.clip_duration))
        })
        this.bindItemMoveEvent()
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

    bindItemMoveEvent () {
        const itemEle = document.getElementById(this.state.trackItemId)
        const itemMouseDown = (e: object) => {
            this.storeItemMoveStartStatus(e, itemEle)
            itemEle?.addEventListener('mousemove', itemMouseMove)
        }
        const itemMouseMove = (e: object) => {
            this.itemMove(e)
        }
        const itemMouseUp = (e: object) => {
            itemEle?.removeEventListener('mousemove', itemMouseMove)
        }
        itemEle?.addEventListener('mousedown', itemMouseDown)
        itemEle?.addEventListener('mouseup', itemMouseUp)
    }

    itemMove (e: any) {
        // 鼠标 x 轴偏移量 + 起始 left
        let left = e.clientX - this.state.itemMoveStartStatus.x + this.state.itemMoveStartStatus.left
        this.setItemLeft(left)
    }

    storeItemMoveStartStatus (e: any, itemEle: any) {
        this.setState({
            itemMoveStartStatus: {
                x: e.clientX,
                y: e.clientY,
                left: itemEle.getBoundingClientRect().left - itemEle.parentNode.getBoundingClientRect().left,
                top: itemEle.getBoundingClientRect().top - itemEle.parentNode.getBoundingClientRect().top
            }
        })
    }

    render () {
        return (
            <>
                <div id={this.state.trackItemId} style={this.state.itemStyle} className={style.track_item}>
                    <div id={this.state.innerTrackItemId} className={style.inner_track_item}>
                        <div id={this.state.innerTrackItemTrimmerLeftId} className={`${style.inner_track_item_trimmer} ${style.inner_track_item_trimmer_left}`}></div>
                        <div id={this.state.innerTrackItemBodyId} className={style.inner_track_item_body}>
                            { this.props.item.id }
                        </div>
                        <div id={this.state.innerTrackItemTrimmerRightId} className={`${style.inner_track_item_trimmer} ${style.inner_track_item_trimmer_right}`}></div>
                    </div>
                </div>
            </>
        )
    }
}