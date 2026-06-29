import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import bcrypt from "bcrypt";
import { sendCredentialsEmail } from "@/lib/email";

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

    let rawPasswordToUse = undefined;

    // Handle Password Update (Hashed)
    if (password && password.trim() !== "") {
       const hashedPassword = await bcrypt.hash(password, 10);
       updateData.password = hashedPassword;
       rawPasswordToUse = password;

       // Generate loginId using user's first name if they don't have one
       const currentUser = await prisma.user.findUnique({ where: { id: userId } });
       if (currentUser && !currentUser.loginId) {
         // Extract first name and remove special characters
         const firstName = currentUser.name.split(' ')[0].replace(/[^a-zA-Z0-9]/g, '');
         const uniqueNum = Math.floor(1000 + Math.random() * 9000);
         updateData.loginId = `${firstName}-${uniqueNum}`;
       }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    let emailSent = false;
    let emailError = null;

    if (rawPasswordToUse && updatedUser.email) {
      const result = await sendCredentialsEmail(
         updatedUser.email,
         updatedUser.role || "STUDENT",
         updatedUser.loginId || "N/A",
         rawPasswordToUse,
         updatedUser.name
      );
      emailSent = result.success;
      emailError = result.error;
    }

    return NextResponse.json({ 
      message: "User updated successfully", 
      user: updatedUser,
      emailSent,
      emailError 
    });
  } catch (error) {
    console.error("Admin user patch error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
