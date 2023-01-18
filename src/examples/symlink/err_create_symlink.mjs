import {cd, mkdir, mkfs, symlink} from "../../FS/commands.mjs";

(
    async () => {
            await mkfs(128)
            await mkdir('./newDir')
            await symlink('newDir/link2', 'root/link')
            await symlink('/link', 'root/newDir/link2')
            await cd('./link')
    }
)()








