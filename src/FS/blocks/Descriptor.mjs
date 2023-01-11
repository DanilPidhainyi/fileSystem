import {BitMap} from "./BitMap.mjs";
import {fS} from "../fS.mjs";
import {BLOCK_SIZE} from "../static/constants.mjs";
import {device} from "../device/device.mjs";
import {bufferSizeToBlockSize, correctSizeBuffer, log} from "../static/helpers.mjs";
import BitSet from "bitset";
import {all} from "ramda";
import {ByteSet} from "./ByteSet.mjs";

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
        const content = this.fileSize === 0 ? '' : await fS.readObjOnBitMap(this.map)
        return content.slice(offSet, offSet + size)
    }

    async writeSize(offSet, size) {
        const content = this.fileSize === 0 ? '' : await fS.readObjOnBitMap(this.map)
        const byteSet = new ByteSet()
        byteSet.parse(content)
        byteSet.setRange(offSet, offSet + size, 1)
        const newBusy = await fS.writeInfoToOldBitMap(byteSet.toString(), this.map)
        this.map = new BitMap().setBusy(newBusy)
        this.fileSize = newBusy.length * BLOCK_SIZE
        return null
    }

    async writeContent(content) {
        if (content !== null && content !== undefined) {
            await fS.writeInfoToFreeBlocks(content).then(writeBl => {
                this.map = new BitMap().setBusy(writeBl)
                this.fileSize = writeBl * BLOCK_SIZE
            })
        }
    }
}