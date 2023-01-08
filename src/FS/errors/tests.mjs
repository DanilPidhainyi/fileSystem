import {errorWrongPathname} from "./errors.mjs";

export const isWrongPathname = pathname => {
    if (typeof pathname !== 'string') {
        return Promise.resolve(errorWrongPathname)
    }
    return false
}

