import React from 'react'
import { FileUnknownTwoTone } from '@ant-design/icons'
import style from './style/file.module.css'
import { BaseFileType } from '../../../model/type'

import { fileToBase64 } from '../../../utils/file'

import BaseFile from './BaseFile'

export default class VideoFile extends BaseFile {
    readFileAsBase64 (path: string) {
        return fileToBase64(path)
    }

    render () {
        return (
            <>
                <div id={ this.state.eleId } className={ style.file } title={ this.props.file.displayName } draggable="true">
                    <img className={ style.file_cover } src={this.readFileAsBase64(this.props.file.cover ? this.props.file.cover : '')}></img>
                    <div className={ style.file_name } draggable="false">{ this.props.file.displayName }</div>
                </div>
            </>
        )
    }
}