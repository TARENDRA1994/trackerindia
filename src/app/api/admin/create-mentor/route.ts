import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  // Strict Admin Check
  if (!session?.user || (session.user as any).role !== "ADMIN" || session.user?.email !== "tarendra.gadhewal2024@gmail.com") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, email, whatsapp, password } = body;

  if (!name || !email || !whatsapp || !password) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { whatsapp }]
      }
    });

    if (existingUser) {
      return NextResponse.json({ message: "User with this email or WhatsApp already exists" }, { status: 400 });
    }

    // Generate Login ID (e.g., MNT-1234)
    const count = await prisma.user.count({ where: { role: "MENTOR" } });
    const loginId = `MNT-${String(count + 1).padStart(4, "0")}`;

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    const mentor = await prisma.user.create({
      data: {
        name,
        email,
        whatsapp,
        password: hashedPassword,
        loginId,
        role: "MENTOR",
        status: "APPROVED",
        // Default values for mandatory fields
        dob: new Date("1990-01-01"),
        state: "N/A",
        city: "N/A",
        medium: "English",
        exam: "UPSC",
        targetYear: 2025
      }
    });

    return NextResponse.json({ 
      message: "Mentor created successfully", 
      loginId: mentor.loginId,
      email: mentor.email 
    });
  } catch (error) {
    console.error("Create Mentor Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
