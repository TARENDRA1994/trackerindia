import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const identifier = searchParams.get("identifier");

    if (!identifier) {
      return NextResponse.json({ error: "Identifier (email or whatsapp) is required" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { whatsapp: identifier }
        ]
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete all related records in a transaction
    await prisma.$transaction(async (tx) => {
      // 1. Daily Logs
      await tx.dailyLog.deleteMany({ where: { userId: user.id } });
      
      // 2. Medical Logs
      await tx.medicalLog.deleteMany({ where: { userId: user.id } });
      
      // 3. Test Results
      await tx.testResult.deleteMany({ where: { userId: user.id } });
      
      // 4. Mobile Change Requests
      await tx.mobileChangeRequest.deleteMany({ where: { userId: user.id } });
      
      // 5. Mentor Logs
      await tx.mentorLog.deleteMany({ where: { mentorId: user.id } });
      
      // 6. Feedbacks (given & received)
      await tx.feedback.deleteMany({ where: { fromId: user.id } });
      await tx.feedback.deleteMany({ where: { toId: user.id } });
      
      // 7. Notifications
      await tx.notification.deleteMany({ where: { userId: user.id } });
      
      // 8. WhatsApp Message Logs
      await tx.whatsappMessageLog.deleteMany({ where: { userId: user.id } });

      // Note: Implicit Many-to-Many relations (mentors, students) are automatically handled by Prisma when the user is deleted
      
      // Finally, delete the user
      await tx.user.delete({ where: { id: user.id } });
    });

    return NextResponse.json({ message: "User and all related data deleted successfully" });
  } catch (error) {
    console.error("Admin user delete error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
