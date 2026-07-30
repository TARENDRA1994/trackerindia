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
    <div className="dashboard-theme min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-background/80 backdrop-blur-md border-b border-border text-foreground p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 bg-primary/20 text-primary rounded-lg flex items-center justify-center font-bold text-sm shadow-[0_0_15px_rgba(139,92,246,0.3)]">🇮🇳</div>
           <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight">Tracker India</h1>
           </div>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
      <aside className={`w-72 bg-background/95 backdrop-blur-xl border-r border-border text-foreground flex flex-col fixed h-full z-50 transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        <div className="p-8 hidden md:block">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold shadow-[0_0_20px_rgba(139,92,246,0.15)] ring-1 ring-primary/20">🇮🇳</div>
             <div>
                <h1 className="text-xl font-bold text-foreground tracking-tight">Tracker India</h1>
                <p className="text-xs text-muted-foreground font-medium">Ecosystem Control</p>
             </div>
          </div>
        </div>

        {/* Mobile Sidebar Header */}
        <div className="md:hidden p-6 flex justify-between items-center border-b border-border bg-background">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/20 text-primary rounded-lg flex items-center justify-center font-bold">🇮🇳</div>
              <h1 className="text-lg font-bold tracking-tight text-foreground">Menu</h1>
           </div>
           <button onClick={() => setIsMobileMenuOpen(false)}>
             <X className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
           </button>
        </div>

        <div className="px-6 py-4 mb-2 mt-4 md:mt-0">
           <div className="p-4 bg-muted/30 border border-border rounded-xl backdrop-blur-sm">
              <p className="text-xs font-medium text-muted-foreground mb-1">Signed in as</p>
              <p className="text-sm font-semibold truncate text-primary">{role}</p>
           </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all rounded-xl ${
                  isActive ? "bg-primary/10 text-primary shadow-[0_0_15px_rgba(139,92,246,0.1)] ring-1 ring-primary/20" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-border space-y-2 pb-safe">
          <Link 
            href="/dashboard/profile"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all rounded-xl border ${
               pathname === '/dashboard/profile' ? "bg-accent/10 text-accent border-accent/20" : "text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <User className="w-4 h-4" />
            My Identity
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: window.location.origin })}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-rose-500 bg-rose-500/5 hover:bg-rose-500/10 transition-all rounded-xl border border-rose-500/10"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 md:ml-72 min-h-screen bg-background relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="relative z-10 p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
