import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Users, GraduationCap, ArrowRight, Award, BookOpen, Clock } from "lucide-react";

export default function HomePage() {
  const portalCards = [
    {
      title: "Student Portal",
      description: "Log your daily progress, analyze Weak Areas, and connect with your assigned Mentor.",
      icon: GraduationCap,
      href: "/login",
      color: "bg-blue-50 text-blue-700 border-blue-100",
      cta: "Aspirant Login",
      role: "STUDENT"
    },
    {
      title: "Mentor Dashboard",
      description: "Guide your assigned aspirants, review detailed retention reports, and provide growth feedback.",
      icon: Users,
      href: "/login?role=MENTOR",
      color: "bg-orange-50 text-orange-700 border-orange-100",
      cta: "Mentor Login",
      role: "MENTOR"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#1A1A1A]">
      {/* Hero Section */}
      <nav className="border-b border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center">
            <Image src="/logo.png" alt="UPSC Mentorship Logo" width={180} height={50} priority />
          </div>
          <div className="hidden md:flex gap-8 text-sm font-bold uppercase tracking-widest text-muted-foreground">
            <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
            <Link href="#portals" className="hover:text-primary transition-colors">Portals</Link>
            <Link href="/register" className="text-primary border-b-2 border-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Abstract Indian Governance Motif Hero */}
        <section className="relative pt-20 pb-32 px-6 overflow-hidden border-b border-stone-200">
           <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
              <BookOpen className="w-[800px] h-[800px] -rotate-12 absolute -top-40 -right-40" />
           </div>
           
           <div className="max-w-5xl mx-auto text-center space-y-10 relative z-10">
              <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 px-4 py-2 rounded-full text-primary text-xs font-bold uppercase tracking-widest">
                <Clock className="w-4 h-4" /> Consistency is the Hallmark of a Civil Servant
              </div>
              <div className="flex justify-center mb-4">
                <Image src="/logo.png" alt="UPSC Mentorship Logo" width={220} height={60} priority />
              </div>
              <h1 className="text-6xl md:text-8xl font-serif font-bold tracking-tighter text-primary leading-tight">
                UPSC Mentorship <br /> <span className="italic text-accent">Ecosystem</span>
              </h1>
              <p className="max-w-2xl mx-auto text-xl text-stone-600 leading-relaxed font-medium">
                The most advanced tracking engine for India's premier exam. Powered by human intuition and data-driven insights.
              </p>
              <div className="flex flex-col md:flex-row justify-center gap-4 pt-6">
                <Link href="/register" className="px-10 py-5 bg-primary text-white font-bold uppercase tracking-widest rounded-sm hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group">
                  New Student Registration <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="#portals" className="px-10 py-5 bg-white border-2 border-primary text-primary font-bold uppercase tracking-widest rounded-sm hover:bg-stone-50 transition-all flex items-center justify-center">
                  Login to Portal
                </Link>
              </div>
           </div>
        </section>

        {/* Portal Selection */}
        <section id="portals" className="py-32 px-6 bg-white">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-serif font-bold text-primary">Unified Control Center</h2>
              <p className="text-stone-500 uppercase font-bold tracking-widest text-xs">Select your gateway to the mentorship program</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {portalCards.map((portal) => (
                <div key={portal.title} className={`group p-10 border-2 ${portal.color} flex flex-col justify-between transition-all hover:shadow-3xl hover:-translate-y-2 relative overflow-hidden`}>
                  <div className="relative z-10 space-y-8">
                    <div className="p-4 inline-block bg-white rounded-lg shadow-sm">
                      <portal.icon className="w-10 h-10" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-serif font-bold mb-4">{portal.title}</h3>
                      <p className="text-stone-600 leading-relaxed font-medium">{portal.description}</p>
                    </div>
                    <Link href={portal.href} className="inline-flex items-center gap-2 font-bold uppercase tracking-widest text-xs border-b-2 border-current pb-1 group-hover:gap-4 transition-all">
                      {portal.cta} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                  {/* Decorative faint background icon */}
                  <portal.icon className="absolute -bottom-10 -right-10 w-40 h-40 opacity-5 group-hover:scale-110 transition-transform" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-primary text-white pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 border-b border-white/10 pb-20">
          <div className="space-y-6">
            <h4 className="text-2xl font-serif font-bold">UPSC Tracker India</h4>
            <p className="text-white/60 leading-relaxed">
              Empowering the next generation of civil servants through scientific tracking and humane mentorship.
            </p>
          </div>
          <div>
            <h5 className="font-bold uppercase tracking-widest text-xs mb-8 text-white/40">For Students</h5>
            <div className="flex flex-col gap-4 text-sm font-bold">
              <Link href="/login" className="hover:text-accent transition-colors">Daily Log</Link>
              <Link href="/login" className="hover:text-accent transition-colors">Test Portal</Link>
              <Link href="/register" className="hover:text-accent transition-colors">Register New</Link>
            </div>
          </div>
          <div>
             <h5 className="font-bold uppercase tracking-widest text-xs mb-8 text-white/40">For Partners</h5>
             <div className="flex flex-col gap-4 text-sm font-bold">
                <Link href="/login?role=MENTOR" className="hover:text-accent transition-colors text-accent">Join as Mentor</Link>
             </div>
          </div>
          <div className="space-y-6">
             <h5 className="font-bold uppercase tracking-widest text-xs mb-8 text-white/40">Connect</h5>
             <p className="text-sm text-white/60">Any technical issues? Contact the program admin.</p>
             <Link href="https://wa.me/919999999999" className="bg-white text-primary px-6 py-3 font-bold uppercase tracking-widest text-xs inline-block text-center rounded-sm hover:invert transition-all">
                WhatsApp Support
             </Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-10 text-center">
            <p className="text-xs font-bold text-white/30 uppercase tracking-widest">© 2026 UPSC Tracker India • Built for Government Exam Aspirants</p>
        </div>
      </footer>
    </div>
  );
}
