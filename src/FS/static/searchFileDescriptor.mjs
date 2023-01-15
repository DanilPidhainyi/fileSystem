import {DIRECTORY, LINK_ROOT_DIRECTORY, MAX_SWITCHOVER, REGULAR, SYMLINK} from "./constants.mjs";
import {errorMaxSwitchover, errorOnFile, errorWrongPath} from "../errors/errors.mjs";
import {listDescriptors} from "../listDescriptors/listDescriptors.mjs";
import * as R from "ramda";
import {toPath} from "./helpers.mjs";

export async function searchFileDescriptor (
    startDescriptorIndex, path, numSwitch=0, oldIndex=null
) {
    if (numSwitch > MAX_SWITCHOVER) return errorMaxSwitchover
    const descriptor = await listDescriptors.getDescriptor(startDescriptorIndex)
    if (path.length === 0 && descriptor.fileType !== SYMLINK) {
        return startDescriptorIndex
    }

    const content = await descriptor.readContent()
    if (!content) return errorWrongPath

    if (descriptor.fileType === DIRECTORY) {
        const nextDescriptorIndex = content[R.head(path)]
        if (!nextDescriptorIndex) return errorWrongPath
        return await searchFileDescriptor(
            nextDescriptorIndex,
            R.tail(path),
            numSwitch + 1,
            oldIndex = startDescriptorIndex
        )
    }

    if (descriptor.fileType === SYMLINK) {
        const symlinkPath = toPath(content.str)
        const newPath = [...symlinkPath, ...R.tail(path)]
        if (content.str[0] === '/') {
            return await searchFileDescriptor(
                LINK_ROOT_DIRECTORY,
                newPath,
                numSwitch + 1,
                startDescriptorIndex
            )
        }
        else {
            return await searchFileDescriptor(
                oldIndex,
                newPath,
                numSwitch + 1,
                startDescriptorIndex
            )
        }
    }

    if (descriptor.fileType === REGULAR) {
        return errorOnFile
    }
}