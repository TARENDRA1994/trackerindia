import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, whatsapp, dob, state, city, medium, exam, targetYear } = body;

    // Basic validation
    if (!name || !email || !whatsapp || !dob || !state || !city || !medium || !exam || !targetYear) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { whatsapp }],
      },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User with this email or WhatsApp already exists" }, { status: 400 });
    }

    // Create pending user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        whatsapp,
        dob: new Date(dob),
        state,
        city,
        medium,
        exam,
        targetYear: parseInt(targetYear),
        status: "PENDING",
        role: "STUDENT",
      },
    });

    return NextResponse.json({ message: "Registration successful. Awaiting admin approval.", user }, { status: 201 });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
