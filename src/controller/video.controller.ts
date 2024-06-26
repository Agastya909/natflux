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
    let videoData = await VideoService.getVideoById(videoId);
    if (!videoData) return res.status(404).send(MESSAGES.Video.NO_VIDEO);
    try {
      const base64 = await Helpers.CreateImageBase64(videoData.thumbnail_path);
      videoData = { ...videoData, thumbnail_path: base64 };
    } catch (e) {
      console.error("Error creating base64 for thumbnail:", e);
      return videoData;
    }
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
    if (!req.params.id) return res.status(400).send("Video ID is required.");

    const videoId = req.params.id;
    const videoData = await VideoService.getVideoById(videoId);
    if (!videoData) return res.status(404).send("Video not found.");

    const { path } = videoData;
    const fileStat = fs.statSync(path);
    const fileSize = fileStat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const CHUNK_SIZE = end - start + 1;
      const fileStream = fs.createReadStream(path, { start, end });
      const headers = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": CHUNK_SIZE,
        "Content-Type": "video/mp4"
      };
      console.log(headers);
      res.writeHead(206, headers); 
      fileStream.pipe(res);
    } else {
      const headers = {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
        "Accept-Ranges": "bytes"
      };

      res.writeHead(200, headers);
      fs.createReadStream(path).pipe(res);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
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
    const { searchTerm = "", limit, offset, genre = "" } = req.body;
    let videoData = await VideoService.searchByTitleAndGenre(genre, searchTerm, offset, limit);
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
