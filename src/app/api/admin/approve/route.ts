import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { sendCredentialsEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    // 🔐 SECURITY FIX: Auth guard — only ADMIN may approve/reject
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, action } = await req.json();

    if (!userId || !action) {
      return NextResponse.json({ error: "userId and action are required" }, { status: 400 });
    }

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
      const rawPassword = crypto.randomBytes(4).toString("hex"); // 8 chars

      // 🔐 SECURITY FIX: Hash password before storing in DB
      const hashedPassword = await bcrypt.hash(rawPassword, 10);

      // 2. Update User with hashed password
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          status: "APPROVED",
          loginId,
          password: hashedPassword,
        },
      });

      // 3. Send Email Notification via AWS SES (with raw password — only sent via email, never stored plain)
      let emailResult = { success: false, error: "No email provided" };
      if (user.email) {
        emailResult = await sendCredentialsEmail(user.email, user.role || "STUDENT", loginId, rawPassword, user.name);
      }

      return NextResponse.json({ 
        message: "User approved successfully",
        emailSent: emailResult.success,
        emailError: emailResult.error
      });
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Admin action error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
