import {buffersListToInfo, infoToBuffersList, log, printErr, synchronousCall, toPath} from "./static/helpers.mjs";
import {device} from "./device/device.mjs";
import {BitMap} from "./blocks/BitMap.mjs";
import {
    BLOCK_SIZE,
    DIRECTORY,
    LINK_ROOT_DIRECTORY,
    NUMBER_OF_DESCRIPTORS, REGULAR,
    ROOT_DIRECTORY_NAME
} from "./static/constants.mjs";
import {Descriptor} from "./blocks/Descriptor.mjs";
import {
    errorFileNotOpen,
    errorNotFound,
    errorWrongParameters,
    errorWrongPath,
    errorWrongPathname
} from "./errors/errors.mjs";
import * as R from "ramda";

export const fS = {
    openDirectoryNow: null,
    openFilesNow: {}, // index Open File: {}

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
        if (!fatherDescriptor) {
            return errorWrongPath
        }
        let fatherContent = await fatherDescriptor.readContent()
        // todo test однакові імена
        fatherContent[path.at(-1)] = indexNewDesc

        await fatherDescriptor.writeContent(fatherContent)
        // console.log('fatherDescriptor=', fatherDescriptor)
        // console.log('fatherDescriptorIndex=', fatherDescriptorIndex)
        await this.updateDescriptor(fatherDescriptorIndex, fatherDescriptor)
        return null
    },

    async searchFileDescriptor(startDescriptorIndex, path) {
        if (path.length === 0) {
            return startDescriptorIndex
        }
        const content = await this.getDescriptor(startDescriptorIndex).readContent()
        const nextDescriptorIndex = content[R.head(path)]
        if (nextDescriptorIndex !== undefined) {
            return await this.searchFileDescriptor( nextDescriptorIndex, R.tail(path))
        } else {
            return errorWrongPath
        }
    },

    _stat(path) {
        if (path[0] === '.') {
            return this.searchFileDescriptor(this.openDirectoryNow, R.tail(path))
        }
        else if (path[0] === ROOT_DIRECTORY_NAME) {
            return this.searchFileDescriptor(LINK_ROOT_DIRECTORY, R.tail(path))
        }
        return 0
    },

    stat(pathname) {
        const path = toPath(pathname)
        return this._stat(path)
            .then(i => this.getDescriptor(i))
            .then(i => i || errorNotFound)
    },

    mkdir(pathname) {
        const path = toPath(pathname)
        const descriptor = new Descriptor(DIRECTORY, 0, 1,)
        return this.createFile(path, descriptor, null).then(printErr)
    },

    ls() {
        return this.getDescriptor(this.openDirectoryNow).readContent()
    },

    create(pathname) {
        const path = toPath(pathname)
        const descriptor = new Descriptor(REGULAR, 0, 1, null)
        return this.createFile(path, descriptor, null).then(printErr)
    },

    async fd(open_pathname) {
        const path = toPath(open_pathname)
        const newIndex = Object.keys(this.openFilesNow).reduce((a, b) => Math.max(a, b), -1) + 1
        const link = await this._stat(path)
        if (/\D/.test(link)) throw new Error(link)
        this.openFilesNow[newIndex] = {
            link: link,
            offset: 0
        }
        return newIndex
    },


    close(fd) {
        if (!this.openFilesNow[fd]) return errorFileNotOpen
        delete this.openFilesNow[fd]
    },

    async seek(fd, offset) {
        if (!this.openFilesNow[fd]) return errorFileNotOpen
        this.openFilesNow[fd].offset = offset
    },

    async read(fd, size) {
        if (!this.openFilesNow[fd]) return errorFileNotOpen
        const content = await this
            .getDescriptor(this.openFilesNow[fd].link)
            .readSize(this.openFilesNow[fd].offset, size)
        this.openFilesNow[fd].offset += size
        return content
    },

    async write(fd, size) {
        if (!this.openFilesNow[fd]) return errorFileNotOpen
        console.log('this.openFilesNow[fd].link', this.openFilesNow[fd].link)
        await this.getDescriptor(this.openFilesNow[fd].link)
                  .writeSize(this.openFilesNow[fd].offset, size)
        this.openFilesNow[fd].offset += size

    }
}