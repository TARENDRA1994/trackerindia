import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Fetch All logs for stats
    const allLogs = await prisma.dailyLog.findMany({
      where: { userId },
      orderBy: { timestamp: "asc" },
    });

    // Fetch All test results for stats
    const allTests = await prisma.testResult.findMany({
      where: { userId },
      orderBy: { timestamp: "asc" },
    });

    // 1. Calculate Consistency
    // Days since registration (min 1)
    const daysSinceJoin = Math.max(1, Math.ceil((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)));
    const consistency = Math.round((allLogs.length / daysSinceJoin) * 100);

    // 2. Calculate Avg Study Hours
    const parseStudyHours = (val: string) => {
      if (!val) return 0;
      if (val === "10+") return 11;
      const parts = val.split(/[–-]/);
      if (parts.length > 1) return (parseFloat(parts[0]) + parseFloat(parts[1])) / 2;
      return parseFloat(val) || 0;
    };
    const totalHours = allLogs.reduce((acc, log) => acc + parseStudyHours(log.studyHours), 0);
    const avgHours = allLogs.length > 0 ? (totalHours / allLogs.length).toFixed(1) : "0";

    // 3. Calculate Accuracy
    const avgAccuracy = allTests.length > 0 
      ? Math.round(allTests.reduce((acc, t) => acc + t.accuracy, 0) / allTests.length)
      : 0;

    // 4. Chart Transformations (Last 30)
    // 4. Chart Transformations (Last 30)
    const chartData = allLogs.slice(-30).map((log: any) => ({
      date: new Date(log.timestamp).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
      hours: parseStudyHours(log.studyHours),
      retention: log.retentionScore,
    }));

    const testData = allTests.slice(-30).map((test: any) => ({
      date: new Date(test.timestamp).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
      accuracy: test.accuracy,
    }));

    // 5. Calculate Gap
    const lastLog = allLogs.length > 0 ? allLogs[allLogs.length - 1] : null;
    const lastLogDate = lastLog ? new Date(lastLog.timestamp) : new Date(user.createdAt);
    const today = new Date();
    today.setHours(0,0,0,0);
    const lastLogDay = new Date(lastLogDate);
    lastLogDay.setHours(0,0,0,0);
    
    const diffTime = Math.abs(today.getTime() - lastLogDay.getTime());
    const gapDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const isGap = gapDays > 1;

    return NextResponse.json({ 
      metrics: {
        consistency,
        avgHours,
        avgAccuracy,
        globalRank: allLogs.length > 0 ? `#${Math.max(1, 5000 - (allLogs.length * 10))}` : "N/A",
        gapDays,
        isGap
      },
      chartData, 
      testData 
    });
  } catch (error: any) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
