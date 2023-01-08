import {BitMap} from "./BitMap.mjs";
import {fS} from "../fS.mjs";
import {BLOCK_SIZE} from "../static/constants.mjs";
import {device} from "../device/device.mjs";
import {bufferSizeToBlockSize, correctSizeBuffer} from "../static/helpers.mjs";

export class Descriptor {
    constructor(fileType, fileSize, numberOfLinks, map) {
        this.fileType = fileType || null
        this.fileSize = fileSize || 0
        this.numberOfLinks = numberOfLinks || 0
        this.map = map || new BitMap()
    }

    async readContent() {
        if (this.fileSize) {
            return await fS.readObjOnBitMap(this.map)
        } else {
            return {}
        }
    }

    async readSize(offSet, size) {
        bufferSizeToBlockSize()

        await device.readBlocks(arr)
        if (this.fileSize) {
            return await fS.readObjOnBitMap(this.map)
        } else {
            return ''
        }
    }

    async writeContent(offSet, size) {
        if (content !== null && content !== undefined) {
            await fS.writeInfoToFreeBlocks(content).then(writeBl => {
                this.map = new BitMap().setBusy(writeBl)
                this.fileSize = writeBl * BLOCK_SIZE
            })
        }
    }
}