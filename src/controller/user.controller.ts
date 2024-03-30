import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/index";
import { MESSAGES } from "../constants";
import { Helpers } from "../utils";

async function getUserById(req: Request, res: Response) {
  const userId = req.params.id;
  if (!userId) return res.status(400).send("User id not found");
  const user = await UserService.getUserById(userId);
  res.send(user);
}

async function getUsers(req: Request, res: Response) {
  const body = req.body;
  const users = await UserService.getUsers(body);
  res.send(users);
}

const updateName = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, name } = req.body;
    const updatedUser = await UserService.updateUser({ type: "updateName", id: id, newName: name });
    res.status(200).json({
      data: updatedUser,
      message: MESSAGES.UserData.NAME_UPDATED
    });
  } catch (error) {
    res.status(500).send(MESSAGES.UserData.NAME_NOT_UPDATED);
  }
};

const updatePfp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filePath = req.file?.path;
    const { id } = req.body;
    if (!filePath) return res.status(500).send(MESSAGES.UserData.PFP_NOT_UPDATED);
    let updatedUser = await UserService.updateUser({ type: "updatePfp", id: id, newPfp: filePath });
    if (!updatedUser) return res.status(500).send(MESSAGES.UserData.PFP_NOT_UPDATED);
    const base64 = await Helpers.CreateImageBase64(updatedUser.pfp_path);
    updatedUser = { ...updatedUser, pfp_path: base64 };
    res.status(200).json({
      data: updatedUser,
      message: MESSAGES.UserData.PFP_UPDATED
    });
  } catch (error) {
    res.status(500).send(MESSAGES.UserData.PFP_NOT_UPDATED);
  }
};

export default { getUserById, getUsers, updateName, updatePfp };
