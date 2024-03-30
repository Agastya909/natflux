import { Router } from "express";
import { VideoController } from "../controller/index";
import { AuthMiddleware, FfmpegMiddleware } from "../middleware";
import { MulterUpload } from "../utils";

const router = Router();

// handle this verify middle ware for video streaming, either verify once and then play
// router.use(AuthMiddleware.verifyJWT);

router.get("/home", AuthMiddleware.verifyJWT, VideoController.getHomeFeed);

router.get("/:id", AuthMiddleware.verifyJWT, VideoController.getVideoById, FfmpegMiddleware.getFileMetaData);
router.post(
  "/add",
  MulterUpload.single("file"),
  FfmpegMiddleware.getVideoDuration,
  FfmpegMiddleware.getRandomThumbnail,
  VideoController.addVideo
);
router.get("/:id/play", VideoController.sendVideoStream);
router.post("/search", AuthMiddleware.verifyJWT, VideoController.searchVideos);

export default router;
