import React from 'react'
import { FileUnknownTwoTone } from '@ant-design/icons'
import style from './style/file.module.css'
import { BaseFileType } from '../../../model/type'

interface FileProps {
    file: BaseFileType
}

interface FileState {
    rid: string,
    eleId: string,
    fileEle: any
}

export default class BaseFile extends React.Component<FileProps, FileState> {
    constructor (props: FileProps) {
        super(props)
        this.state = {
            rid: props.file.id,
            eleId: 'r-' + props.file.id,
            fileEle: null
        }
    }

    componentDidMount () {
        this.setState({
            fileEle: document.getElementById(this.state.eleId)
        }, () => {
            this.bindFileDragEvent(this.state.fileEle)
        })
    }

    bindFileDragEvent (fileEle: any) {
        const fileDragStart = (e: any) => {
            e.dataTransfer.setData("rid", this.state.rid)
        }
        fileEle?.addEventListener("dragstart", fileDragStart)
    }

    render () {
        return (
            <>
                <div id={ this.state.eleId } className={ style.file } title={ this.props.file.displayName } draggable="true">
                    <FileUnknownTwoTone style={{ fontSize: '80px' }} draggable="false"/>
                    <div className={ style.file_name } draggable="false">{ this.props.file.displayName }</div>
                </div>
            </>
        )
    }
}