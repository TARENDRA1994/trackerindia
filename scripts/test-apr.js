const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    const studentId = 'cmqp23le300013ts4b9nzqhwx';
    const student = await prisma.user.findUnique({
      where: { id: studentId },
      include: {
        mentors: {
          select: { name: true }
        }
      }
    });

    if (!student) {
      console.log('Student not found');
      return;
    }

    let currentStart = new Date();
    currentStart.setDate(currentStart.getDate() - 30);
    currentStart.setHours(0, 0, 0, 0);
    let currentEnd = new Date();
    currentEnd.setHours(23, 59, 59, 999);

    const diffTime = currentEnd.getTime() - currentStart.getTime();
    const diffDays = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1);

    const prevEnd = new Date(currentStart.getTime() - 1);
    const prevStart = new Date(currentStart.getTime() - (diffDays * 24 * 60 * 60 * 1000));

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

    const currentLogs = allLogs.filter(log => log.timestamp >= currentStart && log.timestamp <= currentEnd);
    const prevLogs = allLogs.filter(log => log.timestamp >= prevStart && log.timestamp <= prevEnd);

    const parseStudyHours = (val) => {
      if (!val) return 0;
      if (val === "12+") return 13;
      if (val === "10+") return 11;
      const parts = val.split(/[–-]/);
      if (parts.length > 1) return (parseFloat(parts[0]) + parseFloat(parts[1])) / 2;
      return parseFloat(val) || 0;
    };

    const parseSleepDuration = (val) => {
      if (!val) return 0;
      if (val === "8+") return 9;
      if (val === "7h") return 7;
      const parts = val.split(/[–-]/);
      if (parts.length > 1) return (parseFloat(parts[0]) + parseFloat(parts[1])) / 2;
      return parseFloat(val) || 0;
    };

    const getAverages = (logsList) => {
      if (logsList.length === 0) {
        return { sleep: 0, study: 0, working: 0, free: 24, sleepPct: 0, studyPct: 0, freePct: 100 };
      }
      const totalSleep = logsList.reduce((acc, log) => acc + parseSleepDuration(log.sleepDuration), 0);
      const totalStudy = logsList.reduce((acc, log) => acc + parseStudyHours(log.studyHours), 0);
      
      const avgSleep = totalSleep / logsList.length;
      const avgStudy = totalStudy / logsList.length;
      const avgWorking = 0.0;
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

    const emotionCounts = { Positive: 0, Exhausted: 0, Confused: 0, Sad: 0, Depressed: 0 };
    currentLogs.forEach(log => {
      let category = "Positive";
      const feeling = log.feeling || "";
      if (feeling === "Sad") category = "Sad";
      else if (feeling === "Depressed") category = "Depressed";
      else if (feeling === "Normal" || feeling === "Meh") {
        if (log.mentalOverload === "High" || log.mentalOverload === "Slight") category = "Exhausted";
        else if (log.stuckInTopic) category = "Confused";
      }
      emotionCounts[category]++;
    });

    let overallEmotion = "Positive";
    let maxCount = -1;
    Object.keys(emotionCounts).forEach(key => {
      if (emotionCounts[key] > maxCount) {
        maxCount = emotionCounts[key];
        overallEmotion = key;
      }
    });

    const dayCycleData = [];
    const dateCursor = new Date(currentEnd);
    for (let i = 0; i < diffDays; i++) {
      const cursorStr = dateCursor.toDateString();
      const logForDay = currentLogs.find(log => new Date(log.timestamp).toDateString() === cursorStr);
      
      const formattedDate = dateCursor.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" }).replace(/ /g, "-");

      if (logForDay) {
        const study = parseStudyHours(logForDay.studyHours);
        const sleep = parseSleepDuration(logForDay.sleepDuration);
        const free = Math.max(0, 24 - study - sleep);
        dayCycleData.push({ date: formattedDate, Study: parseFloat(study.toFixed(1)), Sleep: parseFloat(sleep.toFixed(1)), Free: parseFloat(free.toFixed(1)) });
      } else {
        dayCycleData.push({ date: formattedDate, Study: 0, Sleep: 0, Free: 24 });
      }
      dateCursor.setDate(dateCursor.getDate() - 1);
    }

    const currentDnaDays = currentLogs.filter(log => log.currentAffairsDone).length;
    const prevDnaDays = prevLogs.filter(log => log.currentAffairsDone).length;

    const currentChallenges = currentLogs.filter(log => log.workCompleted === "75-100%" || log.workCompleted === "50-75%").length;
    const prevChallenges = prevLogs.filter(log => log.workCompleted === "75-100%" || log.workCompleted === "50-75%").length;

    const subjectsMap = [
      { name: "Polity", matcher: ["Polity"] },
      { name: "Economics", matcher: ["Economy", "Economics"] },
      { name: "Modern History", matcher: ["Modern", "History"] }
    ];

    const subjectCoverage = subjectsMap.map(sub => {
      let studyDays = 0;
      currentLogs.forEach(log => {
        const subjects = (log.subjectsStudied || "").toLowerCase();
        const revised = (log.subjectsRevised || "").toLowerCase();
        const combined = `${subjects},${revised}`;
        const matches = sub.matcher.some(m => combined.includes(m.toLowerCase()));
        if (matches) studyDays++;
      });
      return { subjectName: sub.name, totalDays: diffDays, studyDays };
    });

    const safePercent = (val, max) => max > 0 ? Math.round((val / max) * 100) : 0;
    
    const focusScores = { "Deep": 100, "Moderate": 75, "Low": 50, "Very Low": 25 };
    const effectScores = { "Highly Effective": 100, "Effective": 75, "Average": 50, "Low": 25 };
    let avgFocusScore = currentLogs.reduce((acc, log) => acc + (focusScores[log.focusLevel] || 50), 0) / (currentLogs.length || 1);
    let avgEffectScore = currentLogs.reduce((acc, log) => acc + (effectScores[log.studyEffectiveness] || 50), 0) / (currentLogs.length || 1);
    const perfRating = Math.round((avgFocusScore + avgEffectScore) / 2);
    
    let focusLevelText = "Moderate";
    let effectText = "Average";
    let overallStatus = "NEEDS IMPROVEMENT";

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
    
    let caPerc = (currentLogs.filter(l => l.currentAffairsDone).length / (currentLogs.length || 1)) * 20;
    let pyqPerc = (currentLogs.filter(l => l.pyqAnalysisDone).length / (currentLogs.length || 1)) * 20;
    let ansPerc = (currentLogs.filter(l => l.answerWritingDone).length / (currentLogs.length || 1)) * 15;
    let revPerc = (currentLogs.filter(l => !!l.subjectsRevised).length / (currentLogs.length || 1)) * 15;
    let subPerc = 100 - (caPerc + pyqPerc + ansPerc + revPerc);

    const attemptedTests = currentLogs.filter(l => l.testAttempted);
    const testScores = attemptedTests.map(l => l.testScore || 0).filter(s => s > 0);
    const avgTestScore = testScores.length > 0 ? Math.round(testScores.reduce((a, b) => a + b, 0) / testScores.length) : 0;
    
    const totalAnswers = currentLogs.reduce((acc, log) => acc + (log.answersCount || 0), 0);
    const reviewedAnswers = currentLogs.filter(l => l.reviewedAnswers).length;
    const awDays = currentLogs.filter(l => l.answerWritingDone).length;
    
    const avgRetention = currentLogs.reduce((acc, log) => acc + (log.retentionScore || 0), 0) / (currentLogs.length || 1);
    
    let streak = 0;
    
    const plannedDays = currentLogs.filter(l => l.clarityTomorrow === "Very Clear" || l.clarityTomorrow === "Clear").length;
    const clarityScore = safePercent(plannedDays, currentLogs.length);

    const dists = {};
    currentLogs.forEach(l => {
       if (l.biggestDistraction) {
          dists[l.biggestDistraction] = (dists[l.biggestDistraction] || 0) + 1;
       }
    });

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

    const responseObj = {
       metadata: {
          aspirantId: student.id,
          aspirantName: student.name,
          enrolledOn: student.createdAt,
          mentorName: student.mentors[0]?.name || "Unassigned",
          medium: student.medium,
          targetYear: student.targetYear
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
    };
    
    console.log("SUCCESS");
  } catch (err) {
    console.error("ERROR", err);
  } finally {
    await prisma.$disconnect();
  }
}
run();
