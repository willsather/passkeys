"use server";

import { PasskeyRepository } from "@/lib/db/passkeys";
import { cookies } from "next/headers";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import { AuthenticationExtensionsClientOutputs } from "@simplewebauthn/types";
import { isoBase64URL } from "@simplewebauthn/server/helpers";
import { redirect } from "next/navigation";

interface CredentialDTO {
  id: string;
  rawId: string;
  response: {
    authenticatorData: string;
    clientDataJSON: string;
    signature: string;
    userHandle?: string;
  };
  type: "public-key";
  clientExtensionResults: AuthenticationExtensionsClientOutputs;
}

export default async function verifyAndSave(credentialDTO: CredentialDTO) {
  let userId;

  try {
    console.log("verifyAndSave");
    const challenge = cookies().get("challenge")?.value;

    console.log("verifyAndSave:challenge", challenge);

    if (challenge == null) {
      throw new Error("Challenge cannot be found");
    }

    console.log("verifyAndSave:credentialDTO.id", credentialDTO.id);
    const credential = await PasskeyRepository.findPasskeyById(
      credentialDTO.id
    );

    console.log("verifyAndSave:credential", credential);

    if (credential == null) {
      throw new Error("Cannot find existing passkey");
    }

    userId = credential.userId;
    console.log("verifyAndSave:userId", userId);

    const publicKey = isoBase64URL.toBuffer(credential.publicKey);
    console.log("verifyAndSave:publicKey", publicKey);

    const verification = await verifyAuthenticationResponse({
      response: credentialDTO,
      expectedChallenge: challenge,
      expectedOrigin: process.env.ORIGIN ?? "http://localhost:3030",
      expectedRPID: process.env.HOSTNAME ?? "localhost",
      authenticator: {
        credentialPublicKey: publicKey,
        credentialID: credential.id,
        transports: credential.transports,
        counter: 0,
      },
      requireUserVerification: false,
    });

    console.log("verifyAndSave:verification", verification);

    // If the authentication failed, throw.
    if (!verification.verified) {
      throw new Error("User verification failed.");
    }

    console.log("updating credentials last used");

    // update last used timestamp
    await PasskeyRepository.updatePasskeyLastUsed(credential.id);

    console.log("deleting challenge cookie");

    // remove session challenge
    cookies().delete("challenge");
  } catch (error) {
    console.error(error);

    throw new Error("Unable to verify and save authentication", {
      cause: error,
    });
  }

  // upon successful authentication, redirect to account page
  redirect(`/account/${userId}`);
}
