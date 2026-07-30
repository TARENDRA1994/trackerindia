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
      color: "bg-blue-500/10 text-blue-500",
      badge: todayLog ? "COMPLETED" : "PENDING",
      badgeColor: todayLog ? "bg-emerald-500/20 text-emerald-500 ring-1 ring-emerald-500/30" : "bg-primary/20 text-primary ring-1 ring-primary/30",
      completed: !!todayLog,
    },
    {
      title: "Productivity Score",
      description: "Challenge yourself with UPSC-level AI MCQs.",
      icon: Zap,
      href: "/dashboard/test",
      color: "bg-orange-500/10 text-orange-500",
      badge: "Daily Test",
      badgeColor: "bg-orange-500/20 text-orange-500 ring-1 ring-orange-500/30",
    },
    {
      title: "Performance Review",
      description: "Analyze your progress and weak areas.",
      icon: TrendingUp,
      href: "/dashboard/analytics",
      color: "bg-emerald-500/10 text-emerald-500",
    },
    {
      title: "Medical Advisory",
      description: "Monitor your health and study wellness.",
      icon: HeartPulse,
      href: "/dashboard/medical",
      color: "bg-rose-500/10 text-rose-500",
    },
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight">UPSC Mentorship Program</h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Welcome back, <span className="text-foreground">{session.user?.name}</span> • Target Year: 2027
          </p>
        </div>
        <div className="bg-accent/10 px-4 py-2 border border-accent/20 rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
          <Award className="w-5 h-5 text-accent" />
          <span className="text-sm font-bold text-accent">Streak: {allLogs.length} Days</span>
        </div>
      </header>

      {/* Grid of Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((mod) => (
          mod.completed ? (
            <div 
              key={mod.title} 
              className="group block bg-muted/20 border border-border p-8 rounded-2xl relative overflow-hidden cursor-not-allowed opacity-80 backdrop-blur-sm"
            >
              <div className={`p-3 inline-block rounded-xl mb-6 bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20`}>
                <mod.icon className="w-8 h-8" />
              </div>
              <span className={`absolute top-8 right-8 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full ${mod.badgeColor}`}>
                {mod.badge}
              </span>
              <h2 className="text-2xl font-bold text-muted-foreground mb-2 flex items-center gap-2 tracking-tight">
                {mod.title} <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </h2>
              <p className="text-muted-foreground/60 font-medium">You have fulfilled your commitment for today. Rest well.</p>
            </div>
          ) : (
            <Link 
              key={mod.title} 
              href={mod.href}
              className="group block bg-muted/30 border border-border p-8 rounded-2xl hover:bg-muted/50 transition-all relative overflow-hidden backdrop-blur-sm hover:border-primary/30 hover:shadow-[0_0_30px_rgba(139,92,246,0.05)]"
            >
              <div className={`p-3 inline-block rounded-xl mb-6 ${mod.color} ring-1 ring-current/20`}>
                <mod.icon className="w-8 h-8" />
              </div>
              {mod.badge && (
                <span className={`absolute top-8 right-8 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full ${mod.badgeColor}`}>
                  {mod.badge}
                </span>
              )}
              <h2 className="text-2xl font-bold text-foreground mb-2 group-hover:translate-x-1 transition-transform flex items-center gap-2 tracking-tight">
                {mod.title} 
                <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </h2>
              <p className="text-muted-foreground font-medium">{mod.description}</p>
              
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all blur-2xl" />
            </Link>
          )
        ))}
      </div>

      {/* Quick Summary Section */}
      <section className="bg-muted/30 border border-border rounded-3xl p-10 shadow-lg overflow-hidden relative backdrop-blur-sm">
        <Target className="absolute -top-10 -right-10 w-64 h-64 text-primary/5 opacity-50 rotate-12 blur-xl" />
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="bg-background/50 p-6 rounded-2xl border border-border/50">
            <p className="text-muted-foreground text-xs uppercase font-bold tracking-widest mb-2">Study Hours (Total)</p>
            <p className="text-4xl font-black text-foreground tracking-tighter">{totalStudyHours.toFixed(1)}h</p>
          </div>
          <div className="bg-background/50 p-6 rounded-2xl border border-border/50">
            <p className="text-muted-foreground text-xs uppercase font-bold tracking-widest mb-2">Tests Attempted</p>
            <p className="text-4xl font-black text-foreground tracking-tighter">{testResults.length}</p>
          </div>
          <div className="bg-background/50 p-6 rounded-2xl border border-border/50">
            <p className="text-muted-foreground text-xs uppercase font-bold tracking-widest mb-2">Avg Accuracy</p>
            <p className="text-4xl font-black text-foreground tracking-tighter">{avgAccuracy}%</p>
          </div>
        </div>
      </section>

      {/* Mentor Directives Section */}
      {feedback[0] && (
        <section className="bg-muted/20 border border-border rounded-3xl shadow-lg overflow-hidden mt-12 backdrop-blur-sm">
          <div className="p-8 border-b border-border flex items-center gap-4 bg-background/50">
            <div className="p-3 bg-primary/10 rounded-xl ring-1 ring-primary/20">
              <ClipboardCheck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground tracking-tight">Mentor Directives</h2>
              <p className="text-xs font-medium text-muted-foreground mt-1">Recent Guidance & Feedback</p>
            </div>
          </div>
          <div className="divide-y divide-border">
            {feedback.map((fb) => (
              <div key={fb.id} className="p-8 hover:bg-muted/30 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-accent/10 text-accent ring-1 ring-accent/20 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm">
                      Official Directive
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-muted-foreground bg-background/80 px-2 py-1 rounded-md border border-border/50">
                    {new Date(fb.createdAt).toLocaleDateString()} at {new Date(fb.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                <p className="text-foreground/90 font-medium text-lg leading-relaxed whitespace-pre-wrap">
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
