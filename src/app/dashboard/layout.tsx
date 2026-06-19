"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, BookOpen, ClipboardCheck, HeartPulse, 
  LogOut, User, LayoutDashboard, Users,
  ShieldCheck, UserPlus, MessageSquare, TrendingUp, History,
  GraduationCap, Clock
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as any)?.role || "STUDENT";

  const navItems = {
    STUDENT: [
      { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { name: "Today's Log", href: "/dashboard/log", icon: ClipboardCheck },
      { name: "Productivity Test", href: "/dashboard/test", icon: BookOpen },
      { name: "Performance Review", href: "/dashboard/analytics", icon: BarChart3 },
      { name: "Medical Advisory", href: "/dashboard/medical", icon: HeartPulse },
    ],
    MENTOR: [
      { name: "Performance Map", href: "/dashboard/mentor", icon: LayoutDashboard },
      { name: "Daily Activity Log", href: "/dashboard/mentor-log", icon: ClipboardCheck },
      { name: "Assigned Aspirants", href: "/dashboard/mentor", icon: Users },
      { name: "Course Review", href: "/dashboard/analytics", icon: BarChart3 },
      { name: "Comparison Lab", href: "/dashboard/mentor", icon: TrendingUp },
    ],
    ADMIN: [
      { name: "Command Center", href: "/dashboard/admin", icon: ShieldCheck },
      { name: "Onboard New Faculty", href: "/dashboard/admin/faculty/new", icon: UserPlus },
      { name: "Review Queue", href: "/dashboard/admin/registrations", icon: Clock },
      { name: "Faculty Management", href: "/dashboard/admin/assign", icon: GraduationCap },
      { name: "Aspirant Management", href: "/dashboard/admin/registrations", icon: Users },
      { name: "Broadcast Room", href: "/dashboard/admin/broadcast", icon: MessageSquare },
    ],
  };

  const navigation = navItems[role as keyof typeof navItems] || [];

  return (
    <div className="min-h-screen bg-[#FDFCF8] flex">
      <aside className="w-72 bg-primary text-white flex flex-col fixed h-full shadow-2xl z-50">
        <div className="p-10">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center font-bold">🇮🇳</div>
             <div>
                <h1 className="text-xl font-serif font-bold text-white tracking-widest uppercase italic">Tracker India</h1>
                <p className="text-[8px] text-white/30 tracking-[0.4em] uppercase">Ecosystem Control</p>
             </div>
          </div>
        </div>

        <div className="px-6 py-4 mb-4">
           <div className="p-4 bg-white/5 border border-white/10 rounded-sm">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Signed in as</p>
              <p className="text-sm font-bold truncate text-accent italic">{role}</p>
           </div>
        </div>

        <nav className="flex-1 px-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-4 px-5 py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all rounded-sm ${
                  isActive ? "bg-white text-primary shadow-xl translate-x-2" : "text-white/50 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? "text-primary" : "text-white/30"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-8 border-t border-white/5 space-y-3">
          <Link 
            href="/dashboard/profile"
            className={`w-full flex items-center gap-4 px-5 py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all border border-white/5 rounded-sm ${
               pathname === '/dashboard/profile' ? "bg-accent text-white" : "text-white/40 hover:text-white hover:bg-white/5"
            }`}
          >
            <User className="w-4 h-4" />
            My Identity
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-4 px-5 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-rose-300 bg-rose-500/5 hover:bg-rose-500/20 transition-all border border-rose-500/10"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-72 min-h-screen">
        {children}
      </main>
    </div>
  );
}
