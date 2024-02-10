import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { MESSAGES } from "../constants";

const JWT_SECRET = process.env.JWT_SECRET_KEY;

function signJWT(req: Request, res: Response, next: NextFunction) {
  const email = req.body.email || res.locals.email;
  if (!email) return res.status(400).send("Missing parameters : Email");

  if (!JWT_SECRET) return res.status(500).send(MESSAGES.HTTP_RESPONSES.SERVER_ERROR);

  jwt.sign(email, JWT_SECRET, { algorithm: "RS256", expiresIn: 24 * 60 * 60 }, (error, token) => {
    if (error) return res.status(500).send(MESSAGES.JWT.NOT_SIGNED);
    res.status(200).json({
      message: res.locals.message,
      data: res.locals.data,
      token: token
    });
    next();
  });
}

function verifyJWT(req: Request, res: Response, next: NextFunction) {
  const headerToken = req.headers.authorization?.split(" ")[1];

  if (!headerToken) return res.status(401).send(MESSAGES.HTTP_RESPONSES.UNAUTHORISED);
  if (!JWT_SECRET) return res.status(500).send(MESSAGES.HTTP_RESPONSES.SERVER_ERROR);

  jwt.verify(headerToken, JWT_SECRET, (error, decoded) => {
    if (error) return res.status(500).send(MESSAGES.JWT.NOT_VERIFIED);
    res.locals.jwt = decoded;
    next();
  });
}

export default { signJWT, verifyJWT };
