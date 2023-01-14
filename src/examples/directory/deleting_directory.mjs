import {ls, mkdir, mkfs, rmdir, stat} from "../../FS/commands.mjs";

(
    async () => {
        await mkfs(128)
        await stat('./')
        await mkdir('./newDir')
        await stat('.')
        await ls()
        await rmdir('./newDir')
        await ls()
    }
)()