"use server";

import { PasskeyRepository } from "@/lib/db/passkeys";
import { UserRepository } from "@/lib/db/users";
import { cookies } from "next/headers";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import { AuthenticationExtensionsClientOutputs } from "@simplewebauthn/types/types/dom";
import { isoBase64URL } from "@simplewebauthn/server/helpers";

interface CredentialDTO {
  id: string;
  rawId: string;
  user: {
    id: string;
    username: string;
  };
  response: {
    authenticatorData: string;
    attestationObject: string;
    clientDataJSON: string;
    publicKey: string;
  };
  type: "public-key";
  clientExtensionResults: AuthenticationExtensionsClientOutputs;
}

export default async function registerAndSave(credentialDTO: CredentialDTO) {
  try {
    console.log("registerAndSave");
    const challenge = cookies().get("challenge")?.value;

    console.log("registerAndSave:challenge", challenge);

    if (challenge == null) {
      throw new Error("Challenge cannot be found");
    }

    const verification = await verifyRegistrationResponse({
      response: credentialDTO,
      expectedChallenge: challenge,
      expectedOrigin: process.env.ORIGIN ?? "http://localhost:3030",
      expectedRPID: process.env.HOSTNAME ?? "localhost",
      requireUserVerification: false,
    });

    console.log("registerAndSave:verification", verification);

    // If the authentication failed, throw.
    if (!verification.verified || verification?.registrationInfo == null) {
      throw new Error("User verification failed.");
    }

    const { registrationInfo } = verification;

    console.log("registerAndSave:credentialID", registrationInfo.credentialID);
    console.log(
      "registerAndSave:publicKey",
      registrationInfo.credentialPublicKey
    );

    // create new credential in database
    await PasskeyRepository.createPasskey({
      id: registrationInfo.credentialID,
      publicKey: isoBase64URL.fromBuffer(registrationInfo.credentialPublicKey),
      name: "Passkey", // TODO: add way to name credential
      transports: [],
      registeredOn: new Date(),
      lastUsedOn: new Date(),
      userId: credentialDTO.user.id,
    });

    console.log("deleting challenge cookie");

    // remove session challenge
    cookies().delete("challenge");

    // Respond with the user information.
    return UserRepository.findUserById(credentialDTO.user.id);
  } catch (error) {
    console.error(error);
    throw new Error("Unable to verify and save authentication", {
      cause: error,
    });
  }
}
