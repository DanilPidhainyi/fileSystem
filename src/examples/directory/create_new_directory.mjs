import {cd, ls, mkdir, mkfs, rmdir, stat} from "../../FS/commands.mjs";

(
    async () => {
        await mkfs(128)
        await stat('./')
        await mkdir('./newDir')
        await ls()
        await cd('./newDir')
        await ls()
    }
)()