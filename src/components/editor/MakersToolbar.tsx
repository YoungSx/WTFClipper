import React from 'react';

interface MakersToolbarProps {
    className: string
}

export default class MakersToolbar extends React.Component<MakersToolbarProps> {
    render () {
        return (
            <>
                <div className={this.props.className}>Toolbar</div>
            </>
        )
    }
}