"use server";

import { findUserById } from "@/lib/db/users";

import { generateRegistrationOptions } from "@simplewebauthn/server";
import { findCredentialsByUserId } from "@/lib/db/credentials";
import { cookies } from "next/headers";
import { isoBase64URL } from "@simplewebauthn/server/helpers";

export default async function getRegistrationOptions(userId: string) {
  try {
    const user = await findUserById(userId);

    if (user == null) {
      throw new Error("Unable to find user");
    }

    const credentials = await findCredentialsByUserId(user.id);

    const excludeCredentials = [];

    for (const credential of credentials) {
      excludeCredentials.push({
        id: credential.id,
        type: "public-key",
        transports: credential.transports,
      });
    }

    const options = await generateRegistrationOptions({
      rpName: "Will Sather",
      rpID: process.env.HOSTNAME ?? "localhost",
      userID: isoBase64URL.toBuffer(user.id),
      userName: user.username,
      userDisplayName: user.username,
      attestationType: "none",
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        requireResidentKey: true,
      },
      excludeCredentials: excludeCredentials,
    });

    cookies().set("challenge", options.challenge, {
      maxAge: 60 * 5, // 5 minutes
    });

    return options;
  } catch (error) {
    console.error("Unable to get registration options");

    throw new Error("Unable to get registration options", {
      cause: error,
    });
  }

  // try {
  //   // Only check username, no need to check password as this is a mock
  //   if (username == null || !/^[a-zA-Z0-9@.\-_]+$/.test(username)) {
  //     throw new Error("Invalid username");
  //   }
  //
  //   let user = await findUserByUsername(username);
  //
  //   if (user == null) {
  //     user = {
  //       id: isoBase64URL.fromBuffer(crypto.randomBytes(32)),
  //       username,
  //     };
  //
  //     await createUser(user);
  //   }
  //   return user;
  // } catch (error) {
  //   throw new Error("Unable to get registration options", {
  //     cause: error,
  //   });
  // }
}
