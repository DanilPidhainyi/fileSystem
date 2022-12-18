import {BLOCK_SIZE} from "../constants.mjs";

export const print = (err, xx) => {
    console.log('err=', err)
    console.log('xx=', xx)
}

export const catchErrs = callback => err => {
    if (!err) {
        return callback()
    }
    return err
}

export const printErr = err => {
    if (err) {
        console.log('err=', err)
    }
}

// export const infoToBuffer = info => {
//     return Buffer.from(JSON.stringify(info), 'utf-8')
// }

export const splitByBlocSize = info => {
    const maxChars = Math.floor(BLOCK_SIZE / 2)
    return JSON.stringify(info).match(new RegExp(`[^]{1,${maxChars}}`, 'g'));
}

export const infoToBuffersList = info => {
    const stringList = splitByBlocSize(info)
    return Array(stringList.length)
        .fill(new Buffer.alloc(BLOCK_SIZE))
        .map((el, i) => {
            el.write(stringList[i], 'utf-8')
            return el
        })
}