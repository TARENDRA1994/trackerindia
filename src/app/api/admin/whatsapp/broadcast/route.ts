import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppMessage, buildDailyReminderInteractivePayload } from "@/lib/whatsapp";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all active students
    const students = await prisma.user.findMany({
      where: {
        role: "STUDENT",
        status: "APPROVED",
        whatsapp: { not: "" }
      },
      select: {
        id: true,
        name: true,
        whatsapp: true
      }
    });

    if (students.length === 0) {
      return NextResponse.json({ message: "No active students found with WhatsApp numbers." }, { status: 200 });
    }

    let successCount = 0;
    let failureCount = 0;

    // We use Promise.all to send messages concurrently
    // Note: For a very large number of students, we might need to batch these to avoid rate limits
    await Promise.all(students.map(async (student) => {
      // 1. Create a PENDING log entry
      const log = await prisma.whatsAppMessageLog.create({
        data: {
          userId: student.id,
          messageType: "DAILY_REMINDER",
          status: "PENDING"
        }
      });

      // 2. Build payload and send
      const payload = buildDailyReminderInteractivePayload(student.name);
      
      try {
        const result = await sendWhatsAppMessage(student.whatsapp, "interactive", payload);
        
        // 3. Update log based on result
        if (result.success) {
          await prisma.whatsAppMessageLog.update({
            where: { id: log.id },
            data: {
              status: "SENT",
              messageId: result.messageId
            }
          });
          successCount++;
        } else {
          await prisma.whatsAppMessageLog.update({
            where: { id: log.id },
            data: {
              status: "FAILED",
              errorDetail: result.error
            }
          });
          failureCount++;
        }
      } catch (e: any) {
        await prisma.whatsAppMessageLog.update({
          where: { id: log.id },
          data: {
            status: "FAILED",
            errorDetail: e.message
          }
        });
        failureCount++;
      }
    }));

    return NextResponse.json({ 
      message: `Broadcast complete. Sent: ${successCount}, Failed: ${failureCount}`,
      successCount,
      failureCount
    });

  } catch (error: any) {
    console.error("WhatsApp Broadcast Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
