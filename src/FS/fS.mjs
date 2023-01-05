import {buffersListToInfo, infoToBuffersList} from "./static/helpers.mjs";
import {device} from "./device/device.mjs";
import {BitMap} from "./blocks/BitMap.mjs";
import {DIRECTORY, LINK_ROOT_DIRECTORY, NUMBER_OF_DESCRIPTORS, ROOT_DIRECTORY_NAME} from "./static/constants.mjs";
import {Descriptor} from "./blocks/Descriptor.mjs";
import {errorWrongPath} from "./errors/errors.mjs";
import * as R from "ramda";

export const fS = {
    openDirectoryNow: null,
    openFileNow: null,

    writeInfoToFreeBlocks(info) {
        const bufferList = infoToBuffersList(info)
        const freeBlocks = this.bitMap.getFreeBlocks().slice(0, bufferList.length)
        device.writeBufferList(bufferList, freeBlocks)
        return this.bitMap.setBusy(freeBlocks)
    },

    readObjOnMap(arr) {
        return device.readBlocks(arr).then(buffersListToInfo).catch(console.log)
    },

    readObjOnBitMap(map) {
        return this.readObjOnMap(map.getBusyBlocks()).then(console.log)
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


    getFileContent(descriptor=this.openDirectoryNow) {
        // todo
        console.log(this.openDirectoryNow)
        console.log(buffersListToInfo(device.readBlocks(descriptor.map)))

    },

    getDescriptors() {
        this.descriptors = this.readObjOnBitMap(this.descriptorsMap)
        console.log('this.descriptors=', this.descriptors)
        return this.descriptors
    },

    createDirectory(pathname) {
        return new Descriptor(DIRECTORY, 0, 0, [])
    },


    searchFileDescriptor(startDescriptor, path) {
        if (R.empty(path)) {
            return startDescriptor
        }
        // todo get directory content
        return this.searchFileDescriptor(R.head(path), R.tail(path))
    },

    stat(pathname) {
        // todo
        const path = pathname.split('/') || []
        if (path[0] === '.') {
            return this.searchFileDescriptor(this.openDirectoryNow, R.tail(path))
        }
        else if (path[0] === ROOT_DIRECTORY_NAME) {
            // todo get descriptor
            return  this.searchFileDescriptor(this.descriptors[LINK_ROOT_DIRECTORY], R.tail(path))
        }
        else {
            throw errorWrongPath
        }
    }
}