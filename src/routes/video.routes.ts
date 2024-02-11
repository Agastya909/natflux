import { Router } from "express";
import { VideoController } from "../controller/index";
import { AuthMiddleware, FfmpedMiddleware } from "../middleware";
import { MulterUpload } from "../utils";

const router = Router();

router.use(AuthMiddleware.verifyJWT);

router.get("/:id", VideoController.getVideoById);
router.post(
  "/add",
  MulterUpload.single("file"),
  FfmpedMiddleware.getVideoDuration,
  VideoController.addVideo
);

export default router;
