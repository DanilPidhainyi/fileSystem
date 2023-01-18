import {create, fd, mkfs, close, seek, write, read}
        from "../../FS/commands.mjs";

(
    async () => {
        await mkfs(128)
        await create('./fileName')
        const file = await fd('./fileName')
        const file2 = await fd('./fileName')
        console.log('file =', file)
        console.log('file2 =', file2)
        await write(file, 10)
        await seek(file, 12)
        await write(file, 3)
        await seek(file, 5)
        await read(file, 50)
        await close(file)
        await close(file2)
    }
)()













