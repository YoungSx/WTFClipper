export function inArray (search: any, array: any) {
    for(let i in array) {
        if(array[i] == search) {
            return true
        }
    }
    return false
}