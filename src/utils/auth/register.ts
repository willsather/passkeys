import getRegistrationOptions from "@/src/app/actions/register/getOptions";
import { decode, encode } from "./base64";
import { isoBase64URL } from "@simplewebauthn/server/helpers";
import registerAndSave from "@/src/app/actions/register/registerAndSave";
import { RegistrationCredential } from "@simplewebauthn/types";
import saveUser from "@/src/app/actions/user/saveUser";

export default async function register(username: string) {
  const user = await saveUser(username);

  const options = await getRegistrationOptions(user.id);

  // Invoke WebAuthn create
  const credential = (await navigator.credentials.create({
    publicKey: {
      ...options,
      challenge: decode(options.challenge),
      user: {
        id: decode(options.user.id),
        name: "",
        displayName: "",
      },
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        requireResidentKey: true,
      },
      excludeCredentials: options?.excludeCredentials?.map(
        (excludedCredential) => ({
          ...excludedCredential,
          id: isoBase64URL.toBuffer(excludedCredential.id),
          transports: excludedCredential.transports as AuthenticatorTransport[],
        })
      ),
    },
  })) as RegistrationCredential;

  if (credential == null) {
    throw new Error("Registration could not be completed");
  }

  const publicKey = credential.response.getPublicKey();

  const credentialDTO = {
    id: credential.id,
    rawId: encode(credential.rawId),
    user: {
      id: user.id,
      username: user.username,
    },
    response: {
      authenticatorData: encode(credential.response.getAuthenticatorData()),
      attestationObject: encode(credential.response.attestationObject),
      clientDataJSON: encode(credential.response.clientDataJSON),
      publicKey: publicKey != null ? encode(publicKey) : "",
    },
    type: credential.type,
    clientExtensionResults: credential.getClientExtensionResults(),
  };

  // Send the result to the server and return the promise.
  return await registerAndSave(credentialDTO);
}
