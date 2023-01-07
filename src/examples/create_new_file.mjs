import {create, ls, mkdir, mkfs, stat} from "../FS/commands.mjs";
import {synchronousCall} from "../FS/static/helpers.mjs";


(
    async () => {
        await mkfs(128)
        await stat('./')
        await mkdir('./newDir')
        await mkdir('./newDir/newDrr/newDrw')
        await stat('.')
        await stat('./newDir/newDrr/newDrw')
    }
)()

// create('new file')
// console.log('ls = ', ls());
// console.log('stat new file= ', stat('new file'));