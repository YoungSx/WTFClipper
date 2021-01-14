import { appData as appDataConfig } from '../config'
import { FILETYPE } from '../model/type'
import { file as fileConfig } from '../components/editor/Resource/config'
import { inArray } from './tool'
import Transcoder from './transcoder'

const fs = require('fs')
const path = require('path')
const mineType = require('mime-types')

export function parseFileNameFromPath (path:string) {
    let tempIndex1 = path.lastIndexOf('/')
    let tempIndex2 = path.lastIndexOf('\\')
    let name = path.substring((tempIndex1 > tempIndex2 ? tempIndex1 : tempIndex2) + 1, path.length)
    let tempArr = name.split('.')
    let nameWithoutExt = tempArr[0]
    return {
        name,
        nameWithoutExt,
        ext: tempArr.length > 1 ? tempArr[1] : ''
    }
}

export function getCoverImage (src: string, dstName: string, callback: any) {
    let inputPath = src
    inputPath = inputPath.replace('{%RESOURCE_HOME%}', appDataConfig.RESOURCE_HOME)
    const transcoder = new Transcoder()
    transcoder.generateCoverImage(inputPath, dstName, (result: string) => {
        callback(result)
    })
}

export function getDuration (src: string, callback: any) {
    let inputPath = src
    inputPath = inputPath.replace('{%RESOURCE_HOME%}', appDataConfig.RESOURCE_HOME)
    const transcoder = new Transcoder()
    transcoder.getDuration(inputPath, (result: number | string) => {
        callback(result)
    })
}

export function UUID () {
    let str = '0123456789abcdef'
    let arr = []
    for(let i = 0; i < 36; i++){
      arr.push(str.substr(Math.floor(Math.random() * 0x10), 1))
    }
    arr[14] = 4;
    arr[19] = str.substr(<number>arr[19] & 0x3 | 0x8, 1)
    arr[8] = arr[13] = arr[18] = arr[23] = '-'
    return arr.join('')
}

export function extType (ext: string) {
    if (inArray(ext, fileConfig.allowedVideoExts)) return FILETYPE.VIDEO
    if (inArray(ext, fileConfig.allowedAudioExts)) return FILETYPE.AUDIO
    if (inArray(ext, fileConfig.allowedPictureExts)) return FILETYPE.PICTURE
    return FILETYPE.UNKNOWN
}

export function fileType (path: string) {
    let { ext } = parseFileNameFromPath(path)
    return extType(ext)
}

export function fileToBase64 (file: string) {
    let filePath = path.resolve(file)
    let data = fs.readFileSync( path.resolve(filePath))
    data = new Buffer(data).toString('base64')
    return 'data:' + mineType.lookup(filePath) + ';base64,' + data
}
