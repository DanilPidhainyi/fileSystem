import {cd, create, link, ls, mkdir, mkfs, stat, unlink}
        from "../../FS/commands.mjs";

(
    async () => {
        await mkfs(128)
        await create('root/new File')
        await mkdir('./newDir')
        await ls()
        await link('./new File', './newDir')
        await stat('./new File')
        await cd('./newDir')
        await ls()
        await cd()
        await ls()
        await unlink('./newDir/new File')
        await stat('./new File')
        await ls()
    }
)()












