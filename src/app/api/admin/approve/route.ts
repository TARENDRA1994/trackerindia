import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { userId, action } = await req.json();

    if (action === "REJECT") {
      await prisma.user.update({
        where: { id: userId },
        data: { status: "REJECTED" },
      });
      return NextResponse.json({ message: "User rejected" });
    }

    if (action === "APPROVE") {
      // 1. Generate unique Login ID and Password
      const loginId = `TI-${Math.floor(100000 + Math.random() * 900000)}`;
      const password = crypto.randomBytes(4).toString("hex"); // 8 chars

      // 2. Update User
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          status: "APPROVED",
          loginId,
          password, // In production, hash this!
        },
      });

      // 3. Mock WhatsApp Message Trigger
      console.log(`
        ---------- WHATSAPP TRIGGER ----------
        To: ${user.whatsapp}
        Message: 
        Welcome to Tracker India 🇮🇳
        Your login credentials:
        URL: https://trackerindia.com/login
        User ID: ${loginId}
        Password: ${password}
        Stay consistent. Success is near.
        --------------------------------------
      `);

      return NextResponse.json({ message: "User approved and credentials generated", credentials: { loginId, password } });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Admin action error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
