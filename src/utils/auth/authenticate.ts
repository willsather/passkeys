import verifyAndSave from "@/src/app/actions/authenticate/verifyAndSave";
import { decode, encode } from "./base64";
import { AuthenticationCredential } from "@simplewebauthn/types";
import getAuthenticationOptions from "@/src/app/actions/authenticate/getOptions";
// import { findUserByUsername } from "@/lib/db/users";

export async function authenticate(/*username: string*/) {
  // const user = await findUserByUsername(username);
  //
  // if (user == null) {
  //   throw new Error(`Unable to find user ${user}`);
  // }

  const options = await getAuthenticationOptions();

  console.log("options", options);

  // To abort a WebAuthn call, instantiate an `AbortController`.
  const abortController = new AbortController();

  // // Invoke WebAuthn get
  const credential = (await navigator.credentials.get({
    publicKey: {
      ...options,
      challenge: decode(options.challenge),
      allowCredentials: [],
    },
    signal: abortController.signal,
    mediation: "optional", // TODO: add conditional here later
  })) as AuthenticationCredential;

  console.log("authenticate:getCredential", credential);

  if (credential == null) {
    throw new Error("Unable to get credential");
  }

  const credentialDTO = {
    id: credential.id,
    rawId: encode(credential.rawId),
    response: {
      authenticatorData: encode(credential.response.authenticatorData),
      clientDataJSON: encode(credential.response.clientDataJSON),
      signature: encode(credential.response.signature),
      userHandle:
        credential.response?.userHandle != null
          ? encode(credential.response?.userHandle)
          : undefined,
    },
    type: credential.type,
    clientExtensionResults: credential.getClientExtensionResults(),
  };

  return verifyAndSave(credentialDTO);
}
