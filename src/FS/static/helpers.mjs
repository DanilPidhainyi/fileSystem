import {BLOCK_SIZE, MAX_NAME_SIZE} from "./constants.mjs";
import {errorDirectoryNotEmpty, errorLongName, errorSymbol, errorWrongPathname} from "../errors/errors.mjs";

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

export const splitArr = (arr, sizeOne) => {
    const sizeNewArr = Math.ceil(arr.length / sizeOne)
    return Array(sizeNewArr).fill().map((_, i) => arr.slice(i * sizeOne, (i + 1) * sizeOne))
}

export const toVueLs = obj => {
    if (Object.keys(obj).length === 0) return 'Директорія порожня'
    return '' + Object.keys(obj).map(el => `  ${el}: ${obj[el]}`).join('\n')
}

export const toVueDs = ds => {
    return (
        `Дескриптор: 
  Тип файлу: ${ds.fileType}
  Розмір файлу: ${ds.fileSize}
  Кількість жорстких посилань: ${ds.numberOfLinks}`
    + (ds.fileSize ?
    ` 
  Посилання на блок 
  з посиланнями на блоки: ${ds.link.index}
  Посилання на блоки ${ds.link.get()}`:
`
  Посилання на блок з блоками відсутнє`))
}

export const printCommand = (command, data, isWorn) => {
    if (isWorn) {
        console.log('\x1b[41m', command, '\x1b[0m', data)
    } else {
        if (data.length > 1) {
            data = '\n' + data
        }
        console.log('\x1b[42m', command,'\x1b[0m', data);
    }
}

export const print = (command, promise) =>
    promise.then(el => printCommand(command, el))
        .catch(er => printCommand(command, er, true) )

export const printErr = async (command, err) => {
    const er = await err
    if (er) {
        printCommand(command, er, true)
    } else {
        printCommand(command, '')
    }
}

export const isNotValidFileName = name => {
    if (!name) return errorWrongPathname
    if ( name.length > MAX_NAME_SIZE) return errorLongName
    if (/[^\w \d]+/i.test(name)) return errorSymbol
}