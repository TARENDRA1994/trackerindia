import DailyLogForm from "@/components/DailyLogForm";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { CheckCircle2, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function DailyLogPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const userId = (session.user as any).id;
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const existingLog = await prisma.dailyLog.findFirst({
    where: {
      userId,
      timestamp: { gte: startOfDay }
    }
  });

  if (existingLog) {
     return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-8">
           <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
           </div>
           <div className="space-y-2">
              <h1 className="text-4xl font-serif font-bold text-primary">Mission Accomplished</h1>
              <p className="text-stone-400 italic font-medium">You have already submitted your commitment for today.</p>
           </div>
           <Link href="/dashboard" className="px-10 py-4 bg-primary text-white font-bold uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" /> Back to Base
           </Link>
        </div>
     )
  }

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { medium: true } });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end border-b border-stone-100 pb-6">
        <div>
           <div className="text-[10px] font-bold text-stone-300 uppercase tracking-[0.3em] mb-1">Aspirant Daily Reflection</div>
           <h1 className="text-4xl font-serif font-bold text-primary italic">Daily Commitment Log</h1>
        </div>
        <p className="text-stone-400 text-xs italic font-medium hidden md:block">"Every entry is a brick in the wall of your success."</p>
      </div>
      
      <DailyLogForm medium={user?.medium || "English"} />
    </div>
  );
}
