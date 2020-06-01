import React from 'react';

interface BaseItemProps {
    item: {
        id: string
    }
}

export default class BaseItem extends React.Component<BaseItemProps> {
    render () {
        return (
            <>
                { this.props.item.id }
            </>
        )
    }
}