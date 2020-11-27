import { appData as appDataConfig, appConst } from '../config'
import { file as fileConfig } from '../components/editor/Resource/config'
import { inArray } from './tool'
import Transcoder from './transcoder'

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
    if (inArray(ext, fileConfig.allowedVideoExts)) return appConst.FILE_VIDEO
    if (inArray(ext, fileConfig.allowedAudioExts)) return appConst.FILE_AUDIO
    if (inArray(ext, fileConfig.allowedPictureExts)) return appConst.FILE_PICTURE
    return appConst.FILE_UNKNOWN
}

export function fileType (path: string) {
    let { ext } = parseFileNameFromPath(path)
    return extType(ext)
}
