import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
      select: {
        name: true,
        email: true,
        whatsapp: true,
        dob: true,
        state: true,
        city: true,
        medium: true,
        exam: true,
        targetYear: true,
        image: true,
        role: true,
        loginId: true
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { name, image } = body;

    // 🔐 SECURITY FIX: Validate image to prevent SSRF and stored XSS.
    // Allow: https:// URLs (external CDN) and data: URIs (local file upload via FileReader).
    // Block: http://, javascript:, and any other scheme.
    if (image && typeof image === "string") {
      const isHttps = image.startsWith("https://");
      const isDataUri = image.startsWith("data:image/");
      if (!isHttps && !isDataUri) {
        return NextResponse.json({ error: "Invalid image. Must be an HTTPS URL or a valid image upload." }, { status: 400 });
      }
    }

    // 🔐 SECURITY FIX: Removed 'whatsapp' from direct PATCH.
    // WhatsApp number changes must go through /api/profile/request-mobile (requires admin approval).
    const updatedUser = await prisma.user.update({
      where: { id: (session.user as any).id },
      data: {
        ...(name && name.trim().length > 0 && name.length <= 100 && { name: name.trim() }),
        ...(image && { image }),
      }
    });

    return NextResponse.json({ message: "Profile updated", user: updatedUser });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
