import fs from "fs";
import { MESSAGES } from "../constants";

function RemoveFile(path: string) {
  fs.unlink(path, error => {
    if (error) return MESSAGES.File.NOT_DELETED;
    return MESSAGES.File.DELETED;
  });
}

export default { RemoveFile };
