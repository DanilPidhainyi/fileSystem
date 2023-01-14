import {
    buffersListToInfo,
    infoToBuffersList,
    printErr,
    toPath,
    toVueDs
} from "./static/helpers.mjs";
import {device} from "./device/device.mjs";
import {bitMap} from "./bitMap/bitMap.mjs";
import {
    DIRECTORY,
    LINK_ROOT_DIRECTORY, REGULAR,
    ROOT_DIRECTORY_NAME
} from "./static/constants.mjs";
import {Descriptor} from "./classes/Descriptor.mjs";
import {
    errorDirectoryNotEmpty,
    errorFileNameIsDuplicated,
    errorFileNotOpen,
    errorNotFound,
    errorWrongPath,
} from "./errors/errors.mjs";
import * as R from "ramda";
import {listDescriptors} from "./listDescriptors/listDescriptors.mjs";

export const fS = {
    openDirectoryNow: null,
    openFilesNow: {}, // index Open File: {}

    writeInfoToFreeBlocks(info) {
        const bufferList = infoToBuffersList(info)
        const freeBlocks = bitMap.getFreeBlocks().slice(0, bufferList.length)
        return device.writeBufferList(bufferList, freeBlocks)
            .then(() => bitMap.setBusy(freeBlocks))
            .then(() => freeBlocks)
            .catch(() => null)
    },

    writeInfoToOldBlocks(info, arrBlocks) {
        const bufferList = infoToBuffersList(info)
        const freeBlocks = arrBlocks.concat(bitMap.getFreeBlocks()).slice(0, bufferList.length)
        return device.writeBufferList(bufferList, freeBlocks)
            .then(() => bitMap.setBusy(freeBlocks))
            .then(() => freeBlocks)
            .catch(() => null)
    },


    initializeRootDirectory() {
        this.openDirectoryNow = LINK_ROOT_DIRECTORY
        const root = new Descriptor(DIRECTORY, 0, 1)
        return listDescriptors.setByIndex(LINK_ROOT_DIRECTORY, root)
    },

    async initializeFS(n) {
        await device.initializationBlockDevice(n)
        await bitMap.initializeBitMap()
        await listDescriptors.initializeListDescriptors(n)
        await this.initializeRootDirectory()
    },

    readObjOnBlocks(arr) {
        return device.readBlocks(arr).then(buffersListToInfo).catch(console.log)
    },

    async createFile(path, newDescriptor, content) {
        const fatherDescriptorIndex = await this._stat(path.slice(0, -1))
        await newDescriptor.writeContent(content)
        const indexNewDesc = await listDescriptors.addDescriptor(newDescriptor)
        await this._link(indexNewDesc, fatherDescriptorIndex, path)
        return null
    },

    async searchFileDescriptor(startDescriptorIndex, path) {
        if (path.length === 0) {
            return startDescriptorIndex
        }
        const content = await listDescriptors.getDescriptor(startDescriptorIndex).readContent() || {}
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
            .then(i => toVueDs(listDescriptors.getDescriptor(i)))
            .then(i => i || errorNotFound)
    },

    mkdir(pathname) {
        const path = toPath(pathname)
        const descriptor = new Descriptor(DIRECTORY)
        return this.createFile(path, descriptor, null).then(printErr)
    },

    isDirectory(pathname) {
        return this.stat(pathname).then(el => el.fileType === DIRECTORY)
    },


    async rmdir(pathname) {
        const isEmptyDirectory = await this.stat(pathname)
            .then(el => el.fileType === DIRECTORY && el.fileSize === 0)

        if(!isEmptyDirectory) return errorDirectoryNotEmpty

        return await this.unlink(pathname)
    },

    ls() {
        return listDescriptors.getDescriptor(this.openDirectoryNow).readContent()
    },

    create(pathname) {
        const path = toPath(pathname)
        const descriptor = new Descriptor(REGULAR)
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
        const content = await listDescriptors
            .getDescriptor(this.openFilesNow[fd].link)
            .readSize(this.openFilesNow[fd].offset, size)
        this.openFilesNow[fd].offset += size
        return content
    },

    async write(fd, size) {
        if (!this.openFilesNow[fd]) return errorFileNotOpen
        await listDescriptors
            .getDescriptor(this.openFilesNow[fd].link)
            .writeSize(this.openFilesNow[fd].offset, size)
        this.openFilesNow[fd].offset += size
    },

    async _link(indexChild, indexFather, pathChild) {
        const fatherDescriptor = listDescriptors.getDescriptor(indexFather)
        const childDescriptor = listDescriptors.getDescriptor(indexChild)

        if (!fatherDescriptor || !childDescriptor) return errorWrongPath

        let fatherContent = await fatherDescriptor.readContent()

        if (fatherContent[pathChild[pathChild.length -1]]) return errorFileNameIsDuplicated

        fatherContent[pathChild[pathChild.length -1]] = indexChild

        await fatherDescriptor.writeContent(fatherContent)
        childDescriptor.numberOfLinks += 1
        await listDescriptors.updateDescriptor(indexChild, childDescriptor)
        await listDescriptors.updateDescriptor(indexFather, fatherDescriptor)
    },

    async link(pathname1, pathname2) {
        const path1 = toPath(pathname1)
        const path2 = toPath(pathname2)
        const index1 = await this._stat(path1)
        const index2 = await this._stat(path2)
        return await this._link(index1, index2, path1)
    },

    async unlink(pathname) {
        const pathChild = toPath(pathname)
        const pathFather = pathChild.slice(0, -1)
        const indexChild = await this._stat(pathChild)
        const indexFather = await this._stat(pathFather)
        const fatherDescriptor = listDescriptors.getDescriptor(indexFather)
        let childDescriptor = listDescriptors.getDescriptor(indexChild)

        if (!fatherDescriptor || !childDescriptor) return errorWrongPath

        let fatherContent = await fatherDescriptor.readContent()


        delete fatherContent[pathChild[pathChild.length -1]]

        await fatherDescriptor.writeContent(fatherContent)
        childDescriptor.numberOfLinks -= 1
        if (childDescriptor.numberOfLinks === 0) {
            childDescriptor = new Descriptor()
        }
        await listDescriptors.updateDescriptor(indexChild, childDescriptor)
        await listDescriptors.updateDescriptor(indexFather, fatherDescriptor)

    },


    async cd(pathname) {
        if (!pathname) {
            this.openDirectoryNow = LINK_ROOT_DIRECTORY
        } else {
            const path = toPath(pathname)
            const newPath = await this._stat(path)
            if (Number.isInteger(+newPath)){
                this.openDirectoryNow = newPath
            } else {
                return newPath
            }
        }
    }
}