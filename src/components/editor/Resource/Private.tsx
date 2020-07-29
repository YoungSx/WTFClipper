import React from 'react';
import { parseFileNameFromPath } from '../../../utils/file'
import { appData as appDataConfig } from '../../../config'
import { file as fileConfig } from './config'
import { inArray } from '../../../utils/tool'

export default class Private extends React.Component {
    myMediasOnDrop (e: any) {
        let readyAddingFiles = []
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
            let file = e.dataTransfer.files[i]
            let { name, nameWithoutExt, ext } = parseFileNameFromPath(file.path)
            /**
             * TODO:
             *  1. 如果文件类型不合法的处理
             */
            if (inArray(ext, fileConfig.allowedExts)) {
                this.addFileToPrivateLibrary(file.path)
            }
        }
    }

    addFileToPrivateLibrary (srcFile: string) {
        /**
         * TODO:
         *  1. 编码文件名
         *  2. 数据库
         *  3. 生成封面图
         */
    }

    render () {
        return (
            <>
                { /** It's strange that if I don't add the onDragOver and preventDefault, the onDrop won't work. */ }
                <div onDragOver={ (e) => { e.preventDefault() } } onDrop={ this.myMediasOnDrop }>
                    You can drag and drop some media files here.
                </div>
            </>
        )
    }
}