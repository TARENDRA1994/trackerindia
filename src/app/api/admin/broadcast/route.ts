import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const APP_URL = process.env.NEXTAUTH_URL || "https://trackerindia.com";
const FROM_EMAIL = process.env.AWS_SES_FROM_EMAIL || "info@trackerindia.com";

function buildReminderEmail(userName: string, role: string): string {
  const isStudent = role === "STUDENT";
  const action = isStudent ? "submit your daily study reflection log" : "submit your daily faculty productivity log";
  const buttonText = isStudent ? "Submit Today's Study Log →" : "Submit Faculty Log →";
  const link = isStudent ? `${APP_URL}/dashboard/log` : `${APP_URL}/dashboard/mentor-log`;
  const greeting = isStudent
    ? `Your consistency today defines your rank tomorrow.`
    : `Your guidance shapes the future of India's civil servants.`;

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8f7f4;font-family:'Georgia',serif;">
  <div style="max-width:600px;margin:32px auto;background:#ffffff;border:1px solid #e5e1d8;overflow:hidden;">
    
    <!-- Header -->
    <div style="background:#1E3A8A;padding:36px 40px;">
      <p style="margin:0 0 6px 0;color:rgba(255,255,255,0.6);font-size:10px;font-family:Arial,sans-serif;letter-spacing:0.25em;text-transform:uppercase;font-weight:700;">
        UPSC Tracker India — Daily Reminder
      </p>
      <h1 style="margin:0;color:#ffffff;font-size:28px;font-style:italic;font-weight:700;">
        Don't Break the Streak 🔥
      </h1>
    </div>

    <!-- Body -->
    <div style="padding:40px;">
      <p style="margin:0 0 16px;color:#374151;font-size:17px;">Dear <strong>${userName}</strong>,</p>
      <p style="margin:0 0 24px;color:#6B7280;font-size:15px;line-height:1.7;">
        This is your daily reminder to ${action}. ${greeting}
      </p>

      <div style="background:#f0f4ff;border-left:4px solid #1E3A8A;padding:16px 20px;margin:0 0 32px;">
        <p style="margin:0;color:#1E3A8A;font-size:13px;font-family:Arial,sans-serif;font-weight:700;letter-spacing:0.1em;">
          📋 TODAY'S TASK
        </p>
        <p style="margin:8px 0 0;color:#374151;font-size:14px;">
          Log your ${isStudent ? "study hours, subjects covered, and daily reflection" : "sessions conducted, student interactions, and productivity"} before the day ends.
        </p>
      </div>

      <div style="text-align:center;margin:32px 0;">
        <a href="${link}" style="display:inline-block;background:#1E3A8A;color:#ffffff;padding:16px 36px;font-family:Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;text-decoration:none;">
          ${buttonText}
        </a>
      </div>

      <p style="margin:32px 0 0;color:#9CA3AF;font-size:12px;font-family:Arial,sans-serif;text-align:center;">
        Already submitted? Great job! Ignore this email.<br/>
        <em>Small daily actions lead to extraordinary results.</em>
      </p>
    </div>

    <!-- Footer -->
    <div style="border-top:1px solid #f0ece4;padding:20px 40px;background:#fafaf8;">
      <p style="margin:0;color:#9CA3AF;font-size:11px;font-family:Arial,sans-serif;text-align:center;">
        UPSC Tracker India · A Unit of Mentorship India<br/>
        <a href="${APP_URL}" style="color:#1E3A8A;text-decoration:none;">trackerindia.com</a>
      </p>
    </div>

  </div>
</body>
</html>`;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const targetRole: string = body.role || "ALL"; // "ALL", "STUDENT", or "MENTOR"

    const whereClause: any = { status: "APPROVED" };
    if (targetRole === "STUDENT") whereClause.role = "STUDENT";
    else if (targetRole === "MENTOR") whereClause.role = "MENTOR";
    else whereClause.role = { in: ["STUDENT", "MENTOR"] };

    const users = await prisma.user.findMany({
      where: whereClause,
      select: { id: true, name: true, email: true, role: true },
    });

    if (users.length === 0) {
      return NextResponse.json({ message: "No active users found.", sent: 0, failed: 0, failures: [] });
    }

    let sent = 0;
    let failed = 0;
    const failures: { name: string; email: string; reason: string }[] = [];

    await Promise.all(
      users.map(async (user) => {
        if (!user.email || !user.email.includes("@")) {
          failed++;
          failures.push({ name: user.name, email: user.email || "N/A", reason: "No valid email address" });
          return;
        }

        const htmlBody = buildReminderEmail(user.name, user.role);
        const subject = user.role === "STUDENT"
          ? "🔔 UPSC Tracker — Submit Your Daily Study Log"
          : "🔔 UPSC Tracker — Submit Your Daily Faculty Log";

        try {
          const command = new SendEmailCommand({
            Destination: { ToAddresses: [user.email] },
            Message: {
              Body: { Html: { Charset: "UTF-8", Data: htmlBody } },
              Subject: { Charset: "UTF-8", Data: subject },
            },
            Source: FROM_EMAIL,
          });
          await sesClient.send(command);
          sent++;
        } catch (err: any) {
          failed++;
          failures.push({
            name: user.name,
            email: user.email,
            reason: err.message || "SES send failed",
          });
        }
      })
    );

    return NextResponse.json({
      message: `Broadcast complete. ✅ Sent: ${sent} | ❌ Failed: ${failed}`,
      sent,
      failed,
      total: users.length,
      failures,
    });
  } catch (error: any) {
    console.error("Email Broadcast Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
