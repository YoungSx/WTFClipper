import React from 'react';
import { parseFileNameFromPath, getCoverImage, UUID } from '../../../utils/file'
import { dataBase } from '../../../utils/db'
import { file as fileConfig } from './config'
import { inArray } from '../../../utils/tool'
import { appConst } from '../../../config'

import { getResource } from '../../../redux/resource'

import BaseFile from './BaseFile'

export default class Private extends React.Component {
    myMediasOnDrop = (e: any) => {
        let readyAddingFiles = []
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
            let file = e.dataTransfer.files[i]
            let { ext } = parseFileNameFromPath(file.path)
            /**
             * TODO:
             *  1. 如果文件类型不合法的处理
             */
            if (inArray(ext, fileConfig.allowedExts)) {
                readyAddingFiles.push(file.path)
                this.addFileToPrivateLibrary(file.path)
            }
        }
    }

    addFileToPrivateLibrary (src: string) {
        let id = UUID()
        let { name, nameWithoutExt } = parseFileNameFromPath(src)
        getCoverImage(src, id, (r: string) => {
            /**
             * TODO:
             * check if sucess
             */
            let db = new dataBase('private_files')
            db.push({
                id: id,
                path: src,
                type: appConst.FILE_VIDEO,
                name: name,
                displayName: nameWithoutExt
            })
        })
    }

    render () {
        let privateMedias = getResource()['private']['media']
        let files = privateMedias.map((file) => {
            return <BaseFile key={`file_${file.id}`} file={file}></BaseFile>
        })
        return (
            <>
                { /** It's strange that if I don't add the onDragOver and preventDefault, the onDrop won't work. */ }
                <div onDragOver={ (e) => { e.preventDefault() } } onDrop={ this.myMediasOnDrop }>
                    { files }
                </div>
            </>
        )
    }
}