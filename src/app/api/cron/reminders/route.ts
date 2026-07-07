import { prisma } from "@/lib/prisma";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { NextResponse } from "next/server";

const sesClient = new SESClient({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  }
});

const APP_URL = process.env.NEXTAUTH_URL || "https://trackerindia.com";
const fromEmail = process.env.AWS_SES_FROM_EMAIL || "info@trackerindia.com";

async function sendReminderEmail(toEmail: string, userName: string, role: string) {
  const isStudent = role === "STUDENT";
  const actionText = isStudent ? "submit your study log" : "review your students' study logs";
  const buttonText = isStudent ? "Submit Daily Log" : "Review Students";
  const linkPath = isStudent ? "/dashboard/log" : "/dashboard/mentor";

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaeb; border-radius: 8px;">
      <h2 style="color: #1E3A8A; border-bottom: 2px solid #1E3A8A; padding-bottom: 10px;">UPSC Tracker - Daily Reminder</h2>
      <p style="color: #333; font-size: 16px;">Hello ${userName}! 🌟</p>
      <p style="color: #333; font-size: 16px;">This is your daily reminder to ${actionText}. Consistency is the key to clearing UPSC!</p>
      
      <p style="color: #333; font-size: 16px; margin-top: 30px;">
        <a href="${APP_URL}${linkPath}" style="background-color: #1E3A8A; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">${buttonText}</a>
      </p>
      
      <p style="color: #666; font-size: 14px; margin-top: 30px;">
        Have you already done it? If so, great job! You can ignore this email.<br/><br/>
        Stay consistent. Success is near.<br/>
        - A Unit of Mentorship India
      </p>
    </div>
  `;

  const params = {
    Destination: { ToAddresses: [toEmail] },
    Message: {
      Body: { Html: { Charset: "UTF-8", Data: htmlBody } },
      Subject: { Charset: "UTF-8", Data: `🔔 Reminder: ${isStudent ? "Submit your Daily UPSC Study Log" : "Review Student Logs"}` },
    },
    Source: fromEmail,
  };

  try {
    const command = new SendEmailCommand(params);
    await sesClient.send(command);
    return true;
  } catch (error) {
    console.error(`Failed to send email to ${toEmail}:`, error);
    return false;
  }
}

export async function GET(req: Request) {
  try {
    // Optional: Protect the route so only you or your cron service can trigger it
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET || 'tracker-cron-key'}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      where: {
        role: { in: ["STUDENT", "MENTOR"] },
        status: "APPROVED",
      },
      select: { id: true, name: true, email: true, role: true }
    });

    if (users.length === 0) {
      return NextResponse.json({ message: "No active users found." });
    }

    let successCount = 0;
    let failureCount = 0;

    await Promise.all(users.map(async (user) => {
      if (!user.email || !user.email.includes("@")) {
         failureCount++;
         return;
      }

      const success = await sendReminderEmail(user.email, user.name, user.role);
      if (success) successCount++;
      else failureCount++;
    }));

    return NextResponse.json({ 
      success: true, 
      message: `Broadcast complete. Sent: ${successCount}, Failed: ${failureCount}` 
    });

  } catch (error) {
    console.error("Cron Broadcast Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
