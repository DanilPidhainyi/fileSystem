import BlockDevice from "blockdevice";
import {BLOCK_SIZE, NAME_CARRIER_INFORMATION, SIZE_CARRIER_INFORMATION} from "../static/constants.mjs";
import {catchErrs, printErr, readBuffer} from "../static/helpers.mjs";
import util from "util";


export const device = {

    initializationBlockDevice() {
        this.device = new BlockDevice({
            path: NAME_CARRIER_INFORMATION,
            size: SIZE_CARRIER_INFORMATION,
            mode: 'r+',
            fd: 0,
            blockSize: BLOCK_SIZE
        })
    },

    open(callback) {
        return this.device.open(catchErrs(callback))
    },

    openThen() {
        // todo don`t work
        return new Promise((resolve, reject) => {
            this.device.open((err, fd) => {
                if (err) return reject(err)
                resolve(fd)
            })
        })
    },

    _readBlock(blocNumber) {
        return new Promise((resolve, reject) => {
            this.device.readBlocks(blocNumber, blocNumber + 1, (error, buff) => {
                if (error) return reject(error)
                resolve(buff)
            })
        })
    },

    readBlocks(arr) {
        return new Promise((resolve, reject) => {
            this.open(_ => {
                Promise.all(
                    arr.map(blocNumber => this._readBlock(blocNumber).catch(_ => null))
                ).then(data => resolve(data)).catch(err => reject(err))
            })
        })
    },

    writeBlocMap(blocMap) {
        /**
         * @param blocMap Obj {blocNumber: buffer}
         * */
        this.open(_ => {
            Object.keys(blocMap).map(blocNumber => {
                this.device.writeBlocks(blocNumber, blocMap[blocNumber], printErr)
            })
        })
    },

    writeBufferList(blocArr, freeBlocs) {
        this.open(_ => {
            freeBlocs.map((blocNumber, index )=> {
                this.device.writeBlocks(blocNumber, blocArr[index], printErr)
            })
        })
    },

}

// device.initializationBlockDevice()
// device.writeBlocMap({1: Buffer.alloc(BLOCK_SIZE, 1), 2: Buffer.alloc(BLOCK_SIZE, 0)})
// device.readBlocks([1, 2])