import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "MENTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const mentorId = (session.user as any).id;

    // Fetch students assigned to this mentor
    const students = await prisma.user.findMany({
      where: { 
        mentors: {
          some: { id: mentorId }
        },
        status: "APPROVED" 
      },
      select: {
        id: true,
        name: true,
        email: true,
        whatsapp: true, // Will be masked
        targetYear: true,
        city: true,
        state: true,
        createdAt: true,
        _count: {
          select: { dailyLogs: true }
        }
      },
      orderBy: { name: "asc" }
    });

    // MASKING LOGIC: Only first 5 digits of phone visible
    const maskedStudents = students.map(s => ({
      ...s,
      whatsapp: s.whatsapp ? s.whatsapp.substring(0, 5) + "*****" : "N/A"
    }));

    return NextResponse.json(maskedStudents);
  } catch (error) {
    console.error("Mentor API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
