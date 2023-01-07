import BlockDevice from "blockdevice";
import {BLOCK_SIZE, NAME_CARRIER_INFORMATION, SIZE_CARRIER_INFORMATION} from "../static/constants.mjs";
import {catchErrs, log, print, printErr, readBuffer, synchronousCall} from "../static/helpers.mjs";


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

    openThen(callback) {
        return new Promise((resolve, reject) => {
            this.device.open((err, fd) => {
                if (err) return reject(err)
                resolve(callback())
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
        return this.openThen(() =>
            synchronousCall(
                arr.map(blocNumber => this._readBlock(blocNumber).catch(_ => null))
            ).then(log).catch(_ => null)
        )

        // return new Promise((resolve, reject) => {
        //     this.open(_ => {
        //         Promise.all(
        //             arr.map(blocNumber => this._readBlock(blocNumber).catch(_ => null))
        //         ).then(data => resolve(data)).catch(err => reject(err))
        //     })
        // })
    },

    // writeBlocMap(blocMap) {
    //     /**
    //      * @param blocMap Obj {blocNumber: buffer}
    //      * */
    //     this.open(_ => {
    //         Object.keys(blocMap).map(blocNumber => {
    //             this.device.writeBlocks(blocNumber, blocMap[blocNumber], printErr)
    //         })
    //     })
    // },

    writeBlocMap(blocMap) {
        /**
         * @param blocMap Obj {blocNumber: buffer}
         * */
        return this.openThen(() =>
            synchronousCall(
                Object.keys(blocMap).map(blocNumber => {
                    this.device.writeBlocks(blocNumber, blocMap[blocNumber], printErr)
                })
            ).catch(_ => null)
        )
    },

    writeBufferList(blocArr, freeBlocs) {
        return this.openThen(() =>
            synchronousCall(
                freeBlocs.map((blocNumber, index )=> {
                    this.device.writeBlocks(blocNumber, blocArr[index], printErr)
                })
            )).catch(_ => null)
    },

}

// device.initializationBlockDevice()
// device.writeBlocMap({1: Buffer.alloc(BLOCK_SIZE, 1), 2: Buffer.alloc(BLOCK_SIZE, 0)})
// device.readBlocks([1, 2])