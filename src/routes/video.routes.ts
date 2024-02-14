import { Router } from "express";
import { VideoController } from "../controller/index";
import { AuthMiddleware, FfmpegMiddleware } from "../middleware";
import { MulterUpload } from "../utils";

const router = Router();

router.use(AuthMiddleware.verifyJWT);

router.get("/:id", VideoController.getVideoById);
router.post(
  "/add",
  MulterUpload.single("file"),
  FfmpegMiddleware.getVideoDuration,
  FfmpegMiddleware.getRandomThumbnail,
  VideoController.addVideo
);
router.get("/:id/play", VideoController.sendVideoStream);

export default router;
