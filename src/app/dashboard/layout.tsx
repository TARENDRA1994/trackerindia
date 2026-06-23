"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, BookOpen, ClipboardCheck, HeartPulse, 
  LogOut, User, LayoutDashboard, Users,
  ShieldCheck, UserPlus, MessageSquare, TrendingUp, History,
  GraduationCap, Clock, Menu, X
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as any)?.role || "STUDENT";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = {
    STUDENT: [
      { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { name: "Today's Log", href: "/dashboard/log", icon: ClipboardCheck },
      { name: "Productivity Test", href: "/dashboard/test", icon: BookOpen },
      { name: "Performance Review", href: "/dashboard/analytics", icon: BarChart3 },
      { name: "Medical Advisory", href: "/dashboard/medical", icon: HeartPulse },
    ],
    MENTOR: [
      { name: "Performance Map", href: "/dashboard/mentor?v=2", icon: LayoutDashboard },
      { name: "Daily Activity Log", href: "/dashboard/mentor-log", icon: ClipboardCheck },
      { name: "Assigned Aspirants", href: "/dashboard/mentor?v=2", icon: Users },
      { name: "Course Review", href: "/dashboard/analytics", icon: BarChart3 },
      { name: "Comparison Lab", href: "/dashboard/mentor?v=2", icon: TrendingUp },
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
    <div className="min-h-screen bg-[#FDFCF8] flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-primary text-white p-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center font-bold text-sm">🇮🇳</div>
           <div>
              <h1 className="text-lg font-serif font-bold text-white tracking-widest uppercase italic">Tracker India</h1>
           </div>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 bg-white/10 rounded-sm">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-72 bg-primary text-white flex flex-col fixed h-full shadow-2xl z-50 transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        <div className="p-10 hidden md:block">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center font-bold">🇮🇳</div>
             <div>
                <h1 className="text-xl font-serif font-bold text-white tracking-widest uppercase italic">Tracker India</h1>
                <p className="text-[8px] text-white/30 tracking-[0.4em] uppercase">Ecosystem Control</p>
             </div>
          </div>
        </div>

        {/* Mobile Sidebar Header */}
        <div className="md:hidden p-6 flex justify-between items-center border-b border-white/10 bg-primary">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center font-bold">🇮🇳</div>
              <h1 className="text-lg font-serif font-bold italic tracking-widest uppercase text-white">Menu</h1>
           </div>
           <button onClick={() => setIsMobileMenuOpen(false)}>
             <X className="w-6 h-6 text-white/50 hover:text-white transition-colors" />
           </button>
        </div>

        <div className="px-6 py-4 mb-4 mt-4 md:mt-0">
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
                onClick={() => setIsMobileMenuOpen(false)}
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

        <div className="p-8 border-t border-white/5 space-y-3 pb-safe">
          <Link 
            href="/dashboard/profile"
            onClick={() => setIsMobileMenuOpen(false)}
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

      <main className="flex-1 md:ml-72 min-h-screen">
        {children}
      </main>
    </div>
  );
}
