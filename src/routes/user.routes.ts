import { Router } from "express";
import { userController } from "../controller/index";
const router = Router();

router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);

export default router;
