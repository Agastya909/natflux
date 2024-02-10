import { NextFunction, Request, Response } from "express";
import { AuthService, UserService } from "../services/index";
import { Hashing, Validation } from "../utils/index";
import { CreateUserType } from "../services/authService";
import { MESSAGES } from "../constants";

async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const required = ["name", "email", "password"];
    if (!Validation.ValidateRequiredFields(req.body, required)) {
      return res.status(400).send("Missing parameters : " + required);
    }
    const body: CreateUserType = req.body;
    if (!Validation.ValidateEmail(body.email)) {
      return res.status(400).send(MESSAGES.UserData.INVALID_EMAIL_FORMAT);
    }
    const isExistingUser = await UserService.getUserByEmail(body.email);
    if (isExistingUser) {
      return res.status(409).send(MESSAGES.User.EMAIL_IN_USE);
    }
    const userResp = await AuthService.createUser(body);
    res.locals.data = userResp;
    res.locals.message = MESSAGES.User.USER_CREATED;
    next();
  } catch (error: any) {
    res.status(500).send(MESSAGES.User.NOT_CREATED);
  }
}

async function loginUser(req: Request, res: Response, next: NextFunction) {
  try {
    const required = ["email", "password"];
    if (!Validation.ValidateRequiredFields(req.body, required)) {
      return res.status(400).send("Missing parameters : " + required);
    }
    const body: { email: string; password: string } = req.body;
    if (!Validation.ValidateEmail(body.email)) {
      return res.status(400).send(MESSAGES.UserData.INVALID_EMAIL_FORMAT);
    }
    const userData = await UserService.getUserByEmail(body.email);
    if (!userData) return res.status(404).send(MESSAGES.User.NO_USER);
    const isCorrectPW = await Hashing.ComparePassword(body.password, userData.hash);
    if (!isCorrectPW) return res.status(401).send(MESSAGES.UserData.INCORRECT_PW);
    res.locals.data = userData;
    res.locals.message = MESSAGES.User.USER_FOUND;
    next();
  } catch (error) {
    res.status(500).send(MESSAGES.User.LOGIN_UNSUCCESSFULL);
  }
}

async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const required = ["password", "newPassword"];
    if (!Validation.ValidateRequiredFields(req.body, required)) {
      return res.status(400).send("Missing parameters : " + required);
    }
    const body: { password: string; newPassword: string } = req.body;
    const email: string = res.locals.jwt.email;
    const user = await UserService.getUserByEmail(email);
    if (!user) return res.status(404).send(MESSAGES.User.NO_USER);

    const isCorrectPW = await Hashing.ComparePassword(body.password, user.hash);
    if (!isCorrectPW) return res.status(400).send(MESSAGES.UserData.INCORRECT_PW);

    const isSamePw = await Hashing.ComparePassword(body.newPassword, user.hash);
    if (isSamePw) return res.status(400).send(MESSAGES.UserData.SAME_PW);

    const newPwHash = await Hashing.HashPassword(body.newPassword);
    const resp = await UserService.updateUser({
      type: "updatePassword",
      email: email,
      newHash: newPwHash
    });
    if (!resp) return res.status(400).send(MESSAGES.UserData.COULD_NOT_UPDATE_PASSWORD);
    res.locals.data = resp;
    res.locals.message = MESSAGES.UserData.PASSWORD_UPDATED;
    res.locals.email = email;
    next();
  } catch (error) {
    res.status(500).send(MESSAGES.HTTP_RESPONSES.SERVER_ERROR);
  }
}

export default { createUser, loginUser, resetPassword };
