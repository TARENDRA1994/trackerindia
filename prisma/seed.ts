import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = "tarendra.garhewal2024@gmail.com";
  const password = "Admin@123"; // Change this to your desired admin password

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("✅ Admin user already exists:", existing.email);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.create({
    data: {
      name: "Tarendra Gadhewal",
      email,
      whatsapp: "919211085216",
      dob: new Date("1994-01-01"),
      state: "Rajasthan",
      city: "Jaipur",
      medium: "Hindi",
      exam: "UPSC CSE",
      targetYear: 2026,
      role: "ADMIN",
      status: "APPROVED",
      loginId: email,
      password: hashedPassword,
    },
  });

  console.log("✅ Admin user created successfully!");
  console.log("   Email:", admin.email);
  console.log("   Password: Admin@123 (please change this after login)");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
