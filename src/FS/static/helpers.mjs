import {BLOCK_SIZE} from "./constants.mjs";

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

export const bufferSizeToBlockSize = buffer => {
    /**
     * @param buffer Buffer
     * */
    return Math.ceil(buffer.length / BLOCK_SIZE)
}

export const splitBufferOnBlocks = buffer => {
    return buffer // todo
}

export const readBuffer = (error, buffer, bytesRead) => {
    printErr(error)
    return buffer
}

export const buffersListToString = buffersList => {
    return buffersList.map(el => el.toString('utf8')).join('')
}

export const buffersListToInfo = buffersList => {
    console.log(buffersListToString(buffersList))
    return JSON.parse(buffersListToString(buffersList))
}