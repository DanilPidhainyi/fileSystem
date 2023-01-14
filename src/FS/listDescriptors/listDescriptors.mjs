import {
    MAX_NUMBER_OF_DESCRIPTORS,
} from "../static/constants.mjs";
import {Descriptor} from "../classes/Descriptor.mjs";
import {errorWrongDescriptionNumber} from "../errors/errors.mjs";
import {fS} from "../fS.mjs";

export const listDescriptors = {
    initializeListDescriptors(n) {
        if (n < 1 || n > MAX_NUMBER_OF_DESCRIPTORS) return errorWrongDescriptionNumber
        this.descriptors = Array(n).fill(new Descriptor())
        this.linksOnDescriptors = []
        return this.write()
    },

    async write() {
        this.linksOnDescriptors =
            await fS.writeInfoToOldBlocks(this.descriptors, this.linksOnDescriptors)
    },

    async read() {
        this.descriptors = await fS.readObjOnBlocks(this.descriptors)
    },

    setByIndex(index, descriptor) {
        this.descriptors[index] = descriptor
        return this.write()
    },

    updateDescriptor(index, newValue) {
        return this.setByIndex(index, newValue)
    },

    getDescriptor(index) {
        return this.descriptors[index]
    },

    async addDescriptor(descriptor) {
        const free = Object.keys(this.descriptors).find(el => !this.descriptors[el].fileType)
        // todo err not free
        await this.setByIndex(free, descriptor)
        return free
    },

}