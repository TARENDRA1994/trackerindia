import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const logs = await prisma.mentorLog.findMany({
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            email: true,
            whatsapp: true,
          }
        }
      },
      orderBy: { timestamp: "desc" },
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Admin mentor logs API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
