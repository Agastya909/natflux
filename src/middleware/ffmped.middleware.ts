import { NextFunction, Request, Response } from "express";
import ffmpeg from "fluent-ffmpeg";
import { MESSAGES } from "../constants";
import { Helpers } from "../utils";

function getVideoDuration(req: Request, res: Response, next: NextFunction) {
  const filePath = req.file?.path || req.body.path;
  if (!filePath) return res.status(500).send("Get Duration: File path error");
  ffmpeg.ffprobe(filePath, (error, data) => {
    if (error) res.status(500).send(MESSAGES.HTTP_RESPONSES.SERVER_ERROR);
    if (data && data.format && data.format.duration) {
      if (data.format.duration === 0) {
        Helpers.RemoveFile(filePath);
        return res.status(500).send("File duration error");
      }
      res.locals.videoDuration = data.format.duration;
      res.locals.videoSize = data.format.size;
      res.locals.filePath = filePath;
      next();
    }
  });
}

function getRandomThumbnail(req: Request, res: Response, next: NextFunction) {
  const filePath = res.locals.filePath;
  if (!filePath) return res.status(500).send("Create Thumbnail: File path error");
  const thumbnailName = req.body.title + "_thumbnail" + ".png";
  ffmpeg({ source: filePath }).screenshot({
    timestamps: [res.locals.videoDuration / 5],
    folder: "/home/agastya/Entertainment/",
    filename: thumbnailName
  });
  res.locals.thumbnailPath = "/home/agastya/Entertainment/" + thumbnailName;
  next();
}

function getFileMetaData(req: Request, res: Response, next: NextFunction) {
  const filePath = res.locals.filePath;
  if (!filePath) return res.status(500).send("Get file meta data: File path error");
  ffmpeg.ffprobe(filePath, (error, data) => {
    if (error) res.status(500).send(MESSAGES.HTTP_RESPONSES.SERVER_ERROR);
    if (data && data.format) {
      res.locals.videoSize = data.format.size;
      next();
    }
  });
}

export default { getVideoDuration, getRandomThumbnail, getFileMetaData };
