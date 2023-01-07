import {buffersListToInfo, infoToBuffersList, log, synchronousCall, toPath} from "./static/helpers.mjs";
import {device} from "./device/device.mjs";
import {BitMap} from "./blocks/BitMap.mjs";
import {
    BLOCK_SIZE,
    DIRECTORY,
    LINK_ROOT_DIRECTORY,
    NUMBER_OF_DESCRIPTORS,
    ROOT_DIRECTORY_NAME
} from "./static/constants.mjs";
import {Descriptor} from "./blocks/Descriptor.mjs";
import {errorWrongParameters, errorWrongPath, errorWrongPathname} from "./errors/errors.mjs";
import * as R from "ramda";

export const fS = {
    openDirectoryNow: null,
    openFileNow: null,

    writeInfoToFreeBlocks(info) {
        const bufferList = infoToBuffersList(info)
        const freeBlocks = this.bitMap.getFreeBlocks().slice(0, bufferList.length)
        return device.writeBufferList(bufferList, freeBlocks)
            .then(() => this.bitMap.setBusy(freeBlocks))
            .then(() => freeBlocks)
            .catch(() => null)
    },

    writeInfoToOldBitMap(info, oldMap) {
        const bufferList = infoToBuffersList(info)
        const freeBlocks = oldMap.getBusyBlocks().concat(this.bitMap.getFreeBlocks()).slice(0, bufferList.length)
        return device.writeBufferList(bufferList, freeBlocks)
            .then(() => this.bitMap.setBusy(freeBlocks))
            .then(() => freeBlocks)
            .catch(() => null)
    },

    writeThisBitMap() {
        return device.writeBlocMap(infoToBuffersList(this.bitMap.toArray()))
    },

    writeDescriptors(descriptors=this.descriptors) {
        return this.writeInfoToFreeBlocks(descriptors).then(data => {
            // todo
            this.descriptorsMap = data
        })
    },

    initializeBitMap() {
        this.bitMap = new BitMap()
        const needBlocks = infoToBuffersList(this.bitMap.toArray()).length
        this.bitMap.setRange(0, needBlocks, 1)
        return this.writeThisBitMap()
    },

    initializeRootDirectory() {
        this.openDirectoryNow = LINK_ROOT_DIRECTORY
        return new Descriptor(DIRECTORY, 0, 1)
    },

    initializeListDescriptors() {
        this.descriptors = Array(NUMBER_OF_DESCRIPTORS).fill(new Descriptor())
        this.descriptors[LINK_ROOT_DIRECTORY] = this.initializeRootDirectory()
        return this.writeDescriptors()
    },

    initializeFS(n) {
        device.initializationBlockDevice(n)
        return synchronousCall([
            this.initializeBitMap(),
            this.initializeListDescriptors(),
        ])
    },

    readObjOnMap(arr) {
        return device.readBlocks(arr).then(buffersListToInfo).catch(console.log)
    },

    readObjOnBitMap(map) {
        return this.readObjOnMap(map.getBusyBlocks())
    },

    updateDescriptor(index, newValue) {
        this.descriptors[index] = newValue
        return this.writeDescriptors()
    },

    getDescriptor(index) {
        return this.descriptors[index]
    },



    addDescriptor(descriptor) {
        const free = Object.keys(this.descriptors).find(el => !this.descriptors[el].fileType)
        // todo err not free
        this.descriptors[free] = descriptor
        return free
    },



    async createFile(path, newDescriptor, content) {
        const fatherDescriptorIndex = await this._stat(path.slice(0, -1))
        await newDescriptor.writeContent(content)
        const indexNewDesc = this.addDescriptor(newDescriptor)
        // console.log('newDescriptor=', newDescriptor)
        // console.log('indexNewDesc=', indexNewDesc)

        const fatherDescriptor = this.getDescriptor(fatherDescriptorIndex)
        let fatherContent = await fatherDescriptor.readContent()
        // todo test однакові імена
        fatherContent[path.at(-1)] = indexNewDesc

        await fatherDescriptor.writeContent(fatherContent)
        // console.log('fatherDescriptor=', fatherDescriptor)
        // console.log('fatherDescriptorIndex=', fatherDescriptorIndex)
        await this.updateDescriptor(fatherDescriptorIndex, fatherDescriptor)
    },

    searchFileDescriptor(startDescriptor, path) {
        if (R.empty(path)) {
            return Promise.resolve(startDescriptor)
        }

        // todo get directory content
        return this.searchFileDescriptor(R.head(path), R.tail(path))
    },

    _stat(path) {
        if (path[0] === '.') {
            return this.searchFileDescriptor(this.openDirectoryNow, R.tail(path))
        }
        else if (path[0] === ROOT_DIRECTORY_NAME) {
            // todo get descriptor
            return  this.searchFileDescriptor(LINK_ROOT_DIRECTORY, R.tail(path))
        }
        else {
            return 0
        }
    },

    stat(path) {
        if (path) {
            return this._stat(path).then(i => this.getDescriptor(i))
                // .then(descriptor => {
                //     console.log('descriptor=', descriptor)
                //     descriptor.map = descriptor.map.toArray()
                //     return descriptor
                // })
        }
        else {
            return Promise.reject(errorWrongPath)
        }
    },

    mkdir(pathname) {
        const path = toPath(pathname)
        const descriptor = new Descriptor(DIRECTORY, 0, 1,)
        return this.createFile(path, descriptor, null) || null
    }

}