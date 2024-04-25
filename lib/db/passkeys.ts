// TODO: create and store in a real database
const passkeys: Record<string, Passkey> = {};

export interface Passkey {
  id: string;
  publicKey: string;
  name: string;
  transports: [];
  registeredOn: Date;
  lastUsedOn: Date;
  userId: string;
}

// interface PasskeyRepository {
//   createPasskey(passkey: Passkey): Promise<Passkey>;
//
//   findPasskeyById(passkeyId: string): Promise<Passkey | undefined>;
//   findCredentialByUserId(userId: string): Promise<Passkey | undefined>;
//   findPasskeysByUserId(userId: string): Promise<Passkey[]>;
//
//   updatePasskeyLastUsed(passkeyId: string): Promise<Passkey | undefined>;
//
//   removePasskey(passkeyId: string): void;
// }

export abstract class PasskeyRepository {
  public static async createPasskey(passkey: Passkey) {
    passkeys[passkey.id] = passkey;

    console.log("db:credentials:createPasskey", passkeys);

    return Promise.resolve(passkey);
  }

  public static async findPasskeyById(passkeyId: string) {
    console.log("db:credentials:findPasskeyById", passkeys);

    const passkey = passkeys[passkeyId];

    if (passkey) {
      return Promise.resolve(passkey);
    }
  }

  public static async findCredentialByUserId(
    userId: string
  ): Promise<Passkey | undefined> {
    return Promise.resolve(
      Object.entries(passkeys).find(
        ([, credential]) => credential.userId == userId
      )?.[1]
    );
  }

  public static async findPasskeysByUserId(userId: string): Promise<Passkey[]> {
    return Promise.resolve(
      Object.entries(passkeys)
        .filter(([, passkey]) => passkey.userId == userId)
        .map(([, passkey]) => passkey)
    );
  }

  public static async removePasskey(passkeyId: string) {
    delete passkeys[passkeyId];

    await Promise.resolve();
  }

  public static async updatePasskeyLastUsed(
    passkeyId: string
  ): Promise<Passkey | undefined> {
    if (passkeys[passkeyId]) {
      passkeys[passkeyId].lastUsedOn = new Date();

      return await Promise.resolve(passkeys[passkeyId]);
    }
  }
}
