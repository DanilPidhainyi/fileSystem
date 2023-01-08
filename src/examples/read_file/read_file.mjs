import {create, fd, ls, mkfs, close, seek, write} from "../../FS/commands.mjs";

(
    async () => {
        await mkfs(128)
        await create('./fileName')
        await ls()
        const file = await fd('./fileName')
        const file2 = await fd('./fileName')
        console.log('file =', file)
        console.log('file2 =', file2)
            await write(file, size)
        await seek(file, 5)

        await close(file)
        await close(file2)
    }
)()