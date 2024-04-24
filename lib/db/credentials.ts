// TODO: create and store in a real database
const credentials: Record<string, Credential> = {};

export interface Credential {
  id: string;
  publicKey: string;
  name: string;
  transports: [];
  registeredOn: Date;
  lastUsedOn: Date;
  userId: string;
}

export async function createCredential(credential: Credential) {
  credentials[credential.id] = credential;

  console.log("db:credentials:createCredential", credentials);

  return Promise.resolve(credential);
}

export async function findCredentialById(credentialId: string) {
  console.log("db:credentials:findCredentialById", credentials);

  const credential = credentials[credentialId];

  if (credential) {
    return Promise.resolve(credential);
  }
}

export async function findCredentialByUserId(
  userId: string
): Promise<Credential | undefined> {
  return Promise.resolve(
    Object.entries(credentials).find(
      ([, credential]) => credential.userId == userId
    )?.[1]
  );
}

export async function findCredentialsByUserId(
  userId: string
): Promise<Credential[]> {
  return Promise.resolve(
    Object.entries(credentials)
      .filter(([, credential]) => credential.userId == userId)
      .map(([, credential]) => credential)
  );
}

export async function removeCredential(credentialId: string) {
  delete credentials[credentialId];

  await Promise.resolve();
}

export async function updateCredentialLastUsed(
  credentialId: string
): Promise<Credential | undefined> {
  if (credentials[credentialId]) {
    credentials[credentialId].lastUsedOn = new Date();
    return await Promise.resolve(credentials[credentialId]);
  }
}
