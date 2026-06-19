import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = (session.user as any).id;

    // Limit check: 1 AI test per day
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const existingTest = await prisma.testResult.findFirst({
      where: {
        userId,
        timestamp: { gte: startOfDay, lte: endOfDay }
      }
    });

    if (existingTest) {
      return NextResponse.json({ error: "Daily limit reached. You can only generate one AI test per day." }, { status: 403 });
    }

    const { subject, exam, count = 20 } = await req.json();

    const prompt = `
      Act as a seasoned UPSC (Union Public Service Commission) examiner. 
      Subject: ${subject}
      Exam: ${exam}
      Task: Generate ${count} unique, high-difficulty, statement-based MCQs.
      
      Requirements:
      1. Each question must have 3-4 statements.
      2. Use UPSC options format:
         (a) Only one statement is correct
         (b) Only two statements are correct
         (c) All three statements are correct
         (d) None of the statements are correct
      3. Aim for analytical depth, not just factual recall. Incorporate "The Hindu" editorial level complexity.
      4. Avoid repetition.
      
      Response MUST be purely in this JSON format (no markdown, no extra text):
      [
        {
          "question": "string",
          "statements": ["s1", "s2", "s3"],
          "options": ["(a) Only one", "(b) Only two", "(c) All three", "(d) None"],
          "correctAnswer": 0,
          "explanation": "Detailed explanation identifying the logic and 'trap' used."
        }
      ]
    `;

    let text = "";
    let retries = 3;
    
    while (retries > 0) {
      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        text = response.text();
        break; // Success
      } catch (e: any) {
        if (e.message?.includes("503") || e.message?.includes("Service Unavailable")) {
          retries--;
          if (retries === 0) throw e;
          // Wait 1.5 seconds before retrying
          await new Promise(resolve => setTimeout(resolve, 1500));
        } else {
          throw e; // Non-503 error, throw immediately
        }
      }
    }
    
    // Clean JSON from markdown if necessary
    const jsonString = text.replace(/```json/gi, "").replace(/```/g, "").trim();

    if (!jsonString) throw new Error("AI returned empty content");

    return NextResponse.json(JSON.parse(jsonString));
  } catch (error: any) {
    console.error("AI Generation Error:", error.message || error);
    return NextResponse.json({ error: "High AI Demand (503) or Limit Reached. Please try again in a few seconds." }, { status: 500 });
  }
}
