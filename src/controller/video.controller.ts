import { NextFunction, Request, Response } from "express";
import { VideoService } from "../services/index";
import { MESSAGES } from "../constants";
import { Validation } from "../utils";
import fs from "fs";
import { Helpers } from "../utils/index";

async function getVideoById(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.params.id) return res.status(400).send(MESSAGES.VideoData.NO_ID);
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
    const required = ["title", "summary", "genre", "release_date", "uploader_id"];
    const validate = Validation.ValidateRequiredFields(req.body, required);
    if (!validate) return res.status(400).send("All are required : " + required);
    const { title, summary, genre, release_date, uploader_id } = req.body;
    const filepath = res.locals.filePath;
    const isExistingTitle = await VideoService.getVideoByTitle(req.body.title);
    if (isExistingTitle) return res.status(400).send(MESSAGES.Video.TITLE_IN_USE);
    const videoRes = await VideoService.addVideoDetails({
      title: title,
      genre: genre,
      length: res.locals.videoDuration,
      size: res.locals.videoSize,
      path: filepath,
      release_date: release_date,
      summary: summary,
      thumbnail_path: res.locals.thumbnailPath,
      uploader_id: uploader_id
    });
    res.status(200).json({
      message: MESSAGES.Video.VIDEO_ADDED,
      data: videoRes
    });
  } catch (error) {
    res.status(500).send(MESSAGES.HTTP_RESPONSES.SERVER_ERROR);
  }
}

async function sendVideoStream(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.params.id) return res.status(400).send(MESSAGES.VideoData.NO_ID);
    const videoId = req.params.id;
    const videoData = await VideoService.getVideoById(videoId);
    if (!videoData) return res.status(404).send(MESSAGES.Video.NO_VIDEO);

    const { path } = videoData;
    const fileStat = fs.statSync(path);
    const fileSize = fileStat.size;
    const range = req.headers.range;
    if (range) {
      const CHUNK_SIZE = 12 ** 6;
      const start = Number(range.replace(/\D/g, ""));
      const end = Math.min(start + CHUNK_SIZE, fileSize - 1);
      const contentLength = end - start + 1;
      const customHeaders = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4"
      };
      const fileStream = fs.createReadStream(path);
      fileStream.pipe(res);
      res.writeHead(206, customHeaders);
    } else {
      const customHeaders = {
        "Accept-Ranges": "bytes",
        "Content-Type": "video/mp4"
      };
      const fileStream = fs.createReadStream(path);
      res.writeHead(206, customHeaders);
      fileStream.pipe(res);
    }
  } catch (error) {
    res.status(500).send(MESSAGES.Video.ERROR);
  }
}

const getHomeFeed = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { offset = 0, limit = 10 } = req.body;
    let videoData = await VideoService.getVideos(limit, offset);
    videoData = await Promise.all(
      videoData.map(async (element, index) => {
        try {
          const base64 = await Helpers.CreateImageBase64(element.thumbnail_path);
          return { ...element, thumbnail_path: base64 };
        } catch (e) {
          console.error("Error creating base64 for thumbnail:", e);
          return { ...element, thumbnail_path: "" };
        }
      })
    );
    res.status(200).json({ message: MESSAGES.Video.VIDEO_FOUND, data: videoData });
  } catch (error) {
    res.status(500).send(MESSAGES.Video.ERROR_HOME);
  }
};

const searchVideos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { searchTerm, limit, offset } = req.body;
    let videoData = await VideoService.searchByTitle(searchTerm, offset, limit);
    videoData = await Promise.all(
      videoData.map(async (element, index) => {
        try {
          const base64 = await Helpers.CreateImageBase64(element.thumbnail_path);
          return { ...element, thumbnail_path: base64 };
        } catch (e) {
          console.error("Error creating base64 for thumbnail:", e);
          return { ...element, thumbnail_path: "" };
        }
      })
    );
    res.status(200).json({ message: MESSAGES.Video.VIDEO_FOUND, data: videoData });
  } catch (error) {
    res.status(500).send(MESSAGES.Video.NO_VIDEO);
  }
};

export default { getVideoById, addVideo, sendVideoStream, getHomeFeed, searchVideos };
