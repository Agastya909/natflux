import { Request, Response } from "express";
import { UserService } from "../services/index";

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

export default { getUserById, getUsers };
