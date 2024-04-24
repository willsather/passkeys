"use server";

import { generateAuthenticationOptions } from "@simplewebauthn/server";
// import { findCredentialsByUserId } from "@/lib/db/credentials";
import { cookies } from "next/headers";

export default async function getAuthenticationOptions() {
  try {
    // const credentials = await findCredentialsByUserId(userId);

    const options = await generateAuthenticationOptions({
      rpID: process.env.HOSTNAME ?? "localhost",
      allowCredentials: [],
      // allowCredentials: credentials.map((credential) => ({
      //   id: credential.id,
      //   transports: credential.transports,
      // })),
    });

    cookies().set("challenge", options.challenge, {
      maxAge: 60 * 5, // 5 minutes
    });

    return options;
  } catch (error) {
    console.error("Unable to get authentication options");

    throw new Error("Unable to get authentication options", {
      cause: error,
    });
  }
}
