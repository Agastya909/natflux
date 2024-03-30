import express, { Request, Response } from "express";
import { AuthRouter, UserRouter, VideoRouter } from "./routes";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => res.sendFile(__dirname + "/constants/home.html"));

app.use("/auth", AuthRouter);
app.use("/user", UserRouter);
app.use("/video", VideoRouter);

export { app };
