import React from 'react'
import { FileUnknownTwoTone } from '@ant-design/icons'
import style from './style/file.module.css'
import { BaseFileType } from '../../../model/type'

interface FileProps {
    file: BaseFileType
}

export default class BaseFile extends React.Component<FileProps> {
    render () {
        return (
            <>
                <div className={ style.file } title={ this.props.file.displayName }>
                    <FileUnknownTwoTone style={{ fontSize: '80px' }} />
                    <div className={ style.file_name }>{ this.props.file.displayName }</div>
                </div>
            </>
        )
    }
}