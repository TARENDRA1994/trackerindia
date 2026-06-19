import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { 
  Users, UserCheck, UserX, UserPlus, 
  MapPin, GraduationCap, ChevronRight, 
  ShieldCheck, ArrowRight, LayoutDashboard,
  MessageSquare, UserRoundPlus
} from "lucide-react";
import Link from "next/link";
import WhatsAppBroadcastButton from "@/components/WhatsAppBroadcastButton";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  
  // Fetch Metrics
  const [pendingCount, studentCount, mentorCount, holdCount] = await Promise.all([
    prisma.user.count({ where: { status: "PENDING" } }),
    prisma.user.count({ where: { role: "STUDENT", status: "APPROVED" } }),
    prisma.user.count({ where: { role: "MENTOR", status: "APPROVED" } }),
    prisma.user.count({ where: { status: "HOLD" } }),
  ]);

  const recentRegistrations = await prisma.user.findMany({
    where: { status: "PENDING" },
    take: 5,
    orderBy: { createdAt: "desc" }
  });

  const stats = [
    { label: "New Admissions", value: pendingCount, icon: UserPlus, color: "text-amber-600", bg: "bg-amber-50", href: "/dashboard/admin/registrations?status=PENDING" },
    { label: "Active Aspirants", value: studentCount, icon: GraduationCap, color: "text-blue-600", bg: "bg-blue-50", href: "/dashboard/admin/registrations?status=APPROVED&role=STUDENT" },
    { label: "Faculty (Mentors)", value: mentorCount, icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50", href: "/dashboard/admin/registrations?status=APPROVED&role=MENTOR" },
    { label: "On-Hold Cases", value: holdCount, icon: UserX, color: "text-rose-600", bg: "bg-rose-50", href: "/dashboard/admin/registrations?status=HOLD" },
  ];

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Admin Header */}
      <div className="bg-primary text-white pt-10 pb-20 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white/60 text-xs font-bold uppercase tracking-widest">
              <LayoutDashboard className="w-4 h-4" /> Administrative Command Center
            </div>
            <h1 className="text-4xl font-serif font-bold italic text-white">System Overview</h1>
            <p className="text-white/70 font-medium">Monitoring the UPSC Tracker India ecosystem.</p>
          </div>
          <div className="flex gap-4">
             <Link href="/dashboard/admin/registrations" className="bg-accent text-accent-foreground px-6 py-3 font-bold uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-2 hover:scale-105 transition-all">
                Review New Users <UserRoundPlus className="w-4 h-4" />
             </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 -mt-10">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <Link key={s.label} href={s.href} className="bg-white p-8 border border-stone-200 shadow-xl flex items-center justify-between group hover:border-primary/30 transition-all cursor-pointer">
              <div className="space-y-1">
                <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest">{s.label}</p>
                <p className="text-4xl font-serif font-bold text-primary">{s.value}</p>
              </div>
              <div className={`p-4 ${s.bg} rounded-full group-hover:scale-110 transition-transform`}>
                <s.icon className={`w-8 h-8 ${s.color}`} />
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* Incoming Registrations */}
          <div className="lg:col-span-2 bg-white border border-stone-200 shadow-xl overflow-hidden">
            <div className="p-8 border-b border-stone-100 flex items-center justify-between">
              <h2 className="text-xl font-serif font-bold text-primary">Awaiting Approval</h2>
              <Link href="/dashboard/admin/registrations" className="text-xs font-bold uppercase tracking-widest text-accent flex items-center gap-1 hover:underline">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="divide-y divide-stone-100">
              {recentRegistrations.length > 0 ? recentRegistrations.map((user) => (
                <div key={user.id} className="p-6 flex items-center justify-between hover:bg-stone-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/5 flex items-center justify-center font-serif font-bold text-primary border border-primary/10">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-stone-800">{user.name}</h3>
                      <div className="flex items-center gap-3 text-xs text-stone-400 font-medium">
                        <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3" /> {user.targetYear}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {user.city}, {user.state}</span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/dashboard/admin/users/${user.id}`} className="p-2 hover:bg-white border border-transparent hover:border-stone-200 rounded transition-all">
                    <ArrowRight className="w-5 h-5 text-stone-300" />
                  </Link>
                </div>
              )) : (
                <div className="p-20 text-center space-y-4">
                   <UserCheck className="w-12 h-12 text-stone-200 mx-auto" />
                   <p className="text-stone-400 font-bold uppercase text-[10px] tracking-widest">No pending applications</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-primary p-8 text-white space-y-6 shadow-2xl relative overflow-hidden">
              <ShieldCheck className="absolute -bottom-10 -right-10 w-40 h-40 text-white/10" />
              <h3 className="text-xl font-serif font-bold italic relative z-10">Quick Actions</h3>
              <div className="space-y-3 relative z-10">
                <WhatsAppBroadcastButton />
                <Link href="/dashboard/admin/whatsapp-logs" className="w-full py-4 bg-white/10 border border-white/20 hover:bg-white/20 text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                  <MessageSquare className="w-4 h-4" /> View WA Logs
                </Link>
                <Link href="/dashboard/admin/assign" className="w-full py-4 bg-accent text-accent-foreground hover:shadow-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                  <Users className="w-4 h-4" /> Assign Mentors
                </Link>
              </div>
            </div>
            <div className="bg-white border border-stone-200 p-8 shadow-xl space-y-6">
              <h3 className="text-lg font-serif font-bold text-primary">Program Health</h3>
              <div className="space-y-4">
                <HealthItem label="Daily Log Consistency" value="92%" color="bg-emerald-500" />
                <HealthItem label="Mentor Engagement" value="78%" color="bg-blue-500" />
                <HealthItem label="Retention Average" value="65%" color="bg-amber-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HealthItem({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-stone-400">
        <span>{label}</span>
        <span className="text-stone-800">{value}</span>
      </div>
      <div className="h-1.5 w-full bg-stone-100">
        <div className={`h-full ${color}`} style={{ width: value }}></div>
      </div>
    </div>
  );
}
