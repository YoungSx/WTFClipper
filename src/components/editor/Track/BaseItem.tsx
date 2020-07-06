import React from 'react';
import { timeToPixel } from '../../../utils/time'
import style from './style/track.module.css'
import { baseItem as baseItemConfig } from './config'

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
    },
    trimmersMoveStartStatus: {
        x: number,
        y: number,
        left: number,
        width: number,
        offset: number
    },
    itemEle: HTMLElement | null,
    makersEle: HTMLElement | null,
    offset: number
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
            },
            trimmersMoveStartStatus: {
                x: 0,
                y: 0,
                left: 0,
                width: 0,
                offset: 0
            },
            itemEle: null,
            makersEle: null,
            offset: 0
        }
    }

    componentDidMount () {
        this.setItemLeft(timeToPixel(this.props.item.from), () => {
            this.setItemWidth(timeToPixel(this.props.item.clip_duration))
        })
        this.setState({
            itemEle: document.getElementById(this.state.trackItemId),
            makersEle: document.getElementById('makers_area')
        }, () => {
            this.bindItemMoveEvent(this.state.itemEle, this.state.makersEle)
            this.bindTrimmerMoveEvent(this.state.itemEle, this.state.makersEle)
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

    bindItemMoveEvent (itemEle: HTMLElement | null, makersEle: HTMLElement | null) {
        const itemMouseDown = (e: object) => {
            this.storeItemMoveStartStatus(e, itemEle)
            itemEle?.addEventListener('mousemove', itemMouseMove)
            makersEle?.addEventListener('mousemove', itemMouseMove)
        }
        const itemMouseMove = (e: object) => {
            this.itemMove(e)
        }
        const itemMouseUp = (e: object) => {
            itemEle?.removeEventListener('mousemove', itemMouseMove)
            makersEle?.removeEventListener('mousemove', itemMouseMove)
        }
        itemEle?.addEventListener('mousedown', itemMouseDown)
        itemEle?.addEventListener('mouseup', itemMouseUp)
        makersEle?.addEventListener('mouseup', itemMouseUp)
    }

    bindTrimmerMoveEvent (itemEle: HTMLElement | null, makersEle: HTMLElement | null) {
        const leftTrimmer = document.getElementById(this.state.innerTrackItemTrimmerLeftId)
        const rightTrimmer = document.getElementById(this.state.innerTrackItemTrimmerRightId)
        // left trimmer events
        const leftTrimmerMouseDown = (e: any) => {
            e.stopPropagation()
            this.storeTrimmersMoveStartStatus(e, itemEle)
            leftTrimmer?.addEventListener('mousemove', leftTrimmerMouseMove)
            makersEle?.addEventListener('mousemove', leftTrimmerMouseMove)
        }
        const leftTrimmerMouseMove = (e: any) => {
            this.TrimmerMove(e, 'left', leftTrimmer, itemEle)
        }
        const leftTrimmerMouseUp = (e: any) => {
            leftTrimmer?.removeEventListener('mousemove', leftTrimmerMouseMove)
            makersEle?.removeEventListener('mousemove', leftTrimmerMouseMove)
        }
        leftTrimmer?.addEventListener('mousedown', leftTrimmerMouseDown)
        leftTrimmer?.addEventListener('mouseup', leftTrimmerMouseUp)
        makersEle?.addEventListener('mouseup', leftTrimmerMouseUp)
        //right trimmer events
        const rightTrimmerMouseDown = (e: any) => {
            e.stopPropagation()
            this.storeTrimmersMoveStartStatus(e, itemEle)
            rightTrimmer?.addEventListener('mousemove', rightTrimmerMouseMove)
            makersEle?.addEventListener('mousemove', rightTrimmerMouseMove)
        }
        const rightTrimmerMouseMove = (e: any) => {
            this.TrimmerMove(e, 'right', rightTrimmer, itemEle)
        }
        const rightTrimmerMouseUp = (e: any) => {
            rightTrimmer?.removeEventListener('mousemove', rightTrimmerMouseMove)
            makersEle?.removeEventListener('mousemove', rightTrimmerMouseMove)
        }
        rightTrimmer?.addEventListener('mousedown', rightTrimmerMouseDown)
        rightTrimmer?.addEventListener('mouseup', rightTrimmerMouseUp)
        makersEle?.addEventListener('mouseup', rightTrimmerMouseUp)
    }

    itemMove (e: any) {
        // 鼠标 x 轴偏移量 + 起始 left
        let left = e.clientX - this.state.itemMoveStartStatus.x + this.state.itemMoveStartStatus.left
        if (Math.abs(left - this.state.itemMoveStartStatus.left) > baseItemConfig.dragThresholdX)
            this.setItemLeft(left)
    }

    TrimmerMove (e: any, orient: string, trimmer: any, itemEle: any) {
        if (orient === 'left') {
            let x = e.clientX - this.state.trimmersMoveStartStatus.x
                + this.state.trimmersMoveStartStatus.left
                - itemEle.parentNode.getBoundingClientRect().left
            let newWidth = this.state.trimmersMoveStartStatus.width
                - (e.clientX - this.state.trimmersMoveStartStatus.x
                - itemEle.parentNode.getBoundingClientRect().left)
            this.setItemLeft(x, () => {
                this.setItemWidth(newWidth)
            })
        } else {
            let x = e.clientX - itemEle.parentNode.getBoundingClientRect().left
            let left = itemEle.getBoundingClientRect().left - itemEle.parentNode.getBoundingClientRect().left
            /*
                计算说明:
                width = 当前鼠标坐标 - item 左边距 + 鼠标坐标距离 item 最右边距离
                        = 当前鼠标坐标 - (item 屏幕左边距 - item 父元素屏幕左边距) + (鼠标刚点下时的宽度 - 鼠标刚点下时鼠标坐标距离 item 最右边距离)
                        = 当前鼠标坐标 - (item 屏幕左边距 - item 父元素屏幕左边距) + (鼠标刚点下时的宽度 - (鼠标刚点下时坐标 - 鼠标刚点下时 item 左边距))
            */
            let newWidth = x - (itemEle.getBoundingClientRect().left
                - itemEle.parentNode.getBoundingClientRect().left)
                + this.state.trimmersMoveStartStatus.width
                - (this.state.trimmersMoveStartStatus.x
                - this.state.trimmersMoveStartStatus.left)
            this.setItemWidth(newWidth)
        }
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

    storeTrimmersMoveStartStatus (e: any, itemEle: any) {
        this.setState({
            trimmersMoveStartStatus: {
                x: e.clientX - itemEle.parentNode.getBoundingClientRect().left,
                y: 0,
                left: itemEle.getBoundingClientRect().left - itemEle.parentNode.getBoundingClientRect().left,
                width: itemEle.getBoundingClientRect().width,
                offset: this.state.offset
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