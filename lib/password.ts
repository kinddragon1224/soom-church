import bcrypt from "bcryptjs";

const BCRYPT_PREFIXES = ["$2a$", "$2b$", "$2y$"];
const ROUNDS = 12;

export function isHashedPassword(value: string) {
  return BCRYPT_PREFIXES.some((prefix) => value.startsWith(prefix));
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, ROUNDS);
}

export async function verifyPassword(password: string, storedValue: string) {
  if (!storedValue) return false;
  if (isHashedPassword(storedValue)) {
    return bcrypt.compare(password, storedValue);
  }
  return password === storedValue;
}
