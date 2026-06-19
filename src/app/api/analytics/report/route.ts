import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const targetStudentId = searchParams.get("studentId");
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    const currentUserId = (session.user as any).id;
    const currentUserRole = (session.user as any).role;

    let studentId = currentUserId;

    // Authorization & Assignment Check
    if (targetStudentId && targetStudentId !== currentUserId) {
      if (currentUserRole !== "MENTOR" && currentUserRole !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized access to student record" }, { status: 403 });
      }
      
      if (currentUserRole === "MENTOR") {
        const assignment = await prisma.user.findFirst({
          where: {
            id: targetStudentId,
            mentors: {
              some: { id: currentUserId }
            }
          }
        });
        if (!assignment) {
          return NextResponse.json({ error: "Aspirant not assigned to your profile" }, { status: 403 });
        }
      }
      studentId = targetStudentId;
    }

    // Fetch Student with their assigned Mentors
    const student = await prisma.user.findUnique({
      where: { id: studentId },
      include: {
        mentors: {
          select: { name: true }
        }
      }
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Calculate Date Ranges
    let currentStart = startDateParam ? new Date(startDateParam) : new Date();
    let currentEnd = endDateParam ? new Date(endDateParam) : new Date();

    if (!startDateParam) {
      currentStart.setDate(currentStart.getDate() - 30); // default last 30 days
    }
    
    // Set hours to cover full days
    currentStart.setHours(0, 0, 0, 0);
    currentEnd.setHours(23, 59, 59, 999);

    const diffTime = currentEnd.getTime() - currentStart.getTime();
    const diffDays = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1);

    // Previous Range of equal duration ending right before current range starts
    const prevEnd = new Date(currentStart.getTime() - 1);
    const prevStart = new Date(currentStart.getTime() - (diffDays * 24 * 60 * 60 * 1000));

    // Fetch logs within both ranges
    const allLogs = await prisma.dailyLog.findMany({
      where: {
        userId: studentId,
        timestamp: {
          gte: prevStart,
          lte: currentEnd
        }
      },
      orderBy: { timestamp: "asc" }
    });

    // Categorize logs
    const currentLogs = allLogs.filter(log => log.timestamp >= currentStart && log.timestamp <= currentEnd);
    const prevLogs = allLogs.filter(log => log.timestamp >= prevStart && log.timestamp <= prevEnd);

    // Helpers to parse duration inputs
    const parseStudyHours = (val: string | null) => {
      if (!val) return 0;
      if (val === "12+") return 13;
      if (val === "10+") return 11;
      const parts = val.split(/[–-]/);
      if (parts.length > 1) return (parseFloat(parts[0]) + parseFloat(parts[1])) / 2;
      return parseFloat(val) || 0;
    };

    const parseSleepDuration = (val: string | null) => {
      if (!val) return 0;
      if (val === "8+") return 9;
      if (val === "7h") return 7;
      const parts = val.split(/[–-]/);
      if (parts.length > 1) return (parseFloat(parts[0]) + parseFloat(parts[1])) / 2;
      return parseFloat(val) || 0;
    };

    // Calculate Time Averages
    const getAverages = (logsList: typeof allLogs) => {
      if (logsList.length === 0) {
        return { sleep: 0, study: 0, working: 0, free: 24, sleepPct: 0, studyPct: 0, freePct: 100 };
      }
      const totalSleep = logsList.reduce((acc, log) => acc + parseSleepDuration(log.sleepDuration), 0);
      const totalStudy = logsList.reduce((acc, log) => acc + parseStudyHours(log.studyHours), 0);
      
      const avgSleep = totalSleep / logsList.length;
      const avgStudy = totalStudy / logsList.length;
      const avgWorking = 0.0; // Defaults to 0.0 as working details aren't directly captured in log fields
      const avgFree = Math.max(0, 24 - avgSleep - avgStudy - avgWorking);

      return {
        sleep: parseFloat(avgSleep.toFixed(1)),
        study: parseFloat(avgStudy.toFixed(1)),
        working: parseFloat(avgWorking.toFixed(1)),
        free: parseFloat(avgFree.toFixed(1)),
        sleepPct: parseFloat(((avgSleep / 24) * 100).toFixed(1)),
        studyPct: parseFloat(((avgStudy / 24) * 100).toFixed(1)),
        freePct: parseFloat(((avgFree / 24) * 100).toFixed(1))
      };
    };

    const currentAverages = getAverages(currentLogs);
    const prevAverages = getAverages(prevLogs);

    // Calculate Emotional Status Breakdown
    const emotionCounts = { Positive: 0, Exhausted: 0, Confused: 0, Sad: 0, Depressed: 0 };
    currentLogs.forEach(log => {
      let category: keyof typeof emotionCounts = "Positive";
      const feeling = log.feeling || "";
      if (feeling === "Sad") {
        category = "Sad";
      } else if (feeling === "Depressed") {
        category = "Depressed";
      } else if (feeling === "Normal" || feeling === "Meh") {
        if (log.mentalOverload === "High" || log.mentalOverload === "Slight") {
          category = "Exhausted";
        } else if (log.stuckInTopic) {
          category = "Confused";
        } else {
          category = "Positive";
        }
      } else {
        // Proud, Happy, Motivated
        category = "Positive";
      }
      emotionCounts[category]++;
    });

    // Determine Overall Emotion
    let overallEmotion = "Positive";
    let maxCount = -1;
    (Object.keys(emotionCounts) as Array<keyof typeof emotionCounts>).forEach(key => {
      if (emotionCounts[key] > maxCount) {
        maxCount = emotionCounts[key];
        overallEmotion = key;
      }
    });

    // Day Cycle data (stacked bar chart, reverse-chronological as per screenshot)
    const dayCycleData = [];
    const dateCursor = new Date(currentEnd);
    
    for (let i = 0; i < diffDays; i++) {
      const cursorStr = dateCursor.toDateString();
      const logForDay = currentLogs.find(log => new Date(log.timestamp).toDateString() === cursorStr);
      
      const formattedDate = dateCursor.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "2-digit"
      }).replace(/ /g, "-");

      if (logForDay) {
        const study = parseStudyHours(logForDay.studyHours);
        const sleep = parseSleepDuration(logForDay.sleepDuration);
        const free = Math.max(0, 24 - study - sleep);
        dayCycleData.push({
          date: formattedDate,
          Study: parseFloat(study.toFixed(1)),
          Sleep: parseFloat(sleep.toFixed(1)),
          Free: parseFloat(free.toFixed(1))
        });
      } else {
        // Missing submission logs show 24 hours of free time
        dayCycleData.push({
          date: formattedDate,
          Study: 0,
          Sleep: 0,
          Free: 24
        });
      }
      dateCursor.setDate(dateCursor.getDate() - 1);
    }

    // DNA & Challenges Completion
    const currentDnaDays = currentLogs.filter(log => log.currentAffairsDone).length;
    const prevDnaDays = prevLogs.filter(log => log.currentAffairsDone).length;

    // A challenge is considered completed if the work completed percentage is high (>= 50%)
    const currentChallenges = currentLogs.filter(log => 
      log.workCompleted === "75-100%" || log.workCompleted === "50-75%"
    ).length;
    
    const prevChallenges = prevLogs.filter(log => 
      log.workCompleted === "75-100%" || log.workCompleted === "50-75%"
    ).length;

    // Subject Coverage list matching standard UPSC subjects
    const subjectsMap = [
      { name: "Polity", matcher: ["Polity"] },
      { name: "Economics", matcher: ["Economy", "Economics"] },
      { name: "Medieval History", matcher: ["Medieval"] },
      { name: "Ancient History", matcher: ["Ancient"] },
      { name: "Geography", matcher: ["Geography"] },
      { name: "World History", matcher: ["World"] },
      { name: "Modern History", matcher: ["Modern", "History"] }, // matches modern or generic history
      { name: "Ecology & Environment", matcher: ["Environment", "Ecology"] },
      { name: "International Relations", matcher: ["IR", "International"] },
      { name: "Ethics", matcher: ["Ethics"] },
      { name: "Society", matcher: ["Society"] },
      { name: "CSAT", matcher: ["CSAT"] },
      { name: "Optional Papers", matcher: ["Optional"] },
      { name: "Internal Security", matcher: ["IS", "Security"] },
      { name: "Governance", matcher: ["Governance"] },
      { name: "Essay Writing", matcher: ["Essay"] },
      { name: "Science", matcher: ["Science", "Tech"] },
      { name: "Art & Culture", matcher: ["Art", "Culture"] },
      { name: "Pre-Week", matcher: ["Pre-Week", "Pre Week"] }
    ];

    const subjectCoverage = subjectsMap.map(sub => {
      let studyDays = 0;
      currentLogs.forEach(log => {
        const subjects = (log.subjectsStudied || "").toLowerCase();
        const revised = (log.subjectsRevised || "").toLowerCase();
        const combined = `${subjects},${revised}`;
        
        const matches = sub.matcher.some(m => {
          const lowerM = m.toLowerCase();
          // For modern history, make sure it's not ancient or medieval
          if (lowerM === "history" && (combined.includes("ancient") || combined.includes("medieval") || combined.includes("world"))) {
            return false;
          }
          return combined.includes(lowerM);
        });

        if (matches) {
          studyDays++;
        }
      });

      return {
        subjectName: sub.name,
        totalDays: diffDays,
        studyDays
      };
    });

    // Return report package
    return NextResponse.json({
      metadata: {
        aspirantId: student.id,
        aspirantName: student.name,
        enrolledOn: student.createdAt,
        mentorName: student.mentors[0]?.name || "Govind Singh",
        medium: student.medium,
        targetYear: student.targetYear
      },
      ranges: {
        current: {
          start: currentStart,
          end: currentEnd,
          days: diffDays
        },
        previous: {
          start: prevStart,
          end: prevEnd,
          days: diffDays
        }
      },
      timeUtilization: {
        current: currentAverages,
        previous: prevAverages
      },
      emotionalStatus: {
        counts: emotionCounts,
        overall: overallEmotion,
        totalLogs: currentLogs.length
      },
      dayCycle: dayCycleData,
      dnaAndChallenges: {
        dna: {
          current: currentDnaDays,
          previous: prevDnaDays
        },
        challenges: {
          current: currentChallenges,
          previous: prevChallenges
        }
      },
      subjectCoverage
    });

  } catch (error: any) {
    console.error("APR Report API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
