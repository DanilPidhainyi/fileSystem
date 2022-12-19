import {ALL_BLOCKS} from "../constants.mjs";

export const BitMap = {

    createMap() {
        return Buffer.alloc(ALL_BLOCKS, 0)
    },

    getBusyBlocks(bitMap) {
        /**
         * @param bitMap Buffer
         * */
        return [...bitMap].map((el, i) => el === 0 ? null : i).filter(el => el !== null)
    },

    getFreeBlocks(bitMap) {
        /**
         * @param bitMap Buffer
         * */
        return [...bitMap].map((el, i) => el === 0 ? i : null).filter(el => el !== null)
    },

    setBusy(bitMap, map) {
        /**
         * @param bitMap Buffer
         * @param map Arr
         * */
        map.forEach(el => bitMap[el] = 1)
        return bitMap
    },

    setFree(bitMap, map) {
        /**
         * @param bitMap Buffer
         * @param map Arr
         * */
        map.forEach(el => bitMap[el] = 0)
        return bitMap
    },


}