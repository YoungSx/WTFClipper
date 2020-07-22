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