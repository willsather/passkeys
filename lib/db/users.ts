import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const userSchema = z.object({
  id: z.string(),
  username: z.string(),
});

export type User = z.infer<typeof userSchema>;

const prisma = new PrismaClient();

export abstract class UserRepository {
  public static async createUser(user: User) {
    return await prisma.user.create({
      data: user,
    });
  }

  public static async findUserById(userId: string) {
    return await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
  }

  public static async findUserByUsername(username: string) {
    return await prisma.user.findFirst({
      where: {
        username: username,
      },
    });
  }
}
