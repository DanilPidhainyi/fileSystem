import {BitMap} from "./BitMap.mjs";
import {fS} from "../fS.mjs";
import {BLOCK_SIZE, BLOCK_SIZE_BIT} from "../static/constants.mjs";
import {device} from "../device/device.mjs";
import {bufferSizeToBlockSize, correctSizeBuffer, sizeToBlockSize} from "../static/helpers.mjs";
import BitSet from "bitset";

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
        // const startBloc = sizeToBlockSize(offSet) - 1
        // const endBloc = sizeToBlockSize(size) + startBloc
        // const allBlocs = this.map.getBusyBlocks()
        // const buffer = Buffer.concat(await device.readBlocks(allBlocs.slice(startBloc, endBloc)))
        // const starRead = offSet % BLOCK_SIZE_BIT
        // console.log('buffer', buffer)
        // BitSet()
        // return buffer.slice(starRead, starRead + size)
    }

    async writeSize(offSet, size) {
        console.log('size=', size)
        console.log('size.toString(16)=', size.toString(16))
        return null
        // const startBloc = sizeToBlockSize(offSet) - 1
        // const endBloc = sizeToBlockSize(size) + startBloc
        // const allBlocs = this.map.getBusyBlocks()
        // const buffer = Buffer.concat(await device.readBlocks(allBlocs.slice(startBloc, endBloc)))
        // const starRead = offSet % BLOCK_SIZE
        // return buffer.slice(starRead, starRead + size)
        //
        //
        // await device.readBlocks(arr)
        // if (this.fileSize) {
        //     return await fS.readObjOnBitMap(this.map)
        // } else {
        //     return ''
        // }
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