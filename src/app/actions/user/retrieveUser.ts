"use server";

import { findUserByUsername } from "@/lib/db/users";

export default async function retrieveUser(username: string) {
  return await findUserByUsername(username);
}
