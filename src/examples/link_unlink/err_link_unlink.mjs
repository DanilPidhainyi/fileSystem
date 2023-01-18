import { create, link,  mkdir, mkfs} from "../../FS/commands.mjs";

(
    async () => {
        await mkfs(128)
        await create('root/new File')
        await mkdir('./newDir')
        await link('./newDir', './newDir')
    }
)()



