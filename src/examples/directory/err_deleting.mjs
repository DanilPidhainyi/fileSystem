import {ls, mkdir, mkfs, rmdir} from "../../FS/commands.mjs";

(
    async () => {
        await mkfs(128)
        await mkdir('./newDir')
        await mkdir('./newDir/nestedDir')
        await rmdir('./newDir')
        await ls()
    }
)()