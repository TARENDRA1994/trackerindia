import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { toId, content, type } = body;

    if (!content || content.length > 500) {
      return NextResponse.json({ error: "Message must be between 1 and 500 characters." }, { status: 400 });
    }

    const feedback = await prisma.feedback.create({
      data: {
        fromId: (session.user as any).id,
        toId,
        content,
        type: type || "SUGGESTION"
      }
    });

    // Create a notification for the recipient
    await prisma.notification.create({
      data: {
        userId: toId,
        title: "New Mentor Directive Received",
        message: "Your mentor has shared a new academic guidance note for you.",
        type: "ANNOUNCEMENT"
      }
    });

    return NextResponse.json({ message: "Directive sent", feedback });
  } catch (error) {
    console.error("Feedback API error:", error);
    return NextResponse.json({ error: "Failed to send directive" }, { status: 500 });
  }
}
