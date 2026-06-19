import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "MENTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const mentorId = (session.user as any).id;
    const { id } = await params;
    const studentId = id;

    // Verify this student is assigned to this mentor
    const student = await prisma.user.findFirst({
      where: { 
        id: studentId,
        mentors: {
          some: { id: mentorId }
        },
        status: "APPROVED" 
      },
      include: {
        dailyLogs: {
          orderBy: { timestamp: "desc" },
          take: 30 // Last 30 days
        }
      }
    });

    if (!student) {
      return NextResponse.json({ error: "Student record not found or not assigned to you" }, { status: 404 });
    }

    // Mask phone for privacy in detailed view too
    const maskedStudent = {
       ...student,
       whatsapp: student.whatsapp ? student.whatsapp.substring(0, 5) + "*****" : "N/A"
    };

    return NextResponse.json(maskedStudent);
  } catch (error) {
    console.error("Mentor Detail API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
