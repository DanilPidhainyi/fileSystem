import {bufferSizeToBlockSize, infoToBuffersList} from "./static/helpers.mjs";
import {device} from "./blocks/BlockDevice.mjs";
import {BitMap} from "./blocks/BitMap.mjs";

export const fS = {
    bitMap: null,

    writeInfoToFreeBlocks (info) {
        // todo tests blocs
        device.writeBlocMap(infoToBuffersList(info))
    },

    initializeBitMap() {
        this.bitMap = new BitMap()
        const needBlocks = infoToBuffersList(this.bitMap).length
        this.bitMap.setRange(0, needBlocks, 1)
        device.writeBlocMap(infoToBuffersList(this.bitMap))
    },

    initializeFS(n) {
        device.initializationBlockDevice(n)
        this.initializeBitMap()
    },

}