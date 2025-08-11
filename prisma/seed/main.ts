import { PrismaClient } from "@prisma/client";
import { initSystemAdmin } from "./init-system-admin";
import { seedPosts } from "./init-posts";
import { initOrders } from "./init-orders";

const prisma = new PrismaClient();

async function main() {
  await initSystemAdmin(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
