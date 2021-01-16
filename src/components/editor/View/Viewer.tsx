import React from 'react'
import { Tabs } from 'antd'
import style from './style/view.module.css'

import store from '../../../redux'

interface ViewerProps {

}

interface ViewerState {
    canvasEle: any
}

export default class Viewer extends React.Component<ViewerProps, ViewerState> {
    constructor (props: ViewerProps) {
        super(props)
        this.state = {
            canvasEle: null
        }
    }

    componentDidMount() {
        this.setState({
            canvasEle: document.getElementById('preview-canvas')
        }, () => {
            this.resizeCanvas()
        })
    }

    resizeCanvas () {
        let rect = this.state.canvasEle.parentNode.getBoundingClientRect()
        this.state.canvasEle.width = rect.width
        this.state.canvasEle.height = rect.height
    }

    render () {
        return (
            <>
                <div id="view_framework" className={style.view_framework}>
                    <canvas id="preview-canvas"></canvas>
                </div>
            </>
        )
    }
}