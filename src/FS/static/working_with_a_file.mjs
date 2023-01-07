import {NAME_CARRIER_INFORMATION} from "./constants.mjs";
import fs from "fs";

export const createFileForDevice = () => {
    fs.createWriteStream(NAME_CARRIER_INFORMATION).end();
}

export const clearFile = () => {
    fs.writeFileSync(NAME_CARRIER_INFORMATION, '')
}