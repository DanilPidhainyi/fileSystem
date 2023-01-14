import {fS} from "../fS.mjs";
import {BLOCK_SIZE} from "../static/constants.mjs";
import {ByteSet} from "./ByteSet.mjs";
import {BlockWithLinks} from "./BlockWithLinks.mjs";

export class Descriptor {
    constructor(fileType, fileSize, numberOfLinks, map) {
        this.fileType = fileType || null
        this.fileSize = fileSize || 0
        this.numberOfLinks = numberOfLinks || 0
        this.link = map || new BlockWithLinks() // linkOnBlockWithLinks
    }

    async readContent() {
        if (this.fileSize) {
            return await fS.readObjOnBlocks(this.link.get())
        } else {
            return {}
        }
    }

    async readSize(offSet, size) {
        const content = this.fileSize === 0 ? '' : await fS.readObjOnBlocks(this.link.get())
        return content.slice(offSet, offSet + size)
    }

    async writeSize(offSet, size) {
        const content = this.fileSize === 0 ? '' : await fS.readObjOnBlocks(this.link.get())
        const byteSet = new ByteSet()
        byteSet.parse(content)
        byteSet.setRange(offSet, offSet + size, 1)
        const newBusy = await fS.writeInfoToOldBlocks(byteSet.toString(), this.link.get())
        this.link.set(newBusy)
        this.fileSize = newBusy.length * BLOCK_SIZE
        return null
    }

    async writeContent(content) {
        if (content !== null && content !== undefined) {
            await fS.writeInfoToFreeBlocks(content).then(writeBl => {
                this.link.set(writeBl)
                this.fileSize = writeBl * BLOCK_SIZE
            })
        }
    }
}