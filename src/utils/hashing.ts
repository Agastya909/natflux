import bcrypt from "bcrypt";

async function HashPassword(pw: string) {
  return await bcrypt.hash(pw, 10);
}

async function ComparePassword(plainText: string, hash: string) {
  return await bcrypt.compare(plainText, hash);
}

export default { HashPassword, ComparePassword };
