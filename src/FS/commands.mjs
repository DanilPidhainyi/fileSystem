import {clearFile, createFileForDevice} from "./static/working_with_a_file.mjs";
import {fS} from "./fS.mjs";
import {isWrongPathname} from "./errors/tests.mjs";
import {print, printErr, printFd} from "./static/helpers.mjs";
import {errorItsDirectory} from "./errors/errors.mjs";


export const mkfs = n => {
    /**
     * ініціалізувати ФС
     * @param n Number кількість дескрипторів файлів
     * */
    createFileForDevice()
    clearFile()
    return printErr('mkfs ', fS.initializeFS(n))
}

export const stat = pathname => {
    /**
     * – вивести інформацію про файл
     * (дані дескриптору файлу).
     * @param pathname String
     * */
    const res = isWrongPathname(pathname) || fS.stat(pathname)
    return print(`stat ${pathname} `, res)
}

export const ls = () => {
    /**
     * вивести список жорстких посилань на файли в CWD
     * із зазначенням номерів
     * дескрипторів файлів
     * */
    return print('ls ', fS.ls())
}

export const create = pathname => {
    /**
     * створити новий звичайний файл та створити відповідне жорстке
     * посилання на нього
     * @param pathname String
     * */

    const res = isWrongPathname(pathname) || fS.create(pathname)
    return printErr(`create ${pathname} `, res)
}

export const fd = open_pathname => {
    /**
     * відкрити звичайний файл, на який вказує шляхове ім’я pathname.
     * Команда повинна призначити найменший вільний номер (назвемо цей номер «числовий
     * дескриптор файлу») для роботи з відкритим файлом (це число – це не те саме, що номер
     * дескриптору файлу у ФС). Один файл може бути відкритий кілька разів. Кількість
     * числових дескрипторів файлів може бути обмежена.
     * @param pathname String
     * */

    const res = isWrongPathname(open_pathname) || fS.fd(open_pathname)
    return printFd(`fd ${open_pathname} `, res)
}

export const close = fd => {
    /**
     * закрити раніше відкритий файл з числовим дескриптором файлу fd, номер fd
     * стає вільним
     * @param pathname String
     * */
    return printErr(`close ${fd}`, fS.close(fd))
}

export const seek = (fd, offset) => {
    /**
     * seek fd offset – вказати зміщення для відкритого файлу, де почнеться наступне читання
     * з або запис у файл (далі «зміщення»). При відкритті файлу зміщення дорівнює нулю. Це
     * зміщення вказується тільки для цього fd.
     * */
    const res = fS.seek(fd, offset || 0)
    return printErr(`seek ${fd} ${offset} `, res)
}

export const read = (fd, size) => {
    /**
     * – прочитати size байт даних з відкритого файлу, до значення зміщення
     * додається size.
     * */
    return print(`read ${fd} ${size} `, fS.read(fd, size))
}

export const write = (fd, size) => {
    /**
     * записати size байт даних у відкритий файл, до значення зміщення
     * додається size.
     * */
    return printErr(`write ${fd}, ${size} `, fS.write(fd, size))
}

export const link = async (pathname1, pathname2) => {
    /**
     * створити жорстке посилання, вказане в pathname2, на файл,
     * на який вказує шляхове ім’я pathname1
     * */
    const command = `link ${pathname1}, ${pathname2} `
    if (await fS.isDirectory(pathname1)) return printErr(command, errorItsDirectory)
    return printErr(command, fS.link(pathname1, pathname2))
}

export const unlink = async pathname => {
    /**
     * знищити жорстке посилання на файл, вказане в pathname
     * */
    const command = `unlink ${pathname}`
    if (await fS.isDirectory(pathname)) return printErr(command, errorItsDirectory)
    const res = isWrongPathname(pathname) || fS.unlink(pathname)
    return printErr(command, res)
}

export const truncate = async (pathname, size) => {
    /**
     * змінити розмір файлу, на який вказує шляхове ім’я pathname.
     * Якщо розмір файлу збільшується, тоді неініціалізовані дані дорівнюють нулям.
     * */
    if (await fS.isDirectory(pathname)) return errorItsDirectory
    const res = isWrongPathname(pathname) || fS.truncate(pathname, size)
    return printErr(`truncate ${pathname}, ${size}`, res)
}

export const mkdir = pathname => {
    /**
     * створити нову директорію та створити жорстке посилання на неї,
     * вказане в pathname.
     * */
    const res = isWrongPathname(pathname) || fS.mkdir(pathname)
    return printErr(`mkdir ${pathname} `, res)
}

export const rmdir = pathname => {
    /**
     * звільнити порожню директорію на яке вказує шляхове ім’я, та знищити
     * відповідне жорстке посилання на неї (вміст директорії не повинен мати жодного
     * жорсткого посилання, крім наперед визначених жорстких посилань з іменами . та ..).
     * */
    const res = isWrongPathname(pathname) || fS.rmdir(pathname)
    return printErr(`rmdir ${pathname} `, res)
}

export const cd = pathname => {
    /**
     * змінити поточну робочу директорію.
     * */
    return printErr(`cd ${pathname || ''} `, fS.cd(pathname))
}

export const symlink = (str, pathname) => {
    /**
     * створити символічне посилання з вмістом str та створити на
     * нього відповідне жорстке посилання. Максимальна довжина вмісту
     * символічного посилання str не має перевищувати розмір одного блоку.
     * */
    const res = isWrongPathname(pathname) || fS.symlink(str, pathname)
    return printErr(`symlink ${str} ${pathname} `, res)
}