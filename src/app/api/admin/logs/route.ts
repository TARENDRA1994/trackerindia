import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || ((session.user as any).role !== "ADMIN" && (session.user as any).role !== "MENTOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
       return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Role-based security for Mentors
    if ((session.user as any).role === "MENTOR") {
       const student = await prisma.user.findFirst({
          where: { 
             id: userId,
             mentors: {
                some: { id: (session.user as any).id }
             }
          }
       });
       if (!student) {
          return NextResponse.json({ error: "Accsess Denied: Student not assigned to you" }, { status: 403 });
       }
    }

    const logs = await prisma.dailyLog.findMany({
      where: { userId },
      orderBy: { timestamp: "desc" },
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Admin logs API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
