const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)

export class dataBase {

    name: string
    db: any

    constructor (name: string) {
        this.name = name
        this.db = db.get(this.name)
    }

    static create (name: string, value: any) {
        let obj: {
            [key: string]: []
        } = {}
        obj[name] = value
        db.defaults(obj).write()
    }
    
    static exist (name: string) {
        return db.has(name).value()
    }

    static drop (name: string) {
        return false
    }

    push (data: {}) {
        return this.db.push(data).write()
    }

    read () {
        return this.db.value()
    }

    readColumn (column: string) {
        return this.db.map(column).value()
    }
}
