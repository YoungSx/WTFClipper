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
        db.defaults({ name: value }).write()
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

    read (columen: string) {
        return this.db.map(columen).value()
    }
}
