import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function GET(req: Request) {
  try {
    const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (!admin) return NextResponse.json({ error: "No admin found" });

    const hashedPassword = await bcrypt.hash("Sahil@123dec", 10);
    
    await prisma.user.update({
      where: { id: admin.id },
      data: { 
        email: "tarendra.garhewal2024@gmail.com",
        password: hashedPassword
      }
    });

    return NextResponse.json({ success: true, message: "Live Admin Database Fixed! You can now login with tarendra.garhewal2024@gmail.com and Sahil@123dec" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
