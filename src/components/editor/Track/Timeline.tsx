import React from 'react';

interface TimelineProps {
    className: string
}

export default class Timeline extends React.Component<TimelineProps> {
    render () {
        return (
            <>
                <div className={this.props.className}></div>
            </>
        )
    }
}