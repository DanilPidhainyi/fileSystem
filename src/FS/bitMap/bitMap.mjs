import {ALL_BLOCKS, BLOCK_SIZE} from "../static/constants.mjs";
import BitSet from "bitset";
import * as R from 'ramda'
import {splitArr} from "../static/helpers.mjs";
import {driver} from "../driver/driver.mjs";
import {fS} from "../fS.mjs";
import {errorMaxSizeDevice} from "../errors/errors.mjs";

export const bitMap = {

    initializeBitMap() {
        this.bs = new BitSet()
        this.bs.setRange(0, ALL_BLOCKS, 0)
        const needBlockForBitMap = Math.ceil(this.maxSize() / BLOCK_SIZE)
        this.linksOnBitMap = Array(needBlockForBitMap).fill().map((_, i) => i)
        this.bs.setRange(0, needBlockForBitMap, 1)
        return this.write()
    },

    toString() {
        return (
            splitArr(this.bs.data.join(''), 4)
                .map(str => parseInt(str, 2).toString(16))
                .join('')
        )
    },

    parseString(str) {
        this.bs.data = str.split('')
            .map(el => parseInt(el, 16).toString(2))
            .join('').split('')
            .map(el => parseInt(el, 2))
    },

    maxSize() {
        const max = Array(ALL_BLOCKS).fill(1)
        const str = splitArr(max.join(''), 4)
            .map(str => parseInt(str, 2).toString(16))
            .join('')
        return Math.ceil(str.length / BLOCK_SIZE)
    },

    write() {
        return fS.writeInfoToOldBlocks(this.toString(), this.linksOnBitMap)
    },

    read() {
        return this.parseArray(driver.readBlocks(this.linksOnBitMap))
    },

    parseArray(arr) {
        this.bs.data = arr
        return this
    },

    toArray() {
        return this.bs.data || []
    },

    toBuffer() {
        return this
    },

    parseBuffer(buffer) {
        this.parseArray(buffer)
        return this
    },

    getBusyBlocks() {
        return this.bs.toArray()
    },

    getFreeBlocks() {
        return R.clone(this.bs).flip().toArray()
    },

    setRange(fromIndex, toIndex, value) {
        this.bs.setRange(fromIndex, toIndex, value)
        return this
    },

    setBusy(map) {
        /**
         * @param map Arr
         * */
        map.forEach(el => this.bs.set(el, 1))
        return this
    },

    setFree(map) {
        /**
         * @param bitMap Buffer
         * @param map Arr
         * */
        map.forEach(el => this.bs.set(el, 0))
        return this
    },

    getForUse() {
        const free = this.getFreeBlocks()[0]
        this.setBusy([free])
        return free
    }

}
