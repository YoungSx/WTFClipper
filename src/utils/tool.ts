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
    if((source as any).length !== undefined) {
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

export function cellTime (level: number, min: number = 1, max: number = 3) {
    const middle = 50
    switch (level) {
        case 1:
            return 60 * 60 * 1000
        case 3:
            return 1000 / 30
        default:
            return 1000
    }
}

export function addZero (num: number, len: number = 2) {
    return (`0${num}`).slice(-len)
}
