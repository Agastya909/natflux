import { Router } from "express";
import { VideoController } from "../controller/index";
import { AuthMiddleware } from "../middleware";
const router = Router();

router.use(AuthMiddleware.verifyJWT);

router.get("/:id", VideoController.getVideoById);
router.post("/add", VideoController.addVideo);

export default router;
