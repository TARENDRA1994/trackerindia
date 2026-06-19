-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "dob" DATETIME NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "medium" TEXT NOT NULL,
    "exam" TEXT NOT NULL,
    "targetYear" INTEGER NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'STUDENT',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "loginId" TEXT,
    "password" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DailyLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "emotion" TEXT NOT NULL,
    "mentalHealthSupport" BOOLEAN NOT NULL DEFAULT false,
    "currentAffairsDone" BOOLEAN NOT NULL DEFAULT false,
    "pyqAnalysisDone" BOOLEAN NOT NULL DEFAULT false,
    "wakeUpTime" TEXT NOT NULL,
    "sleepDuration" TEXT NOT NULL,
    "subjects" TEXT NOT NULL,
    "answerWritingDone" BOOLEAN NOT NULL DEFAULT false,
    "mentorInteractionDone" BOOLEAN NOT NULL DEFAULT false,
    "testAttempted" BOOLEAN NOT NULL DEFAULT false,
    "testName" TEXT,
    "testScore" INTEGER,
    "revisionTopics" TEXT,
    "retentionScore" INTEGER NOT NULL,
    "studyHours" REAL NOT NULL,
    "feedback" TEXT,
    "feedbackCategory" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DailyLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TestResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "accuracy" REAL NOT NULL,
    "timeTaken" INTEGER NOT NULL,
    "weakAreas" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TestResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MedicalLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "sleepQuality" TEXT NOT NULL,
    "eyeStrain" TEXT NOT NULL,
    "stressLevel" TEXT NOT NULL,
    "headacheFrequency" TEXT NOT NULL,
    "aiSuggestions" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MedicalLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_whatsapp_key" ON "User"("whatsapp");

-- CreateIndex
CREATE UNIQUE INDEX "User_loginId_key" ON "User"("loginId");
