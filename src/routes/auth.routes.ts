import { Router } from "express";
import { AuthController } from "../controller";
import { AuthMiddleware } from "../middleware";
const router = Router();

router.get("/user/verify-jwt", AuthMiddleware.verifyJWT, AuthController.getCurrentUser);
router.post("/user/create", AuthController.createUser, AuthMiddleware.signJWT);
router.post("/user/login", AuthController.loginUser, AuthMiddleware.signJWT);
router.post("/user/reset-password", AuthMiddleware.verifyJWT, AuthController.resetPassword, AuthMiddleware.signJWT); // add reset pw controller

export default router;
