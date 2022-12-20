import {NAME_CARRIER_INFORMATION} from "./constants.mjs";
import fs from "fs.js";

export const createFileForDevice = () => {
    fs.createWriteStream(NAME_CARRIER_INFORMATION).end();
}