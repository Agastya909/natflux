import { NextFunction, Request, Response } from "express";
import { VideoService } from "../services/index";
import { MESSAGES } from "../constants";
import { Validation } from "../utils";

async function getVideoById(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.params.id) return res.status(400).send(MESSAGES.VideoData.NO_ID);
    const videoId = req.params.id;
    const videoData = await VideoService.getVideoById(videoId);
    if (!videoData) return res.status(404).send(MESSAGES.Video.NO_VIDEO);
    res.status(200).json({ message: MESSAGES.Video.VIDEO_FOUND, data: videoData });
  } catch (error) {
    res.status(500).send(MESSAGES.HTTP_RESPONSES.SERVER_ERROR);
  }
}

async function addVideo(req: Request, res: Response, next: NextFunction) {
  try {
    const required = ["title", "summary", "genre", "release_date"];
    const validate = Validation.ValidateRequiredFields(req.body, required);
    if (!validate) return res.status(400).send("All are required : " + required);
    const { title, summary, genre, release_date } = req.body;
    const filepath = res.locals.filePath;
    const isExistingTitle = await VideoService.getVideoByTitle(req.body.title);
    if (isExistingTitle) return res.status(400).send(MESSAGES.Video.TITLE_IN_USE);

    const videoRes = await VideoService.addVideoDetails({
      title: title,
      genre: genre,
      length: res.locals.videoDuration,
      path: filepath,
      release_date: release_date,
      summary: summary,
      thumbnail_path: "/home/agastya/Entertainment/test.png"
      // put an actual thumbnail path here by generating random screenshot and storing them to disk using fs
    });
    res.status(200).json({
      message: MESSAGES.Video.VIDEO_ADDED,
      data: videoRes
    });
  } catch (error) {
    res.status(500).send(MESSAGES.HTTP_RESPONSES.SERVER_ERROR);
  }
}

export default { getVideoById, addVideo };
