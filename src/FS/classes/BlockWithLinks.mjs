import {device} from "../device/device.mjs";

export class BlockWithLinks {

    constructor(index, data) {
        this.index = index || null
        this.data = data || []
    }

    writeData() {
        const index = this.index
        const data = JSON.stringify(this.data)
        // todo data > block size => err
        return device.writeBlocMap({[index]: data})
    }

    async readData() {
        this.data = JSON.parse(await device.readBlocks([this.index]))
    }


    get() {
        return this.data
    }

    set(data) {
        this.data = data
    }
}