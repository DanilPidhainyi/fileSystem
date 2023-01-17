import {create, ls, mkdir, mkfs}
    from "../../FS/commands.mjs";

(
    async () => {
        await mkfs(128)
        await mkdir('')
        await mkdir('./non-existent folder/new')
        await mkdir('./new:^')
        await create('./newFile')
        await mkdir('./newFile/newDir')
        await mkdir('./new very long name')
        await ls()
    }
)()




