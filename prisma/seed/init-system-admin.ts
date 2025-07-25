import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcrypt";
import { UserStatus, UserType } from "../../src/common/types";

export const initSystemAdmin = async (prisma: PrismaClient) => {
  console.log("---Init System Admin Begin---");
  try {
    const admin = await prisma.user.create({
      data: {
        email: "admin@example.com",
        password: hashSync("123456", 10),
        name: "Administrator",
        type: UserType.SYSTEM,
        status: UserStatus.ACTIVATED,
        verified: 1,
        isSuperAdmin: 1,
      },
    });
    if (admin) {
      await prisma.administrator.create({
        data: {
          userId: admin.id,
        },
      });
    }
    console.log("---Init System Admin Success---");
  } catch (err) {
    console.log(err);
  }
};
