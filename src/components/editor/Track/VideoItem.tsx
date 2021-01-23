import React from 'react'
import { connect } from 'react-redux'
import { timeToPixel, pixelToTime } from '../../../utils/time'
import style from './style/track.module.css'

import { UPDATE_ITEM_TIME, SET_ITEM_SELECTIONS } from '../../../redux/constants/makers'

import store from '../../../redux'

import { BaseItem, BaseItemProps, BaseItemState } from './BaseItem'

interface VideoItemProps extends BaseItemProps{
}

interface VideoItemState extends BaseItemState {
}

class VideoItem extends BaseItem {
    componentDidMount () {
        this.setState({
            itemEle: document.getElementById(this.state.trackItemId),
            makersEle: document.getElementById('makers_area')
        }, () => {
            this.bindItemMoveEvent(this.state.itemEle, this.state.makersEle)
            this.bindTrimmerMoveEvent(this.state.itemEle, this.state.makersEle)
        })
    }

    componentWillReceiveProps(nextProps: VideoItemProps) {
        this.setItemLeft(timeToPixel(nextProps.item.from), () => {
            this.setItemWidth(timeToPixel(nextProps.item.clip_duration))
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

const mapStateToProps = (state: any, ownProps: any) => {
    return {
        item: ownProps.item,
        index: ownProps.index,
        track: ownProps.track,
        zoomLevel: state.makers.zoomLevel
    }
}

export default connect(
    mapStateToProps,
    {
        store
    }
)(VideoItem as any)
