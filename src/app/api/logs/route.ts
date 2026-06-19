import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { analyzeStudentLog } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const userId = (session.user as any).id;

    // 1. Check if log already exists for today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const existingLog = await prisma.dailyLog.findFirst({
       where: {
          userId,
          timestamp: {
             gte: startOfDay,
             lte: endOfDay
          }
       }
    });

    if (existingLog) {
       return NextResponse.json({ 
          error: "Duplicate Entry", 
          message: "You have already submitted today's reflection. Consistency is key, but one deep reflection per day is enough!" 
       }, { status: 400 });
    }

    // 2. Fetch User Medium for AI Analysis
    const user = await prisma.user.findUnique({
       where: { id: userId },
       select: { medium: true }
    });
    const medium = user?.medium || "English";

    // 3. Run AI Analysis (Async)
    let aiResults = { diagnosis: null, improvements: null };
    try {
       const analysis = await analyzeStudentLog(body, medium);
       aiResults.diagnosis = analysis.diagnosis;
       aiResults.improvements = analysis.improvements;
    } catch (e) {
       console.error("AI Analysis failed to trigger during log creation", e);
    }
    
    // 2. Save Log with AI Results
    const log = await prisma.dailyLog.create({
      data: {
        userId,
        
        // SECTION 0: Intent
        primaryGoal: body.primaryGoal,

        // SECTION 1: Emotional & Mental State
        feeling: body.feeling || "Normal",
        mentalHealthSupport: !!body.mentalHealthSupport,
        supportType: body.supportType,

        // SECTION 2: Daily Basics
        wakeUpTime: body.wakeUpTime || "06:00",
        sleepDuration: body.sleepDuration || "7h",

        // SECTION 3: Core Study Activity
        currentAffairsDone: !!body.currentAffairsDone,
        attemptedCaTest: !!body.attemptedCaTest,
        pyqAnalysisDone: !!body.pyqAnalysisDone,
        subjectsStudied: Array.isArray(body.subjectsStudied) ? body.subjectsStudied.join(",") : body.subjectsStudied,
        studyHours: body.studyHours || "0",

        // SECTION 4: Study Quality & Behavior
        workCompleted: body.workCompleted,
        focusLevel: body.focusLevel,
        biggestDistraction: body.biggestDistraction,
        reductionPlan: body.reductionPlan,
        productiveTime: body.productiveTime,
        startDifficulty: body.startDifficulty,
        breaksEffect: body.breaksEffect,
        effortSatisfaction: body.effortSatisfaction,

        // SECTION 5: Answer Writing
        answerWritingDone: !!body.answerWritingDone,
        answersCount: parseInt(body.answersCount) || 0,
        reviewedAnswers: !!body.reviewedAnswers,

        // SECTION 6: Test Tracking
        testAttempted: !!body.testAttempted,
        testName: body.testName,
        testScore: body.testScore ? parseInt(body.testScore) : null,
        mistakeType: body.mistakeType,

        // SECTION 7: Learning, Retention & Depth
        subjectsRevised: Array.isArray(body.subjectsRevised) ? body.subjectsRevised.join(",") : body.subjectsRevised,
        topicsRevised: body.topicsRevised,
        hardestTopic: body.hardestTopic,
        difficultyReason: body.difficultyReason,
        retentionScore: parseInt(body.retentionScore) || 0,
        understandingLevel: body.understandingLevel,
        recallLevel: body.recallLevel,
        confidenceUPSC: body.confidenceUPSC,
        rememberAfter3Days: body.rememberAfter3Days,
        mentalOverload: body.mentalOverload,
        weakestSubject: body.weakestSubject,
        urgentRevisionTopic: body.urgentRevisionTopic,

        // SECTION 8: Productivity & Reflection
        studyEffectiveness: body.studyEffectiveness,
        dayRating: body.dayRating,
        smallWin: body.smallWin,

        // SECTION 9: Backlog & Pressure
        buildingBacklog: body.buildingBacklog,
        tasksForward: !!body.tasksForward,

        // SECTION 10: Planning
        clarityTomorrow: body.clarityTomorrow,

        // SECTION 11: Support & Feedback
        mentorInteractionDone: !!body.mentorInteractionDone,
        stuckInTopic: !!body.stuckInTopic,
        stuckTopicDetails: body.stuckTopicDetails,
        feedbackCategory: body.feedbackCategory,
        feedback: body.feedback,

        // AI RESULTS
        aiAnalysis: aiResults.diagnosis,
        aiImprovement: aiResults.improvements
      },
    });

    return NextResponse.json({ message: "Log saved with AI analysis", log }, { status: 201 });
  } catch (error: any) {
    console.error("Daily log error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
