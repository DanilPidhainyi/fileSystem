import {cd, ls, mkdir, mkfs, stat} from "../../FS/commands.mjs";

(
    async () => {
        await mkfs(128)
        await mkdir('./newDir')
        await cd('./newDir')
        await ls()
        await mkdir('./new2')
        await ls()
        await cd('./new2')
        await ls()
        await cd('..')
        await ls()
        await cd()
        await ls()
    }
)()