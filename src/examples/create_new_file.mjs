import {create, ls, mkdir, mkfs, stat} from "../FS/commands.mjs";
import {synchronousCall} from "../FS/static/helpers.mjs";

// const _ = synchronousCall([
//
//     mkfs(128),
//     stat('./'),
//     mkdir('./newDir'),
//     stat('.'),
//     stat('./newDir'),
// ]);

(
    async () => {
        await mkfs(128)
        await stat('./')
        await mkdir('./newDir')
        await stat('.')
        await stat('./newDir')
    }
)()

// create('new file')
// console.log('ls = ', ls());
// console.log('stat new file= ', stat('new file'));