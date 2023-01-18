import {
    buffersListToInfo,
    infoToBuffersList, isNotValidFileName,
    toPath,
    toVueDs, toVueLs
} from "./static/helpers.mjs";
import {driver} from "./driver/driver.mjs";
import {bitMap} from "./bitMap/bitMap.mjs";
import {
    BLOCK_SIZE,
    DIRECTORY,
    LINK_ROOT_DIRECTORY, MAX_FILE_SIZE, REGULAR,
    ROOT_DIRECTORY_NAME, SYMLINK
} from "./static/constants.mjs";
import {Descriptor} from "./classes/Descriptor.mjs";
import {
    errorDirectoryNotEmpty,
    errorFileNameIsDuplicated,
    errorFileNotOpen, errorMaxSizeDevice, errorMaxSwitchover, errorNotDirInFile,
    errorNotFound, errorOnFile, errorToNumberDes,
    errorWrongPath, errorТoDiskSpace,
} from "./errors/errors.mjs";
import * as R from "ramda";
import {listDescriptors} from "./listDescriptors/listDescriptors.mjs";
import {searchFileDescriptor} from "./static/searchFileDescriptor.mjs";

export const fS = {
    openDirectoryNow: null,
    openFilesNow: {}, // index Open File: {}

    async writeEmptyToFreeBlocks(numBlocks) {
        const free = bitMap.getFreeBlocks().slice(0, numBlocks)
        if (numBlocks > free.length) return errorMaxSizeDevice
        await driver.clearBlocks(free)
        await bitMap.setBusy(free)
        return free
    },

    writeInfoToOldBlocks(info, arrBlocks) {
        const bufferList = infoToBuffersList(info)
        const freeBlocks = arrBlocks.concat(bitMap.getFreeBlocks()).slice(0, bufferList.length)
        if (bufferList.length > freeBlocks.length) return errorMaxSizeDevice
        return driver.writeBufferList(bufferList, freeBlocks)
            .then(() => bitMap.setBusy(freeBlocks))
            .then(() => freeBlocks)
            .catch(() => null)
    },

    readObjOnBlocks(arr) {
        return driver.readBlocks(arr).then(buffersListToInfo).catch(console.log)
    },

    async initializeRootDirectory() {
        this.openDirectoryNow = LINK_ROOT_DIRECTORY
        const root = new Descriptor(DIRECTORY, 0, 1)
        await root.writeContent({
            '.': LINK_ROOT_DIRECTORY,
            '..': LINK_ROOT_DIRECTORY
        })
        return listDescriptors.setByIndex(LINK_ROOT_DIRECTORY, root)
    },

    async initializeFS(n) {
        await driver.initializationBlockDevice(n)
        await bitMap.initializeBitMap()
        await listDescriptors.initializeListDescriptors(n)
        await this.initializeRootDirectory()
    },

    async createFile(path, newDescriptor, content) {
        const fatherDescriptorIndex = await this._stat(path.slice(0, -1))
        if (typeof fatherDescriptorIndex !== "number") return fatherDescriptorIndex
        await newDescriptor.writeContent(content)
        const indexNewDesc = + await listDescriptors.addDescriptor(newDescriptor)
        if (isNaN(indexNewDesc)) return errorToNumberDes
        await this._link(indexNewDesc, fatherDescriptorIndex, path)
        return indexNewDesc
    },


    _stat(path) {
        if (path[0] === '.') {
            return searchFileDescriptor(this.openDirectoryNow, R.tail(path))
        }
        else if (path[0] === ROOT_DIRECTORY_NAME) {
            return searchFileDescriptor(LINK_ROOT_DIRECTORY, R.tail(path))
        }
        else if (path[0] === '..') {
            return searchFileDescriptor(this.openDirectoryNow, path)
        }
        return 0
    },

    stat(pathname) {
        const path = toPath(pathname)
        return this._stat(path)
            .then(i => toVueDs(listDescriptors.getDescriptor(i)))
            .then(i => i || errorNotFound)
    },


    async mkdir(pathname) {
        const path = toPath(pathname)
        const err = isNotValidFileName(path[path.length -1])
        if (err) return err
        if (!await this.isDirectory(path.slice(0, -1).join('/'))) return errorNotDirInFile
        const descriptor = new Descriptor(DIRECTORY)
        const index = await this.createFile(path, descriptor)
        if (typeof index !== "number") return index
        await descriptor.writeContent({
            '.': index,
            '..': await this._stat(path.slice(0, -1))
        })
    },

    isDirectory(pathname) {
        const path = toPath(pathname)
        return this._stat(path)
            .then(index => listDescriptors.getDescriptor(index))
            .then(el => el && el.fileType === DIRECTORY)
    },


    async rmdir(pathname) {
        const path = toPath(pathname)
        if (!await this.isDirectory(pathname)) return errorWrongPath
        const isEmptyDirectory = await this._stat(path)
            .then(index => listDescriptors.getDescriptor(index))
            .then(async el => el.fileType === DIRECTORY &&
                Object.keys(await el.readContent()).length < 3)

        if(!isEmptyDirectory) return errorDirectoryNotEmpty

        return await this.unlink(pathname)
    },

    ls() {
        return listDescriptors.getDescriptor(this.openDirectoryNow).readContent().then(toVueLs)
    },

    async create(pathname) {
        const path = toPath(pathname)
        const err = isNotValidFileName(path[path.length -1])
        if (err) return err
        const descriptor = new Descriptor(REGULAR)
        const index = await this.createFile(path, descriptor, null)
        if (typeof index === "string") return index
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
        if (this.openFilesNow[fd].offset + size > MAX_FILE_SIZE) return errorТoDiskSpace
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
            return null
        }
        const path = toPath(pathname)
        const index = await this._stat(path)
        if (!Number.isInteger(+index)) return index
        const descriptor = await listDescriptors.getDescriptor(index)
        if (descriptor && (descriptor.fileType !== DIRECTORY)) return errorOnFile
        this.openDirectoryNow = index
    },

    async truncate(pathname, size) {
        const path = toPath(pathname)
        const index = await this._stat(path)
        const descriptor = await listDescriptors.getDescriptor(index)

        if (descriptor.fileSize === size) return null
        if (descriptor.fileSize > size) {
            const rmBl = Math.ceil((descriptor.fileSize - size) / BLOCK_SIZE)
            descriptor.rm(rmBl)
            return listDescriptors.updateDescriptor(index, descriptor)
        }
        if (descriptor.fileSize < size) {
            const newBl = Math.ceil((size - descriptor.fileSize) / BLOCK_SIZE)
            descriptor.add(await fS.writeEmptyToFreeBlocks(newBl))
            return listDescriptors.updateDescriptor(index, descriptor)
        }
    },

    async symlink(str, pathname) {
        const path = toPath(pathname)
        const err = isNotValidFileName(path[path.length -1])
        if (err) return err
        const descriptor = new Descriptor(SYMLINK)
        const index = await this.createFile(path, descriptor)
        await descriptor.writeContent({str: str})
    }
}