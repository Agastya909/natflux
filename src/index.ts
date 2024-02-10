import { app } from "./app.js";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config();

const Prisma = new PrismaClient();

const port = 4000;
app.listen(port, async () => {
  await Prisma.$connect();
  console.log("server started on port :", port);
});
