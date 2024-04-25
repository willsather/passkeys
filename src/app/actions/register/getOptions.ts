"use server";

import { UserRepository } from "@/lib/db/users";

import { generateRegistrationOptions } from "@simplewebauthn/server";
import { PasskeyRepository } from "@/lib/db/passkeys";
import { cookies } from "next/headers";
import { isoBase64URL } from "@simplewebauthn/server/helpers";

export default async function getRegistrationOptions(userId: string) {
  try {
    const user = await UserRepository.findUserById(userId);

    if (user == null) {
      throw new Error("Unable to find user");
    }

    const credentials = await PasskeyRepository.findPasskeysByUserId(user.id);

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
}
