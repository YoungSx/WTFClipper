export function inArray (search: any, array: any) {
    for(let i in array) {
        if(array[i] == search) {
            return true
        }
    }
    return false
}

export function deepCopy(source: any): any {
    if(null == source || {} == source || [] == source) return source
    let newObject : any
    let isArray = false
    if((source as any).length) {
        newObject = []
        isArray = true
    } else {
        newObject = {}
        isArray = false
    }
    for (let key of Object.keys(source)) {
        if(null == source[key]) {
            if (isArray) newObject.push(null)
            else newObject[key] = null
        } else {
            let sub = (typeof source[key] == 'object') ? deepCopy(source[key]) : source[key]
            if(isArray) newObject.push(sub)
            else newObject[key] = sub
        }
    }
    return newObject
}
