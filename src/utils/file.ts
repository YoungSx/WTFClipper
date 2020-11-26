import { appData as appDataConfig } from '../config'
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

export function getCoverImage (src: string, callback: any) {
    let inputPath = src
    inputPath = inputPath.replace('{%RESOURCE_HOME%}', appDataConfig.RESOURCE_HOME)
    const transcoder = new Transcoder()
    transcoder.generateCoverImage(inputPath, (result: string) => {
        callback(result)
    })
}

export function UUID() {
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
  
