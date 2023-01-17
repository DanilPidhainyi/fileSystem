import {create, ls, mkdir, mkfs, rmdir} from "../../FS/commands.mjs";

(
    async () => {
        await mkfs(128)
        await mkdir('./newDir')
        await mkdir('./newDir/nestedDir')
        await rmdir('./non-existent folder')
        await rmdir('./newDir')
        await create('./newFile')
        await rmdir('./newFile')
        await ls()
    }
)()


