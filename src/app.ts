import express from "express";
import { AuthRouter, UserRouter, VideoRouter } from "./routes";

const app = express();

app.use(express.json());

app.use("/auth", AuthRouter);
app.use("/user", UserRouter);
app.use("/video", VideoRouter);

export { app };
