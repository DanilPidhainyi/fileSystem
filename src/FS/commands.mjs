import {clearFile, createFileForDevice} from "./static/working_with_a_file.mjs";
import {fS} from "./fS.mjs";
import {isWrongPathname} from "./errors/tests.mjs";
import {print, printErr, toPath} from "./static/helpers.mjs";


export const mkfs = n => {
    /**
     * ініціалізувати ФС
     * @param n Number кількість дескрипторів файлів
     * */
    console.log('-------- mkfs --------')
    createFileForDevice()
    clearFile()
    return fS.initializeFS(n) || null
}

export const stat = pathname => {
    /**
     * – вивести інформацію про файл
     * (дані дескриптору файлу).
     * @param pathname String
     * */
    console.log(`-------- stat(${pathname}) --------`)
    return print(isWrongPathname(pathname) || fS.stat(pathname))
}

export const ls = () => {
    /**
     * вивести список жорстких посилань на файли в CWD
     * із зазначенням номерів
     * дескрипторів файлів
     * */
    console.log(`-------- ls() --------`)
    return print(fS.ls())
}

export const create = pathname => {
    /**
     * створити новий звичайний файл та створити відповідне жорстке
     * посилання на нього
     * @param pathname String
     * */
    console.log(`-------- create(${pathname}) -------- `)
    return isWrongPathname(pathname) || fS.create(pathname)
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
    console.log(`-------- fd(${open_pathname}) -------- `)
    return isWrongPathname(open_pathname) || fS.fd(open_pathname)
}

export const close = fd => {
    /**
     * закрити раніше відкритий файл з числовим дескриптором файлу fd, номер fd
     * стає вільним
     * @param pathname String
     * */
    console.log(`-------- close(${fd}) -------- `)
    return printErr(fS.close(fd))
}

export const seek = (fd, offset) => {
    /**
     * seek fd offset – вказати зміщення для відкритого файлу, де почнеться наступне читання
     * з або запис у файл (далі «зміщення»). При відкритті файлу зміщення дорівнює нулю. Це
     * зміщення вказується тільки для цього fd.
     * */
    console.log(`-------- seek(${fd}, ${offset}) -------- `)
    return fS.seek(fd, offset || 0)
}

export const read = (fd, size) => {
    /**
     * – прочитати size байт даних з відкритого файлу, до значення зміщення
     * додається size.
     * */
    console.log(`-------- read(${fd}, ${size}) -------- `)r
    return fS.read(fd, size)
}

export const write = (fd, size) => {
    /**
     * записати size байт даних у відкритий файл, до значення зміщення
     * додається size.
     * */
    console.log(`-------- write(${fd}, ${size}) -------- `)
    return fS.write(fd, size)
}

export const link = (pathname1, pathname2) => {
    /**
     * створити жорстке посилання, вказане в pathname2, на файл,
     * на який вказує шляхове ім’я pathname1
     * */
}

export const unlink = pathname => {
    /**
     * знищити жорстке посилання на файл, вказане в pathname
     * */
}

export const truncate = (pathname, size) => {
    /**
     * змінити розмір файлу, на який вказує шляхове ім’я pathname.
     * Якщо розмір файлу збільшується, тоді неініціалізовані дані дорівнюють нулям.
     * */
}

export const mkdir = pathname => {
    /**
     * створити нову директорію та створити жорстке посилання на неї,
     * вказане в pathname.
     * */
    console.log(`mkdir(${pathname})---------------------------------------`)
    return isWrongPathname(pathname) || fS.mkdir(pathname)
}

export const rmdir = pathname => {
    /**
     * звільнити порожню директорію на яке вказує шляхове ім’я, та знищити
     * відповідне жорстке посилання на неї (вміст директорії не повинен мати жодного
     * жорсткого посилання, крім наперед визначених жорстких посилань з іменами . та ..).
     * */
}

export const cd = pathname => {
    /**
     * змінити поточну робочу директорію.
     * */
}

export const symlink = (str, pathname) => {
    /**
     * створити символічне посилання з вмістом str та створити на
     * нього відповідне жорстке посилання. Максимальна довжина вмісту
     * символічного посилання str не має перевищувати розмір одного блоку.
     * */
}