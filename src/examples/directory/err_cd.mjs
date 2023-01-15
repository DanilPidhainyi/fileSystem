import {cd, ls, mkdir, mkfs} from "../../FS/commands.mjs";

(
    async () => {
        await mkfs(128)
        await mkdir('./newDir')
        await cd('./newDir/new2')
        await ls()
    }
)()