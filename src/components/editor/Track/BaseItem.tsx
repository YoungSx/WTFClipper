import React from 'react';

interface BaseItemProps {
    item: {
        id: string
    },
    className: string
}

export default class BaseItem extends React.Component<BaseItemProps> {
    render () {
        return (
            <>
                <div className={this.props.className}>
                    { this.props.item.id }
                </div>
            </>
        )
    }
}