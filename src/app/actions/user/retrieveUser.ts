"use server";

import { UserRepository } from "@/lib/db/users";

export default async function retrieveUser(username: string) {
  return await UserRepository.findUserByUsername(username);
}
