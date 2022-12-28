import {infoToBuffersList} from "./static/helpers.mjs";
import {device} from "./device/device.mjs";
import {BitMap} from "./blocks/BitMap.mjs";
import {DIRECTORY, LINK_ROOT_DIRECTORY, NUMBER_OF_DESCRIPTORS} from "./static/constants.mjs";
import {Descriptor} from "./blocks/Descriptor.mjs";

export const fS = {
    openDirectoryNow: null,
    openFileNow: null,

    writeInfoToFreeBlocks(info) {
        const bufferList = infoToBuffersList(info)
        const freeBlocks = this.bitMap.getFreeBlocks().slice(0, bufferList.length)
        device.writeBufferList(bufferList, freeBlocks)
        return this.bitMap.setBusy(freeBlocks)
    },

    readObjOnMap(map) {
        device.readBlocks(map)
    },

    readObjOnBitMap(map) {
        this.readObjOnMap(map.toArray())
    },

    initializeBitMap() {
        this.bitMap = new BitMap()
        const needBlocks = infoToBuffersList(this.bitMap).length
        this.bitMap.setRange(0, needBlocks, 1)
        device.writeBlocMap(infoToBuffersList(this.bitMap))
    },

    initializeRootDirectory() {
        this.openDirectoryNow = new Descriptor(DIRECTORY, 0, 1, [])
        return this.openDirectoryNow
    },

    initializeListDescriptors() {
        this.descriptors = Array(NUMBER_OF_DESCRIPTORS).fill(new Descriptor())
        this.descriptors[LINK_ROOT_DIRECTORY] = this.initializeRootDirectory()
        this.descriptorsMap = this.writeInfoToFreeBlocks(this.descriptors)
    },

    initializeFS(n) {
        device.initializationBlockDevice(n)
        this.initializeBitMap()
        this.initializeListDescriptors()
    },

    getFileContent(descriptor) {
        device.readBlocks(descriptor.map)
    },

    createDirectory(pathname) {
        return new Descriptor(DIRECTORY, 0, 0, [])
    }
}