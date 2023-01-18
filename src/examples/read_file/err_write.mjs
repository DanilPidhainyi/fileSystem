import {close, create, fd, ls, mkfs, read, seek, write}
    from "../../FS/commands.mjs";
import {SIZE_CARRIER_INFORMATION} from "../../FS/static/constants.mjs";

(
    async () => {
        await mkfs(128)
        await create('./fileName')
        const file = await fd('./fileName')
        await close(file)
        await write(file, 0)
        const file2 = await fd('./fileName')
        await write(file2, SIZE_CARRIER_INFORMATION)
        await close(file2)
    }
)()






