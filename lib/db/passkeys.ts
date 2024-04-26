import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const transportSchema = z.union([
  z.literal("ble"),
  z.literal("cable"),
  z.literal("hybrid"),
  z.literal("internal"),
  z.literal("nfc"),
  z.literal("smart-card"),
  z.literal("usb"),
]);

export type Transport = z.infer<typeof transportSchema>;

const passkeySchema = z.object({
  id: z.string(),
  publicKey: z.string(),
  name: z.string(),
  transports: z.array(transportSchema),
  registeredOn: z.coerce.date(),
  lastUsedOn: z.coerce.date(),
  userId: z.string(),
});

export type Passkey = z.infer<typeof passkeySchema>;

const passkeysSchema = z.array(passkeySchema);

const prisma = new PrismaClient();

export abstract class PasskeyRepository {
  public static async createPasskey(passkey: Passkey) {
    const createdPasskey = await prisma.passkey.create({
      data: passkey,
    });

    return passkeySchema.parse(createdPasskey);
  }

  public static async findPasskeyById(passkeyId: string) {
    const passkey = await prisma.passkey.findFirst({
      where: {
        id: passkeyId,
      },
    });

    return passkeySchema.parse(passkey);
  }

  public static async findPasskeysByUserId(userId: string): Promise<Passkey[]> {
    const passkeys = await prisma.passkey.findMany({
      where: {
        userId: userId,
      },
    });

    if (passkeys == null) {
      return [];
    }

    return passkeysSchema.parse(passkeys);
  }

  public static async removePasskey(passkeyId: string) {
    return await prisma.passkey.delete({
      where: {
        id: passkeyId,
      },
    });
  }

  public static async updatePasskeyLastUsed(
    passkeyId: string
  ): Promise<Passkey | undefined> {
    const passkey = await prisma.passkey.update({
      where: {
        id: passkeyId,
      },
      data: {
        lastUsedOn: new Date(),
      },
    });

    return passkeySchema.parse(passkey);
  }
}
