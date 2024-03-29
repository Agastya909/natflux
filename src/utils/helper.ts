import fs from "fs";
import { MESSAGES } from "../constants";

function RemoveFile(path: string) {
  fs.unlink(path, error => {
    if (error) return MESSAGES.File.NOT_DELETED;
    return MESSAGES.File.DELETED;
  });
}
function CreateImageBase64(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        reject("Error reading image file");
      } else {
        const base64Image = Buffer.from(data).toString("base64");
        const dataUrl = `data:image/png;base64,${base64Image}`;
        resolve(dataUrl);
      }
    });
  });
}

export default { RemoveFile, CreateImageBase64 };
