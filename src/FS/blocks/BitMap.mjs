import {ALL_BLOCKS} from "../static/constants.mjs";
import BitSet from "bitset";
import * as R from 'ramda'

export class BitMap {

    constructor() {
        this.bs = new BitSet
        this.bs.setRange(0, ALL_BLOCKS, 0)
    }

    parseArray(arr) {
        this.bs.data = arr
        return this
    }

    toArray() {
        return this.bs.data || []
    }

    toBuffer() {
        return this
    }

    parseBuffer(buffer) {
        this.parseArray(buffer)
        return this
    }

    getBusyBlocks() {
        return this.bs.toArray()
    }

    getFreeBlocks() {
        return R.clone(this.bs).flip().toArray()
    }

    setRange(fromIndex, toIndex, value) {
        this.bs.setRange(fromIndex, toIndex, value)
        return this
    }

    setBusy(map) {
        /**
         * @param map Arr
         * */
        map.forEach(el => this.bs.set(el, 1))
        return this
    }

    setFree(map) {
        /**
         * @param bitMap Buffer
         * @param map Arr
         * */
        map.forEach(el => this.bs.set(el, 0))
        return this
    }


}

