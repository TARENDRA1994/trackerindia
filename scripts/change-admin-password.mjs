import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import readline from "readline";

const prisma = new PrismaClient();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ADMIN_EMAIL = "tarendra.garhewal2024@gmail.com";

rl.question(`Enter new password for Admin (${ADMIN_EMAIL}): `, async (newPassword) => {
  if (!newPassword || newPassword.length < 4) {
    console.error("Password too short!");
    process.exit(1);
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    
    if (admin) {
      await prisma.user.update({
        where: { id: admin.id },
        data: { 
          email: ADMIN_EMAIL, 
          password: hashedPassword 
        }
      });
      console.log("✅ Admin password updated successfully!");
    } else {
      console.error("❌ No admin user found in the database.");
    }
  } catch (err) {
    console.error("Error updating password:", err);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
});
