import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "tarendra.garhewal2024@gmail.com";
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    console.log("USER NOT FOUND in remote DB");
  } else {
    console.log("User found:", user.email, "| Role:", user.role);
    console.log("Hash in DB:", user.password);
    
    // Test the specific password
    const testPassword = "Admin@123";
    const isValid = await bcrypt.compare(testPassword, user.password || "");
    console.log(`Password "${testPassword}" valid?`, isValid);
  }
}

main().finally(() => prisma.$disconnect());
