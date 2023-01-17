import {ls, mkdir, mkfs, rmdir}
        from "../../FS/commands.mjs";

(
    async () => {
        await mkfs(128)
        await ls()
        await mkdir('./newDir')
        await ls()
        await rmdir('./newDir')
        await ls()
    }
)()





