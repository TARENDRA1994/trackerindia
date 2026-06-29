import { prisma } from "@/lib/prisma";
import AdminDashboard from "@/components/AdminDashboard";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN" || session.user?.email !== "tarendra.garhewal2024@gmail.com") {
    redirect("/login?role=ADMIN");
  }

  const pendingUsers = await prisma.user.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-white">
      <AdminDashboard initialUsers={pendingUsers} />
    </main>
  );
}
