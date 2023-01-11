import {ls, mkdir, mkfs, stat} from "../../FS/commands.mjs";

(
    async () => {
        await mkfs(128)
        await stat('./')
        await mkdir('./newDir')
        await stat('.')
        await ls()
        await stat('./newDir')
    }
)()