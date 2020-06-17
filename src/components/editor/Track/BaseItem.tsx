import React from 'react';
import { timeToPixel } from '../../../utils/time'

interface BaseItemProps {
    item: {
        id: string,
        clip_from: number,
        clip_duration: number,
        from: number
    },
    className: string
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
                <div style={this.state.itemStyle} className={this.props.className}>
                    { this.props.item.id }
                </div>
            </>
        )
    }
}