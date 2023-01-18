import {create, ls, mkfs, stat, truncate} from "../../FS/commands.mjs";
import {BLOCK_SIZE} from "../../FS/static/constants.mjs";


(
    async () => {
        await mkfs(128)
        await create('./new File')
        await stat('./new File')
        await truncate('./new File', BLOCK_SIZE * 2 + 1)
        await stat('./new File')
        await truncate('./new File', BLOCK_SIZE)
        await stat('./new File')
    }
)()


