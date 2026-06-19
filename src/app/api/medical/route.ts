import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      console.error("Unauthorized medical log attempt - Session user id missing", session);
      return NextResponse.json({ error: "Unauthorized - Please relogin" }, { status: 401 });
    }

    const { sleepQuality, eyeStrain, stressLevel, headacheFrequency } = await req.json();

    let suggestions = "Maintain a consistent sleep schedule (7-8 hours), take 5-minute eye breaks every hour of study (20-20-20 rule), and stay hydrated. Focus on deep breathing exercises for stress.";

    if (process.env.OPENAI_API_KEY) {
      try {
        const openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });

        const prompt = `
          Act as a Student Wellness & Medical Advisor for a UPSC aspirant who studies 10-12 hours a day.
          Data:
          - Sleep Quality: ${sleepQuality}
          - Eye Strain: ${eyeStrain}
          - Stress Level: ${stressLevel}
          - Headache Frequency: ${headacheFrequency}
          
          Give 3 precise, actionable study-wellness suggestions. Keep it short and professional.
        `;

        const aiRes = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{ role: "user", content: prompt }],
        });

        suggestions = aiRes.choices[0].message.content || suggestions;
      } catch (aiError) {
        console.error("AI Generation failed, using fallback:", aiError);
      }
    }

    const log = await prisma.medicalLog.create({
      data: {
        userId: (session.user as any).id,
        sleepQuality,
        eyeStrain,
        stressLevel,
        headacheFrequency,
        aiSuggestions: suggestions,
      },
    });

    return NextResponse.json({ log, suggestions });
  } catch (error: any) {
    console.error("Medical log error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
