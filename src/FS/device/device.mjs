import BlockDevice from "blockdevice";
import {BLOCK_SIZE, NAME_CARRIER_INFORMATION, SIZE_CARRIER_INFORMATION} from "../static/constants.mjs";
import {catchErrs, logErr} from "../static/helpers.mjs";


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

    _writeBlocks(fromLBA, buffer) {
        return new Promise((resolve, reject) => {
            this.device.writeBlocks(fromLBA, buffer, (error, item) => {
                if (error) return reject(error)
                resolve(item)
            })
        })
    },

    readBlocks(arr) {
        return this.openThen(async () => {
            let res = []
            for (const blocNumber of arr) {
                res.push(await this._readBlock(blocNumber).catch(_ => null))
            }
            return res
        })
    },

    writeBlocMap(blocMap) {
        /**
         * @param blocMap Obj {blocNumber: buffer}
         * */
        return this.openThen(async () => {
            for (const blocNumber in blocMap) {
                await this._writeBlocks(blocNumber, blocMap[blocNumber]).catch(logErr)
            }
        })
    },


    writeBufferList(blocArr, freeBlocs) {
        return this.openThen(async () => {
            for (let i = 0; i < freeBlocs.length; i++) {
                await this._writeBlocks(freeBlocs[i], blocArr[i]).catch(logErr)
            }
        })
    },

}