import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import bcrypt from "bcrypt";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") as any;
    const role = searchParams.get("role") as any;

    const users = await prisma.user.findMany({
      where: {
        ...(status && { status }),
        ...(role && { role }),
      },
      include: {
        mentors: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { userId, status, mentorId, mentorIds, details, password } = body;

    const updateData: any = {
      ...(status && { status }),
      ...(details && { ...details }),
    };

    // Handle multiple mentors
    if (mentorIds !== undefined) {
      updateData.mentors = {
        set: (mentorIds || []).map((id: string) => ({ id }))
      };
    } else if (mentorId !== undefined) {
      // Legacy support or single assignment
      updateData.mentors = {
        set: mentorId ? [{ id: mentorId }] : []
      };
    }

    // Handle Password Update (Hashed)
    if (password && password.trim() !== "") {
       const hashedPassword = await bcrypt.hash(password, 10);
       updateData.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Admin user patch error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
