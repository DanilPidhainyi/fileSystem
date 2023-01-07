import {create, ls, mkfs, stat} from "../FS/commands.mjs";
import {synchronousCall} from "../FS/static/helpers.mjs";

const _ = synchronousCall([

    mkfs(128),
    stat('')
]);

// create('new file')
// console.log('ls = ', ls());
// console.log('stat new file= ', stat('new file'));