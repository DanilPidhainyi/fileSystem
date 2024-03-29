import {create, fd, ls, mkfs, close, seek, write, read} from "../../FS/commands.mjs";

(
    async () => {
        await mkfs(128)
        await create('./fileName')
        await ls()
        const file = await fd('./fileName')
        const file2 = await fd('./fileName')
        console.log('file =', file)
        console.log('file2 =', file2)
        await write(file, 10)
        await seek(file, 5)
        await read(file, 10)
        await close(file)
        await close(file2)
    }
)()