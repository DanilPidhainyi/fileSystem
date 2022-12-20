import BlockDevice from "blockdevice";
import {BLOCK_SIZE, NAME_CARRIER_INFORMATION, SIZE_CARRIER_INFORMATION} from "../static/constants.mjs";
import {Descriptor} from "../blocks/Descriptor.mjs";
import {catchErrs, printErr, infoToBuffersList} from "../static/helpers.mjs";


export const device = {

    initializationBlockDevice() {
        this.device = new BlockDevice({
            path: NAME_CARRIER_INFORMATION,
            size: SIZE_CARRIER_INFORMATION,
            mode: 'a',
            blockSize: BLOCK_SIZE
        })
    },

    open(callback) {
        this.device.open(catchErrs(callback))
    },

    readBlocks() {
        //return this.device.writeBlocks(0, new Buffer(''), () => {})
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

    writeBuffer(buffer, arrBlocks) {
        this.open(_ => {

        })
    },


    createDescriptors(fd) {
        const descriptors = Array(fd).map(_ => new Descriptor())
    }

}
