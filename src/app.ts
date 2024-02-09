import express, { Request, Response } from "express";

const app = express();

app.get("/", (res: Response, req: Request) => {
  res.send("hello world");
});

export { app };
