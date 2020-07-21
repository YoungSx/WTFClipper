export function parseFileNameFromPath (path:string) {
    let name = path.substring(path.lastIndexOf('/') + 1, path.length)
    let tempArr = name.split('.')
    let nameWithoutExt = tempArr[0]
    return {
        name,
        nameWithoutExt,
        ext: tempArr
    }
}