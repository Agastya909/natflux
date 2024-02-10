import { PrismaClient } from "@prisma/client";
import { Hashing } from "../utils/";
const Prisma = new PrismaClient();

export type CreateUserType = { name: string; email: string; password: string };
async function createUser(body: CreateUserType) {
  const { email, name, password } = body;
  const pwHash = await Hashing.HashPassword(password);
  const res = await Prisma.user.create({
    data: {
      name: name,
      email: email,
      hash: pwHash
    }
  });
  return res;
}

export default { createUser };
