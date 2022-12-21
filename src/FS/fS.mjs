import {infoToBuffersList} from "./static/helpers.mjs";
import {device} from "./device/device.mjs";
import {BitMap} from "./blocks/BitMap.mjs";
import {NUMBER_OF_DESCRIPTORS} from "./static/constants.mjs";
import {Descriptor} from "./blocks/Descriptor.mjs";

export const fS = {
    bitMap: new BitMap(),

    writeInfoToFreeBlocks(info) {
        const bufferList = infoToBuffersList(info)
        const freeBlocks = this.bitMap.getFreeBlocks().slice(0, bufferList.length)
        device.writeBufferList(bufferList, freeBlocks)
        this.bitMap.setBusy(freeBlocks)
    },

    initializeBitMap() {
        this.bitMap = new BitMap()
        const needBlocks = infoToBuffersList(this.bitMap).length
        this.bitMap.setRange(0, needBlocks, 1)
        device.writeBlocMap(infoToBuffersList(this.bitMap))
    },

    initializeListDescriptors() {
        const descriptors = Array(NUMBER_OF_DESCRIPTORS).fill(new Descriptor())
        this.writeInfoToFreeBlocks(descriptors)
    },

    initializeFS(n) {
        device.initializationBlockDevice(n)
        this.initializeBitMap()
        this.initializeListDescriptors()
    },

}