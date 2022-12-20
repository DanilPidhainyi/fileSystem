import {create} from "../commands.mjs";
import {bitMap} from "./blocks/BitMap.mjs";
import {bufferSizeToBlockSize, infoToBuffersList} from "./static/helpers.mjs";
import {device} from "./blocks/BlockDevice.mjs";

export const FS = {
    bitMap: null,

    writeInfoToFreeBlocks (info) {
        // todo tests blocs
        device.writeBlocMap(infoToBuffersList(info))
    },

    initializeBitMap() {
        this.bitMap = bitMap.createMap()
        const needBlocks = bufferSizeToBlockSize(this.bitMap)
        const busyBlocks = Array(needBlocks).map((_, i) => i)
        this.bitMap = bitMap.setBusy(this.bitMap, busyBlocks)
        device.writeBlocMap()

    },

    initializeFS(n) {
        device.initializationBlockDevice(n)

    },



}