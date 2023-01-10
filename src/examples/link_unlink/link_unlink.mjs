import {create, link, ls, mkdir, mkfs, stat} from "../../FS/commands.mjs";

(
    async () => {
        await mkfs(128)
        await create('root/new File')
        await ls()
        await stat('.')
        await mkdir('./newDir')
        await stat('.')
        await link('./new File', './newDir')
        await stat('.')
        await ls()
    }
)()