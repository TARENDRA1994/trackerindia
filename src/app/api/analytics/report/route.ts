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
      subjectCoverage,
      // Calculate dynamic data based on currentLogs
      
      const safePercent = (val: number, max: number) => max > 0 ? Math.round((val / max) * 100) : 0;
      
      // Study Performance Matrix
      const focusScores = { "Deep": 100, "Moderate": 75, "Low": 50, "Very Low": 25 };
      const effectScores = { "Highly Effective": 100, "Effective": 75, "Average": 50, "Low": 25 };
      let avgFocusScore = currentLogs.reduce((acc, log) => acc + (focusScores[log.focusLevel as keyof typeof focusScores] || 50), 0) / (currentLogs.length || 1);
      let avgEffectScore = currentLogs.reduce((acc, log) => acc + (effectScores[log.studyEffectiveness as keyof typeof effectScores] || 50), 0) / (currentLogs.length || 1);
      const perfRating = Math.round((avgFocusScore + avgEffectScore) / 2);
      
      let focusLevelText = "Moderate";
      if (avgFocusScore >= 80) focusLevelText = "Deep";
      else if (avgFocusScore < 50) focusLevelText = "Low";
      
      let effectText = "Average";
      if (avgEffectScore >= 80) effectText = "Highly Effective";
      else if (avgEffectScore >= 60) effectText = "Effective";

      let overallStatus = "NEEDS IMPROVEMENT";
      if (perfRating >= 80) overallStatus = "EXCELLENT";
      else if (perfRating >= 60) overallStatus = "GOOD PROGRESS";

      // Daily Routine Analysis
      let wakeUpSum = 0, validWakeUps = 0;
      currentLogs.forEach(log => {
         const match = log.wakeUpTime.match(/(\d+):(\d+)/);
         if (match) {
            wakeUpSum += parseInt(match[1]) * 60 + parseInt(match[2]);
            validWakeUps++;
         }
      });
      let avgWakeUpMins = validWakeUps > 0 ? wakeUpSum / validWakeUps : 360;
      let wakeHrs = Math.floor(avgWakeUpMins / 60);
      let wakeMins = Math.round(avgWakeUpMins % 60);
      let wakeText = `${wakeHrs.toString().padStart(2, '0')}:${wakeMins.toString().padStart(2, '0')} AM`;
      
      let avgSleepStr = `${currentAverages.sleep} Hours`;
      let routinePerc = 100 - Math.abs(currentAverages.sleep - 7) * 10;
      routinePerc = Math.max(0, Math.min(100, routinePerc));
      
      // Core Study Activity Breakdown (Estimated)
      let caPerc = (currentLogs.filter(l => l.currentAffairsDone).length / (currentLogs.length || 1)) * 20;
      let pyqPerc = (currentLogs.filter(l => l.pyqAnalysisDone).length / (currentLogs.length || 1)) * 20;
      let ansPerc = (currentLogs.filter(l => l.answerWritingDone).length / (currentLogs.length || 1)) * 15;
      let revPerc = (currentLogs.filter(l => !!l.subjectsRevised).length / (currentLogs.length || 1)) * 15;
      let subPerc = 100 - (caPerc + pyqPerc + ansPerc + revPerc);

      // Test Performance
      const attemptedTests = currentLogs.filter(l => l.testAttempted);
      const testScores = attemptedTests.map(l => l.testScore || 0).filter(s => s > 0);
      const avgTestScore = testScores.length > 0 ? Math.round(testScores.reduce((a, b) => a + b, 0) / testScores.length) : 0;
      
      // Answer Writing
      const totalAnswers = currentLogs.reduce((acc, log) => acc + (log.answersCount || 0), 0);
      const reviewedAnswers = currentLogs.filter(l => l.reviewedAnswers).length;
      const awDays = currentLogs.filter(l => l.answerWritingDone).length;
      
      // Revision
      const avgRetention = currentLogs.reduce((acc, log) => acc + (log.retentionScore || 0), 0) / (currentLogs.length || 1);
      
      // Consistency
      let streak = 0;
      let c = new Date();
      c.setHours(0,0,0,0);
      for (let i = 0; i < 30; i++) {
         const hasLog = allLogs.some(l => new Date(l.timestamp).toDateString() === c.toDateString());
         if (hasLog) streak++;
         else if (i > 0) break; 
         c.setDate(c.getDate() - 1);
      }
      
      // Next Day Planning
      const plannedDays = currentLogs.filter(l => l.clarityTomorrow === "Very Clear" || l.clarityTomorrow === "Clear").length;
      const clarityScore = safePercent(plannedDays, currentLogs.length);

      // Focus & Distractions
      const dists: Record<string, number> = {};
      currentLogs.forEach(l => {
         if (l.biggestDistraction) {
            dists[l.biggestDistraction] = (dists[l.biggestDistraction] || 0) + 1;
         }
      });
      const topDists = Object.entries(dists).sort((a,b) => b[1] - a[1]).slice(0, 3).map(d => ({ name: d[0], severity: d[1] > 2 ? "High" : "Medium" }));
      if (topDists.length === 0) topDists.push({ name: "Social Media", severity: "Medium" });

      // Calculate Subject Scores dynamically from Subject Coverage
      const dynamicSubjectScore = subjectCoverage.filter(s => s.studyDays > 0).map(s => {
         return {
            subject: s.subjectName,
            score: Math.min(100, 40 + (s.studyDays * 10))
         };
      }).sort((a,b) => b.score - a.score).slice(0, 7);
      
      if (dynamicSubjectScore.length === 0) {
         dynamicSubjectScore.push({ subject: "Polity", score: 50 }, { subject: "Economy", score: 50 });
      }

      const overallPrep = Math.round((perfRating + routinePerc + avgRetention + clarityScore) / 4);

      return NextResponse.json({
         metadata: {
            aspirantId: student.id,
            aspirantName: student.name,
            enrolledOn: student.createdAt,
            mentorName: student.mentors[0]?.name || "Unassigned",
            medium: student.medium,
            targetYear: student.targetYear
         },
         ranges: { current: { start: currentStart, end: currentEnd, days: diffDays }, previous: { start: prevStart, end: prevEnd, days: diffDays } },
         timeUtilization: {
            effectiveTimePercentage: Math.round(currentAverages.studyPct),
            categories: [
               { name: "Focused Study", hrs: currentAverages.study, percent: Math.round(currentAverages.studyPct), color: "#22C55E" },
               { name: "Sleep", hrs: currentAverages.sleep, percent: Math.round(currentAverages.sleepPct), color: "#3B82F6" },
               { name: "Free/Other", hrs: currentAverages.free, percent: Math.round(currentAverages.freePct), color: "#F59E0B" }
            ],
            trend: dayCycleData.reverse().map(d => ({ date: d.date, hrs: d.Study }))
         },
         emotionalStatus: { counts: emotionCounts, overall: overallEmotion, totalLogs: currentLogs.length },
         dayCycle: dayCycleData,
         dnaAndChallenges: { dna: { current: currentDnaDays, previous: prevDnaDays }, challenges: { current: currentChallenges, previous: prevChallenges } },
         subjectCoverage,
         
         studyPerformanceMatrix: {
            focusLevel: focusLevelText,
            studyEffectiveness: effectText,
            performanceRating: perfRating,
            overallStatus: overallStatus,
            percentage: perfRating
         },
         dailyRoutineAnalysis: {
            wakeUpTime: wakeText,
            sleepDuration: avgSleepStr,
            routineDiscipline: routinePerc >= 75 ? "Excellent" : routinePerc >= 50 ? "Average" : "Needs Improvement",
            biologicalRoutine: "Stable",
            percentage: routinePerc
         },
         coreStudyActivity: {
            totalHours: currentAverages.study,
            breakdown: [
               { name: "Current Affairs", value: (caPerc/100)*currentAverages.study, percent: Math.round(caPerc), color: "#3B82F6" },
               { name: "PYQs Practice", value: (pyqPerc/100)*currentAverages.study, percent: Math.round(pyqPerc), color: "#22C55E" },
               { name: "Subject Study", value: (subPerc/100)*currentAverages.study, percent: Math.round(subPerc), color: "#8B5CF6" },
               { name: "Answer Writing", value: (ansPerc/100)*currentAverages.study, percent: Math.round(ansPerc), color: "#F59E0B" },
               { name: "Revision", value: (revPerc/100)*currentAverages.study, percent: Math.round(revPerc), color: "#06B6D4" }
            ]
         },
         testPerformance: {
            testsAttemptedToday: attemptedTests.length,
            averageScore: avgTestScore,
            improvement: "+0%",
            mocksAttemptedThisMonth: attemptedTests.length,
            scoreTrend: testScores.map((score, i) => ({ name: `T-${testScores.length - i}`, score })),
            testWise: attemptedTests.map(t => ({ name: t.testName || "Mock Test", score: `${t.testScore}%`, accuracy: "N/A", rank: "N/A" }))
         },
         answerWriting: {
            writtenToday: currentLogs[currentLogs.length-1]?.answersCount || 0,
            reviewed: reviewedAnswers,
            reviewPercentage: safePercent(reviewedAnswers, awDays),
            writtenThisMonth: totalAnswers
         },
         revisionRetention: {
            retentionLevel: Math.round(avgRetention * 10), // Assuming retention is 0-10
            topicsRevisedToday: 2,
            topicsPending: 0
         },
         wellBeing: {
            overallScore: emotionCounts.Positive > 0 ? safePercent(emotionCounts.Positive, currentLogs.length) : 50,
            mood: overallEmotion,
            motivationLevel: "Average",
            focusLevel: focusLevelText,
            stressPressure: emotionCounts.Exhausted > emotionCounts.Positive ? "High" : "Low",
            energyLevel: "Good"
         },
         consistencyTracker: {
            streak: streak,
            studyDaysThisMonth: currentLogs.length,
            consistencyScore: safePercent(currentLogs.length, diffDays),
            missedDays: diffDays - currentLogs.length,
            heatmap: Array(14).fill(0).map((_, i) => ({ day: ["S","M","T","W","T","F","S"][i%7], status: i % 2 === 0 ? "submitted" : "missed" }))
         },
         backlogManagement: {
            pendingFromYesterday: currentLogs.filter(l => l.buildingBacklog === "Yes").length,
            carriedForwardToday: currentLogs.filter(l => l.tasksForward).length,
            completedToday: 1,
            totalForToday: 3,
            riskLevel: "Low Risk",
            trend: dayCycleData.map(d => ({ date: d.date, count: 0 }))
         },
         nextDayPlanning: {
            clarityScore: clarityScore,
            planClarity: clarityScore > 75 ? "Clear" : "Unclear",
            subjectPrioritySet: "Yes",
            targetTimeForStudy: "8 hrs",
            confidence: "High",
            priorities: ["Subject Revision", "Current Affairs"]
         },
         subjectWiseScore: dynamicSubjectScore,
         retentionEffectiveness: {
            overallScore: Math.round(avgRetention * 10),
            strongTopics: dynamicSubjectScore.slice(0, 2).map(s => ({ name: s.subject, score: s.score })),
            weakTopics: dynamicSubjectScore.slice(-2).map(s => ({ name: s.subject, score: s.score }))
         },
         performanceTrend: dayCycleData.map(d => ({ date: d.date, score: d.Study * 10 })),
         batchAverageComparison: [
            { parameter: "Daily Study Hours", student: `${currentAverages.study} hrs`, batch: "6.0 hrs", diff: `${(currentAverages.study - 6).toFixed(1)} hrs`, status: currentAverages.study >= 6 ? "Better" : "Needs Work" },
            { parameter: "Tests Attempted", student: attemptedTests.length, batch: 2, diff: attemptedTests.length - 2, status: attemptedTests.length >= 2 ? "Better" : "Needs Work" }
         ],
         focusDistraction: {
            deepFocus: avgFocusScore >= 80 ? 60 : 30,
            moderateFocus: avgFocusScore >= 60 && avgFocusScore < 80 ? 50 : 30,
            lowFocus: avgFocusScore < 60 ? 40 : 10,
            veryLowFocus: 0,
            helpedFocus: ["Silent Environment"],
            distractions: topDists
         },
         strengthWeakness: {
            strengths: dynamicSubjectScore.slice(0, 2).map(s => ({ area: s.subject, score: s.score })),
            weaknesses: dynamicSubjectScore.slice(-2).map(s => ({ area: s.subject, score: s.score }))
         },
         overallPreparationIndex: {
            overallScore: overallPrep,
            status: overallPrep >= 75 ? "Excellent" : overallPrep >= 50 ? "Good Progress" : "Needs Improvement",
            parameters: [
               { name: "Discipline", score: routinePerc, weight: 20 },
               { name: "Study Effectiveness", score: perfRating, weight: 20 }
            ],
            readiness: { prelims: overallPrep, mains: overallPrep - 10, interview: overallPrep - 20 }
         }
      });

  } catch (error: any) {
    console.error("APR Report API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
