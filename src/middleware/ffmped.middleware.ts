import { NextFunction, Request, Response } from "express";
import ffmpeg from "fluent-ffmpeg";
import { MESSAGES } from "../constants";
import { Helpers } from "../utils";

function getVideoDuration(req: Request, res: Response, next: NextFunction) {
  const filePath = req.file?.path || req.body.path;
  if (!filePath) return res.status(500).send("File save path error");
  ffmpeg.ffprobe(filePath, (error, data) => {
    if (error) res.status(500).send(MESSAGES.HTTP_RESPONSES.SERVER_ERROR);
    if (data && data.format && data.format.duration) {
      if (data.format.duration === 0) {
        Helpers.RemoveFile(filePath);
        return res.status(500).send("File duration error");
      }
      res.locals.videoDuration = data.format.duration;
      res.locals.filePath = filePath;
      next();
    }
  });
}

export default { getVideoDuration };
