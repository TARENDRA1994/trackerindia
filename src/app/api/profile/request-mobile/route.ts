import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const { newMobile, reason } = await req.json();

  if (!newMobile || !reason) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  try {
    const request = await prisma.mobileChangeRequest.create({
      data: {
        userId,
        newMobile,
        reason,
        status: "PENDING"
      }
    });

    return NextResponse.json(request);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
