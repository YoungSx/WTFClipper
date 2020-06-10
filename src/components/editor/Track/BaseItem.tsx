import React from 'react';

interface BaseItemProps {
    item: {
        id: string
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