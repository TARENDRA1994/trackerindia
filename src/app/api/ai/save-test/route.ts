import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();

    const result = await prisma.testResult.create({
      data: {
        userId,
        course: "UPSC Productivity Test",
        subject: body.subject || "Mixed",
        score: body.score,
        totalQuestions: body.totalQuestions,
        accuracy: body.accuracy,
        timeTaken: body.timeTaken,
        weakAreas: body.weakAreas || "None detected",
      }
    });

    return NextResponse.json({ message: "Test result saved", result }, { status: 201 });
  } catch (error: any) {
    console.error("Save Test Error:", error);
    return NextResponse.json({ error: "Failed to save test result" }, { status: 500 });
  }
}
