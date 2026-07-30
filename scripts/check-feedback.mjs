import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const feedbacks = await prisma.feedback.findMany({
    include: { toUser: true, fromUser: true }
  });
  console.log("Feedbacks:");
  feedbacks.forEach(fb => {
    console.log(`- From: ${fb.fromUser?.name} To: ${fb.toUser?.name} (${fb.toId}) Content: ${fb.content}`);
  });
}

main().finally(() => prisma.$disconnect());
