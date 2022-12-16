import {createFileForDevice} from "./FS/blocks/working_with_a_file.mjs";
import {device} from "./FS/blocks/BlockDevice.mjs";


export const mkfs = n => {
    /**
     * ініціалізувати ФС
     * @param n Number кількість дескрипторів файлів
     * */
    createFileForDevice()
    device.initializationBlockDevice(n)
    return null
}

export const stat = pathname => {
    /**
     * – вивести інформацію про файл
     * (дані дескриптору файлу).
     * @param pathname String
     * */
    return null
}

export const ls = () => {
    /**
     * вивести список жорстких посилань на файли в CWD
     * із зазначенням номерів
     * дескрипторів файлів
     * */
    return null
}

export const create = pathname => {
    /**
     * створити новий звичайний файл та створити відповідне жорстке
     * посилання на нього
     * @param pathname String
     * */
    return null
}