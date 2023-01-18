import {create, ls, mkfs, stat} from "../../FS/commands.mjs";

(
    async () => {
        await mkfs(1)
        await create('./new File')
        await ls()
    }
)()