import {driver} from "../driver/driver.mjs";

export class BlockWithLinks {

    constructor(index, data) {
        this.index = index || null
        this.data = data || []
    }

    writeData() {
        const index = this.index
        const data = JSON.stringify(this.data)
        return driver.writeBlocMap({[index]: data})
    }

    async readData() {
        this.data = JSON.parse(await driver.readBlocks([this.index]))
    }


    get() {
        return this.data
    }

    set(data) {
        this.data = data
    }

    add(bl) {
        this.data = [...this.data, ...bl]
    }
}