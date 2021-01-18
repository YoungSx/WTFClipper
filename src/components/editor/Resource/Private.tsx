import React from 'react';
import { connect } from 'react-redux'
import { parseFileNameFromPath, getCoverImage, getDuration, UUID } from '../../../utils/file'
import { dataBase } from '../../../utils/db'
import { file as fileConfig } from './config'
import { inArray } from '../../../utils/tool'
import { appConst } from '../../../config'
import { SET_PRIVATE_RESOURCE } from '../../../redux/constants/resource'
import { PrivateStoreModel, VideoFileType, FILETYPE } from '../../../model/type'
import style from './style/resource.module.css'

import store from '../../../redux'

import BaseFile from './BaseFile'
import VideoFile from './VideoFile'
import AudioFile from './AudioFile'

class Private extends React.Component<PrivateStoreModel> {
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
        getDuration(src, (duration_result: number | string) => {
            if (typeof duration_result === "number")
                getCoverImage(src, id, (outPath: string) => {
                    /**
                     * TODO:
                     * check if sucess
                     */

                    // save to db
                    let file_item: VideoFileType = {
                        id: id,
                        path: src,
                        type: FILETYPE.VIDEO,
                        duration: duration_result,
                        name: name,
                        displayName: nameWithoutExt,
                        cover: outPath
                    }
                    let db = new dataBase('private_files')
                    db.push(file_item)
        
                    // update to redux
                    let private_files = db.read()
                    store.dispatch(
                        {
                            type: SET_PRIVATE_RESOURCE,
                            resource: private_files
                        }
                    )
                })
        })
    }

    render () {
        let files = this.props['private']['media'].map((file) => {
            if (file.type === FILETYPE.VIDEO) return <VideoFile key={`file_${file.id}`} file={file}></VideoFile>
            else if (file.type === FILETYPE.AUDIO) return <AudioFile key={`file_${file.id}`} file={file}></AudioFile>
            else return <BaseFile key={`file_${file.id}`} file={file}></BaseFile>}
        )

        return (
            <>
                { /** It's strange that if I don't add the onDragOver and preventDefault, the onDrop won't work. */ }
                <div className={ style.files_container } onDragOver={ (e) => { e.preventDefault() } } onDrop={ this.myMediasOnDrop }>
                    { files.length > 0 ? files : 'Please drag some media files and drop them here.' }
                </div>
            </>
        )
    }
}

const mapStateToProps = (state: any, ownProps: any) => {
    return {
        private: state['resource']['libraries']['private']
    }
}

export default connect(
    mapStateToProps,
    {
        store
    }
)(Private as any)