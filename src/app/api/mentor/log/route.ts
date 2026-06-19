import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "MENTOR") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const mentorId = (session.user as any).id;
  const body = await req.json();

  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const existingLog = await prisma.mentorLog.findFirst({
      where: {
        mentorId,
        timestamp: { gte: startOfDay, lte: endOfDay }
      }
    });

    if (existingLog) {
      return NextResponse.json({ message: "You have already filed a log today." }, { status: 400 });
    }

    const log = await prisma.mentorLog.create({
      data: {
        mentorId,
        oneOnOneDone: body.oneOnOneDone,
        sessionCount: body.sessionCount,
        sessionDetails: JSON.stringify(body.sessionDetails),
        batchSessionDone: body.batchSessionDone,
        batchOverview: body.batchOverview,
        batchMissedReason: body.batchMissedReason,
        additionalTasks: body.additionalTasks.join(","),
        hasIssue: body.hasIssue,
        issueDetail: body.issueDetail,
        workHours: body.workHours,
        dailyProductivity: body.dailyProductivity,
        weeklyProductivity: body.weeklyProductivity,
        topStudents: JSON.stringify(body.topStudents)
      }
    });

    return NextResponse.json(log);
  } catch (error) {
    console.error("Mentor Log API Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "MENTOR") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const mentorId = (session.user as any).id;
  
  try {
    const logs = await prisma.mentorLog.findMany({
      where: { mentorId },
      orderBy: { timestamp: "desc" },
      take: 30
    });

    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
