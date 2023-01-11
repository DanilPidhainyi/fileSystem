import {create, ls, mkdir, mkfs, stat} from "../../FS/commands.mjs";

(
    async () => {
        await mkfs(128)
        await stat('./')
        await create('./new File')
        await stat('.')
        await ls()
    }
)()