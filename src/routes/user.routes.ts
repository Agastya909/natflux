import { Router } from "express";
import { userController } from "../controller/index";
import { MulterUpload } from "../utils";

const router = Router();

router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.patch("/update/name", userController.updateName);
router.post("/update/profile-picture", MulterUpload.single("pfp"), userController.updatePfp);

export default router;
