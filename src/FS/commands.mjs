import {clearFile, createFileForDevice} from "./static/working_with_a_file.mjs";
import {fS} from "./fS.mjs";
import {isWrongPathname} from "./errors/tests.mjs";
import {log, print, toPath} from "./static/helpers.mjs";


export const mkfs = async n => {
    /**
     * ініціалізувати ФС
     * @param n Number кількість дескрипторів файлів
     * */
    console.log('mkfs')
    createFileForDevice()
    clearFile()
    return await fS.initializeFS(n)
}

export const stat = async pathname => {
    /**
     * – вивести інформацію про файл
     * (дані дескриптору файлу).
     * @param pathname String
     * */
    console.log()
    // return await print(isWrongPathname(pathname) || fS.stat(toPath(pathname)))
    return await fS.stat(toPath(pathname)).then(data => console.log(`stat(${pathname})`, data))
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

export const fd = open_pathname => {
    /**
     * відкрити звичайний файл, на який вказує шляхове ім’я pathname.
     * Команда повинна призначити найменший вільний номер (назвемо цей номер «числовий
     * дескриптор файлу») для роботи з відкритим файлом (це число – це не те саме, що номер
     * дескриптору файлу у ФС). Один файл може бути відкритий кілька разів. Кількість
     * числових дескрипторів файлів може бути обмежена.
     * @param pathname String
     * */
    return null
}

export const close = fd => {
    /**
     * закрити раніше відкритий файл з числовим дескриптором файлу fd, номер fd
     * стає вільним
     * @param pathname String
     * */
    return null
}

export const seek = (fd, offset) => {
    /**
     * seek fd offset – вказати зміщення для відкритого файлу, де почнеться наступне читання
     * з або запис у файл (далі «зміщення»). При відкритті файлу зміщення дорівнює нулю. Це
     * зміщення вказується тільки для цього fd.
     * */
    return null
}

export const read = (fd, size) => {
    /**
     * – прочитати size байт даних з відкритого файлу, до значення зміщення
     * додається size.
     * */
}

export const write = (fd, size) => {
    /**
     * записати size байт даних у відкритий файл, до значення зміщення
     * додається size.
     * */
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

export const mkdir = async pathname => {
    /**
     * створити нову директорію та створити жорстке посилання на неї,
     * вказане в pathname.
     * */

    return await fS.mkdir(pathname).then(data => console.log(`mkdir(${pathname})`, data))
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