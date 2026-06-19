import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

export async function analyzeStudentLog(logData: any, medium: string = "English") {
  try {
    const prompt = `
      You are an expert UPSC Mentor (Indian Civil Services). 
      Analyze the following student's daily reflection log and provide:
      1. A brief "Performance Diagnosis" (What is going well and what is lagging).
      2. 3 actionable "Improvement Areas" for tomorrow.
      
      IMPORTANT: The student's medium of instruction is ${medium}. You MUST provide the diagnosis and actionable improvements entirely in ${medium} language.

      STUDENT LOG DATA:
      - Goal: ${logData.primaryGoal}
      - Study Hours: ${logData.studyHours}
      - Focus Level: ${logData.focusLevel}
      - Biggest Distraction: ${logData.biggestDistraction}
      - Subjects: ${logData.subjectsStudied}
      - Retention Score: ${logData.retentionScore}%
      - Answer Writing: ${logData.answerWritingDone ? 'Yes' : 'No'}
      - Test Score: ${logData.testScore || 'N/A'}
      - Mental State: ${logData.feeling}
      
      Response must be in JSON format:
      {
        "diagnosis": "...",
        "improvements": "..."
      }
    `;

    let text = "";
    let retries = 3;
    
    while (retries > 0) {
      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        text = response.text();
        break;
      } catch (e: any) {
        if (e.message?.includes("503") || e.message?.includes("Service Unavailable")) {
          retries--;
          if (retries === 0) throw e;
          await new Promise(resolve => setTimeout(resolve, 1500));
        } else {
          throw e;
        }
      }
    }
    
    // Clean JSON from markdown if necessary
    const jsonString = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return {
      diagnosis: "AI analysis currently unavailable, but your consistency is noted.",
      improvements: "Continue with your planned schedule."
    };
  }
}
