import {cd, ls, mkdir, mkfs, stat}
        from "../../FS/commands.mjs";

(
    async () => {
        await mkfs(128)
        await stat('./')
        await ls()
        await mkdir('./newDir')
        await ls()
        await cd('./newDir')
        await ls()
    }
)()




