import { PrismaClient } from "@prisma/client";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables from .env file
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

const sesClient = new SESClient({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  }
});

const APP_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";
const fromEmail = process.env.AWS_SES_FROM_EMAIL || "info@trackerindia.com";

async function sendReminderEmail(toEmail, userName, role) {
  const isStudent = role === "STUDENT";
  const actionText = isStudent ? "submit your study log" : "review your students' study logs";
  const buttonText = isStudent ? "Submit Daily Log" : "Review Students";
  const linkPath = isStudent ? "/dashboard/student/daily-log" : "/dashboard/mentor/students";

  const htmlBody = \`
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaeb; border-radius: 8px;">
      <h2 style="color: #1E3A8A; border-bottom: 2px solid #1E3A8A; padding-bottom: 10px;">UPSC Tracker - Daily Reminder</h2>
      <p style="color: #333; font-size: 16px;">Hello \${userName}! 🌟</p>
      <p style="color: #333; font-size: 16px;">This is your daily reminder to \${actionText}. Consistency is the key to clearing UPSC!</p>
      
      <p style="color: #333; font-size: 16px; margin-top: 30px;">
        <a href="\${APP_URL}\${linkPath}" style="background-color: #1E3A8A; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">\${buttonText}</a>
      </p>
      
      <p style="color: #666; font-size: 14px; margin-top: 30px;">
        Have you already done it? If so, great job! You can ignore this email.<br/><br/>
        Stay consistent. Success is near.<br/>
        - A Unit of Mentorship India
      </p>
    </div>
  \`;

  const params = {
    Destination: { ToAddresses: [toEmail] },
    Message: {
      Body: { Html: { Charset: "UTF-8", Data: htmlBody } },
      Subject: { Charset: "UTF-8", Data: \`🔔 Reminder: \${isStudent ? "Submit your Daily UPSC Study Log" : "Review Student Logs"}\` },
    },
    Source: fromEmail,
  };

  try {
    const command = new SendEmailCommand(params);
    await sesClient.send(command);
    return { success: true };
  } catch (error) {
    console.error(\`Failed to send email to \${toEmail}:\`, error.message);
    return { success: false, error: error.message };
  }
}

async function runBroadcast() {
  console.log(\`[\${new Date().toISOString()}] Starting Email Broadcast...\`);
  try {
    const users = await prisma.user.findMany({
      where: {
        role: { in: ["STUDENT", "MENTOR"] },
        status: "APPROVED",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    if (users.length === 0) {
      console.log("No active approved students or mentors found to email.");
      return;
    }

    console.log(\`Found \${users.length} approved users to email.\`);

    let successCount = 0;
    let failureCount = 0;

    await Promise.all(users.map(async (user) => {
      // Basic validation for email
      if (!user.email || !user.email.includes("@")) {
         failureCount++;
         return;
      }

      const result = await sendReminderEmail(user.email, user.name, user.role);
      if (result.success) {
        successCount++;
      } else {
        failureCount++;
      }
    }));

    console.log(\`[\${new Date().toISOString()}] Email Broadcast complete. Sent: \${successCount}, Failed: \${failureCount}\`);
  } catch (error) {
    console.error("Email Broadcast Error:", error);
  }
}

// Minimal Cron Implementation
console.log("Starting Email Scheduler. Waiting for 10:00 PM...");

setInterval(() => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  // Trigger at exactly 22:00:00 local machine time (10 PM)
  if (hours === 22 && minutes === 0 && seconds === 0) {
    runBroadcast();
  }
}, 1000); // check every second for exact trigger

// Optional: you can uncomment the next line to send one immediately on startup for testing!
// runBroadcast();
