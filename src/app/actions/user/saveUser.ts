"use server";

import { createUser, findUserByUsername } from "@/lib/db/users";
import { isoBase64URL } from "@simplewebauthn/server/helpers";
import crypto from "crypto";

export default async function saveUser(username: string) {
  const existingUser = await findUserByUsername(username);

  if (existingUser != null) {
    return existingUser;
  }

  // if user doesn't exist, create a new one
  const user = await createUser({
    id: isoBase64URL.fromBuffer(crypto.randomBytes(32)),
    username,
  });

  if (user == null) {
    throw new Error(`Unable to create new user for ${username}`);
  }

  return user;
}
