import {BLOCK_SIZE} from "./constants.mjs";

export const synchronousCall = async arr => {
    /**
     * required for a synchronous call Promises
     * */
    const res = []

    for (const item of arr) {
        res.push(await item)
    }
    return res
}

export const print = promise =>
    promise.then(console.log).catch(console.log)


export const log = ell => {
    console.log('log=', ell)
    return ell
}

export const catchErrs = callback => err => {
    if (!err) {
        return callback()
    }
    return err
}

export const printErr = async err => {
    const er = await err
    if (er) {
        console.log('err=', er)
    }
}

export const logErr = err => {
    console.log('error=', err)
}

export const splitByBlocSize = info => {
    const maxChars = Math.floor(BLOCK_SIZE / 2)
    return JSON.stringify(info).match(new RegExp(`[^]{1,${maxChars}}`, 'g'));
}

export const toPath = pathname => pathname.split('/').filter(el => el) || []

export const infoToBuffersList = info => {
    return splitBufferOnBlocks(
        Buffer.from(JSON.stringify(info))
    )
}

export const bufferSizeToBlockSize = buffer => {
    /**
     * @param buffer Buffer
     * */
    return Math.ceil(buffer.length / BLOCK_SIZE)
}

export const correctSizeBuffer = buffer => {
    const needBlocs = bufferSizeToBlockSize(buffer)
    const correctBuffer = Buffer.alloc(needBlocs * BLOCK_SIZE)
    correctBuffer.set(buffer)
    return correctBuffer
}

export const splitBufferOnBlocks = buffer => {
    const correctBuf = correctSizeBuffer(buffer)
    return Array(bufferSizeToBlockSize(correctBuf)).fill(0).map((_, i) => {
        return correctBuf.slice(i * BLOCK_SIZE, (i + 1) * BLOCK_SIZE)
    })
}

export const readBuffer = (error, buffer, bytesRead) => {
    printErr(error)
    return buffer
}

export const buffersListToInfo = buffersList => {
    const data = Buffer.concat(buffersList).toString().replace(/\x00/g, '')
    return JSON.parse(data);
}

export const toVueDs = ds => {
    return (
        `Дескриптор: 
  Тип файлу: ${ds.fileType}
  Розмір файлу: ${ds.fileSize}
  Кількість жорстких посилань: ${ds.numberOfLinks}
  Номери зайнятих боків: ${ds.map.getBusyBlocks().join(', ')}`
    )
}