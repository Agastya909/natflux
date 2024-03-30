import { PrismaClient } from "@prisma/client";
const Prisma = new PrismaClient();

type getUsersParam = { start?: number; end?: number };
type UpdateUserParam = {
  id: string;
} & (
  | { type: "updateEmail"; newEmail: string }
  | { type: "updateName"; newName: string }
  | { type: "updatePassword"; newHash: string }
  | { type: "updatePfp"; newPfp: string }
);

async function getUserById(id: string) {
  return await Prisma.user.findUnique({ where: { id: id } });
}

async function getUserByEmail(email: string) {
  return await Prisma.user.findUnique({ where: { email: email } });
}

async function getUsers(body: getUsersParam) {
  const { end, start } = body;
  return await Prisma.user.findMany({
    skip: start || 0,
    take: end || 10
  });
}

async function updateUser(updateParams: UpdateUserParam) {
  const { type, id } = updateParams;
  let data;
  if (type === "updatePassword") data = { hash: updateParams.newHash };
  else if (type === "updateEmail") data = { email: updateParams.newEmail };
  else if (type === "updateName") data = { name: updateParams.newName };
  else if (type === "updatePfp") data = { pfp_path: updateParams.newPfp };
  if (!data) return false;
  return await Prisma.user.update({ where: { id: id }, data: data });
}

export default { getUserById, getUsers, getUserByEmail, updateUser };
