import React from 'react'
import { CustomerServiceTwoTone } from '@ant-design/icons'
import style from './style/file.module.css'
import { BaseFileType } from '../../../model/type'

import { fileToBase64 } from '../../../utils/file'

import BaseFile from './BaseFile'

export default class AudioFile extends BaseFile {
    render () {
        return (
            <>
                <div id={ this.state.eleId } className={ style.file } title={ this.props.file.displayName } draggable="true">
                    <CustomerServiceTwoTone style={{ fontSize: '80px' }} draggable="false"/>
                    <div className={ style.file_name } draggable="false">{ this.props.file.displayName }</div>
                </div>
            </>
        )
    }
}