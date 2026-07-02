import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { 
  ClipboardCheck, 
  TrendingUp, 
  Target, 
  HeartPulse, 
  ChevronRight,
  Zap,
  Award,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;

  // Define "Today" boundaries (Local time start/end)
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Fetch real data from Prisma
  const [todayLog, allLogs, testResults, feedback] = await Promise.all([
    prisma.dailyLog.findFirst({
      where: {
        userId,
        timestamp: { gte: startOfDay }
      }
    }),
    prisma.dailyLog.findMany({
      where: { userId }
    }),
    prisma.testResult.findMany({
      where: { userId }
    }),
    prisma.feedback.findMany({
      where: { toId: userId, type: "CRITIQUE" },
      orderBy: { createdAt: 'desc' },
      take: 5
    })
  ]);

  // Helper to parse study hour ranges (e.g., "4-6" -> 5)
  const parseStudyHours = (val: string) => {
    if (!val) return 0;
    if (val === "10+") return 11;
    if (val.includes("–") || val.includes("-")) {
      const parts = val.split(/[–-]/);
      const start = parseFloat(parts[0]);
      const end = parseFloat(parts[1]);
      return (start + end) / 2;
    }
    return parseFloat(val) || 0;
  };

  const totalStudyHours = allLogs.reduce((acc, log) => acc + parseStudyHours(log.studyHours), 0);
  const avgAccuracy = testResults.length > 0 
    ? Math.round(testResults.reduce((acc, test) => acc + test.accuracy, 0) / testResults.length) 
    : 0;

  const modules = [
    {
      title: "Today's Log",
      description: "Record your daily consistency and emotions.",
      icon: ClipboardCheck,
      href: "/dashboard/log",
      color: "bg-blue-50 text-blue-600",
      badge: todayLog ? "COMPLETED" : "PENDING",
      badgeColor: todayLog ? "bg-green-600" : "bg-primary",
      completed: !!todayLog,
    },
    {
      title: "Productivity Score",
      description: "Challenge yourself with UPSC-level AI MCQs.",
      icon: Zap,
      href: "/dashboard/test",
      color: "bg-orange-50 text-orange-600",
      badge: "Daily Test",
      badgeColor: "bg-orange-600",
    },
    {
      title: "Performance Review",
      description: "Analyze your progress and weak areas.",
      icon: TrendingUp,
      href: "/dashboard/analytics",
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Medical Advisory",
      description: "Monitor your health and study wellness.",
      icon: HeartPulse,
      href: "/dashboard/medical",
      color: "bg-red-50 text-red-600",
    },
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold text-primary tracking-tight">UPSC Mentorship Program</h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Welcome back, <span className="text-primary">{session.user?.name}</span> • Target Year: 2027
          </p>
        </div>
        <div className="bg-accent/10 px-4 py-2 border border-accent/20 rounded-md flex items-center gap-2">
          <Award className="w-5 h-5 text-accent" />
          <span className="text-sm font-bold text-accent">Streak: {allLogs.length} Days</span>
        </div>
      </header>

      {/* Grid of Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {modules.map((mod) => (
          mod.completed ? (
            <div 
              key={mod.title} 
              className="group block bg-stone-50 border border-stone-200 p-8 relative overflow-hidden cursor-not-allowed opacity-80"
            >
              <div className={`p-3 inline-block rounded-lg mb-6 bg-green-50 text-green-600`}>
                <mod.icon className="w-8 h-8" />
              </div>
              <span className={`absolute top-8 right-8 text-[10px] uppercase font-bold tracking-widest text-white px-3 py-1 bg-green-600 shadow-lg`}>
                {mod.badge}
              </span>
              <h2 className="text-2xl font-serif font-bold text-stone-400 mb-2 flex items-center gap-2">
                {mod.title} <CheckCircle2 className="w-5 h-5 text-green-600" />
              </h2>
              <p className="text-stone-400 italic">You have fulfilled your commitment for today. Rest well.</p>
            </div>
          ) : (
            <Link 
              key={mod.title} 
              href={mod.href}
              className="group block bg-white border border-border p-8 hover:shadow-2xl transition-all relative overflow-hidden"
            >
              <div className={`p-3 inline-block rounded-lg mb-6 ${mod.color}`}>
                <mod.icon className="w-8 h-8" />
              </div>
              {mod.badge && (
                <span className={`absolute top-8 right-8 text-[10px] uppercase font-bold tracking-widest text-white px-2 py-1 ${mod.badgeColor}`}>
                  {mod.badge}
                </span>
              )}
              <h2 className="text-2xl font-serif font-bold text-primary mb-2 group-hover:translate-x-1 transition-transform flex items-center gap-2">
                {mod.title} 
                <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h2>
              <p className="text-muted-foreground">{mod.description}</p>
              
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-slate-50 rounded-full opacity-50 group-hover:scale-150 transition-transform" />
            </Link>
          )
        ))}
      </div>

      {/* Quick Summary Section */}
      <section className="bg-primary text-white p-10 shadow-xl overflow-hidden relative">
        <Target className="absolute -top-10 -right-10 w-64 h-64 text-white/5 opacity-20 rotate-12" />
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <p className="text-white/60 text-xs uppercase font-bold tracking-widest mb-1">Study Hours (Total)</p>
            <p className="text-3xl font-serif font-bold">{totalStudyHours.toFixed(1)}h</p>
          </div>
          <div>
            <p className="text-white/60 text-xs uppercase font-bold tracking-widest mb-1">Tests Attempted</p>
            <p className="text-3xl font-serif font-bold">{testResults.length}</p>
          </div>
          <div>
            <p className="text-white/60 text-xs uppercase font-bold tracking-widest mb-1">Avg Accuracy</p>
            <p className="text-3xl font-serif font-bold">{avgAccuracy}%</p>
          </div>
        </div>
      </section>

      {/* Mentor Directives Section */}
      {feedback[0] && (
        <section className="bg-white border border-stone-200 shadow-xl overflow-hidden mt-12">
          <div className="p-8 border-b border-stone-100 flex items-center gap-3 bg-stone-50/50">
            <div className="p-2 bg-primary/10 rounded-sm">
              <ClipboardCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-primary italic">Mentor Directives</h2>
              <p className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Recent Guidance & Feedback</p>
            </div>
          </div>
          <div className="divide-y divide-stone-100">
            {feedback.map((fb) => (
              <div key={fb.id} className="p-8 hover:bg-stone-50/50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-accent text-accent-foreground text-[8px] font-bold uppercase tracking-widest rounded-sm shadow-sm">
                      Official Directive
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-stone-400 font-mono">
                    {new Date(fb.createdAt).toLocaleDateString()} at {new Date(fb.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                <p className="text-stone-700 italic font-serif text-lg leading-relaxed whitespace-pre-wrap">
                  "{fb.content}"
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
