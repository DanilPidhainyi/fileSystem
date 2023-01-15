import {cd, ls, mkdir, mkfs, symlink} from "../../FS/commands.mjs";

(
    async () => {
        await mkfs(128)
        await mkdir('./newDir')
        await mkdir('./newDir/new2')
        await mkdir('./newDir/new2/new3')
        await cd('./newDir/new2')
        await ls()
        await symlink('newDir/new2/', 'root/link')
        await cd('root')
        await ls()
        await cd('./link')
        await ls()
    }
)()