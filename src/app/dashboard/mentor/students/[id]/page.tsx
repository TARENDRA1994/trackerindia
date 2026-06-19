"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts";
import { 
  ChevronLeft, Calendar, Clock, Brain, 
  Target, AlertTriangle, CheckCircle2, TrendingUp,
  MessageSquare, History, PenTool, LayoutDashboard, Sparkles, X, Save, Loader2
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import AspirantPerformanceReport from "@/components/AspirantPerformanceReport";

export default function StudentReportPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showDirective, setShowDirective] = useState(false);
  const [directiveContent, setDirectiveContent] = useState("");
  const [sending, setSending] = useState(false);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch(`/api/mentor/students/${id}`);
        if (!res.ok) throw new Error("Student data profile unavailable for current authorization");
        const student = await res.json();
        setData({ user: student, logs: student.dailyLogs || [] });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const handleSendDirective = async () => {
    if (!directiveContent) return;
    setSending(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toId: id, content: directiveContent, type: "CRITIQUE" }),
      });
      if (res.ok) {
        setShowDirective(false);
        setDirectiveContent("");
        alert("Pedagogical Directive transmitted successfully.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#FDFCF8] flex items-center justify-center font-serif text-primary animate-pulse italic">Synthesizing Aspirant Academic Map...</div>;
  
  if (error || !data) return (
     <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 gap-6 p-10 text-center">
        <Target className="w-16 h-16 text-rose-200" />
        <h2 className="text-3xl font-serif font-bold text-primary italic">Record Inaccessible</h2>
        <p className="text-stone-400 max-w-sm italic">The specified student record could not be retrieved. Ensure the aspirant is assigned to your faculty profile.</p>
        <Link href="/dashboard/mentor" className="px-10 py-4 bg-primary text-white font-bold uppercase text-[10px] tracking-widest shadow-xl">Back to Dashboard</Link>
     </div>
  );

  const { user, logs } = data;

  const chartData = logs.slice().reverse().map((log: any) => ({
    date: new Date(log.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    hours: parseStudyHours(log.studyHours),
    retention: log.retentionScore,
    focus: log.focusLevel === "Deep focus" ? 100 : log.focusLevel === "High" ? 80 : 50
  }));

  return (
    <div className="min-h-screen bg-[#F9F8F4] pb-20">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 py-10 px-12 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
           <div className="space-y-4">
              <button onClick={() => router.back()} className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-300 flex items-center gap-2 hover:text-primary transition-colors">
                 <ChevronLeft className="w-4 h-4" /> Exit Report Map
              </button>
              <div className="flex items-center gap-6">
                 <div className="w-24 h-24 bg-stone-100 flex items-center justify-center font-serif text-4xl text-primary font-bold italic border border-stone-200 shadow-inner overflow-hidden">
                    {user.image ? <img src={user.image} className="w-full h-full object-cover" /> : user.name.charAt(0)}
                 </div>
                 <div className="space-y-2">
                    <h1 className="text-5xl font-serif font-bold italic text-primary">{user.name}</h1>
                    <div className="flex gap-6 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">
                       <span className="flex items-center gap-2"><Target className="w-4 h-4 text-accent" /> Target Year: {user.targetYear}</span>
                       <span className="flex items-center gap-2"><PenTool className="w-4 h-4 text-accent" /> {user.medium} Profile</span>
                    </div>
                 </div>
              </div>
           </div>
           
           <div className="flex gap-4 print:hidden">
               <button 
                  onClick={() => setShowReport(!showReport)}
                  className="flex items-center gap-3 px-10 py-5 bg-accent text-accent-foreground font-bold uppercase text-[10px] tracking-widest shadow-2xl shadow-accent/20 hover:-translate-y-1 transition-all"
               >
                  {showReport ? (
                    <>
                      <LayoutDashboard className="w-4 h-4" /> View Academic Map
                    </>
                  ) : (
                    <>
                      <History className="w-4 h-4" /> Performance Report (APR)
                    </>
                  )}
               </button>
               <button 
                  onClick={() => setShowDirective(true)}
                  className="flex items-center gap-3 px-10 py-5 bg-primary text-white font-bold uppercase text-[10px] tracking-widest shadow-2xl shadow-primary/20 hover:-translate-y-1 transition-all"
               >
                  <Sparkles className="w-4 h-4 text-accent" /> Direct Pedagogical Directive
               </button>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-12 mt-12 space-y-12">
         {showReport ? (
           <AspirantPerformanceReport studentId={id as string} />
         ) : (
           <>
             {/* KPI Matrix */}
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <KpiCard label="Academic Velocity" value={avg(chartData, "hours").toFixed(1)} unit="Hours/Day" icon={Clock} color="text-amber-600" />
            <KpiCard label="Retention Ratio" value={avg(chartData, "retention").toFixed(0)} unit="Percentage" icon={Brain} color="text-blue-600" />
            <KpiCard label="Submission Density" value={logs.length} unit="Total Logs" icon={History} color="text-emerald-600" />
            <KpiCard label="Focus Fidelity" value="Active" unit="Status" icon={TrendingUp} color="text-indigo-600" />
         </div>

         {/* Charts Group */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ChartBox title="Academic Load Analysis" subtitle="Study Hours Correlation" color="#8A6E3F">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8A6E3F" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8A6E3F" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 'bold'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 'bold'}} />
                  <Tooltip contentStyle={{ borderRadius: 0, border: '1px solid #e5e5e5' }} />
                  <Area type="monotone" dataKey="hours" stroke="#8A6E3F" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
                </AreaChart>
            </ChartBox>

            <ChartBox title="Cognitive Fidelity" subtitle="Retention Trend (0-100)" color="#2563eb">
                <AreaChart data={chartData}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                   <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 'bold'}} dy={10} />
                   <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 'bold'}} />
                   <Tooltip />
                   <Area type="monotone" dataKey="retention" stroke="#2563eb" strokeWidth={3} fillOpacity={0.1} fill="#3b82f6" />
                </AreaChart>
            </ChartBox>
         </div>

         {/* Log Archive Feed */}
         <div className="bg-white border border-stone-200 shadow-2xl overflow-hidden relative">
            <div className="p-10 border-b border-stone-100 flex items-center justify-between bg-stone-50/30">
               <h3 className="text-2xl font-serif font-bold text-primary italic">Deep Reflection Feed</h3>
               <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest italic">Aspirant Perspective Archives</div>
            </div>
            <div className="divide-y divide-stone-50">
               {logs.length > 0 ? logs.map((log: any) => (
                 <div key={log.id} className="p-12 hover:bg-stone-50/50 transition-all space-y-10 group">
                    <div className="flex justify-between items-start">
                       <div className="flex items-center gap-6">
                          <div className="p-4 bg-primary/5 rounded-sm border border-primary/10">
                             <Calendar className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                             <div className="text-2xl font-serif font-bold text-stone-800 italic">{new Date(log.timestamp).toLocaleDateString("en-IN", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                             <div className="text-[10px] font-bold text-stone-300 uppercase tracking-[0.2em] mt-1">Reflected at: {new Date(log.timestamp).toLocaleTimeString()}</div>
                          </div>
                       </div>
                       <div className="flex gap-4 opacity-70 group-hover:opacity-100 transition-opacity">
                          <LogMiniStat label="Retention Level" value={`${log.retentionScore}%`} icon={Brain} />
                          <LogMiniStat label="Focus Quality" value={log.focusLevel} icon={Target} />
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                       <div className="md:col-span-5 space-y-4">
                          <h4 className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary/40 border-l-4 border-accent pl-4">Daily Strategic Objective</h4>
                          <p className="text-lg font-serif italic text-stone-600 leading-relaxed">"{log.primaryGoal || "No goal specified for this period"}"</p>
                       </div>
                       <div className="md:col-span-4 space-y-4">
                          <h4 className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary/40 pl-4 border-l-4 border-stone-100">AI Component Diagnosis</h4>
                          <div className="p-4 bg-accent/5 italic text-accent text-xs font-medium border border-accent/10">
                             {log.aiAnalysis || "Diagnosis Pending..."}
                          </div>
                       </div>
                       <div className="md:col-span-3 space-y-4">
                          <h4 className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary/40 pl-4 border-l-4 border-rose-100">Lagging Indicators</h4>
                          <div className="text-xs font-bold text-rose-500 flex items-center gap-2">
                             <AlertTriangle className="w-4 h-4" /> {log.biggestDistraction || "None Declared"}
                          </div>
                       </div>
                    </div>

                    <div className="p-8 bg-stone-50/50 border border-stone-100 rounded-sm grid grid-cols-2 md:grid-cols-4 gap-8">
                       <QuickMetric label="Awakening" value={log.wakeUpTime} />
                       <QuickMetric label="Study Duration" value={log.studyHours} />
                       <QuickMetric label="Work Efficiency" value={log.workCompleted} />
                       <QuickMetric label="Understanding" value={log.understandingLevel} />
                    </div>
                 </div>
               )) : (
                  <div className="p-40 text-center flex flex-col items-center gap-6">
                     <History className="w-16 h-16 text-stone-100" />
                     <p className="text-[12px] font-bold tracking-[0.3em] text-stone-300 uppercase italic">No historical logs available for this aspirant profile</p>
                  </div>
               )}
            </div>
         </div>
         </>
        )}
      </div>

      {/* Directive Modal */}
      <AnimatePresence>
         {showDirective && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-primary/40 backdrop-blur-md z-50 flex items-center justify-center p-6">
               <motion.div initial={{scale:0.9, y:20}} animate={{scale:1, y:0}} exit={{scale:0.9, y:20}} className="bg-white w-full max-w-2xl shadow-3xl border border-stone-200">
                  <div className="p-10 border-b border-stone-50 flex justify-between items-center bg-stone-50/50">
                     <div>
                        <h3 className="text-2xl font-serif font-bold text-primary italic">Pedagogical Directive</h3>
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">Transmitting guidance to {user.name}</p>
                     </div>
                     <button onClick={() => setShowDirective(false)}><X className="w-6 h-6 text-stone-300 hover:text-stone-800" /></button>
                  </div>
                  <div className="p-10 space-y-6">
                     <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40">Instructions / Advice</label>
                        <textarea 
                           className="w-full p-6 bg-stone-50 border-b-2 border-stone-100 focus:border-primary outline-none transition-all italic text-lg font-serif min-h-[250px]"
                           placeholder="Enter your clinical advice or operational directives here..."
                           value={directiveContent}
                           onChange={(e) => setDirectiveContent(e.target.value)}
                        />
                     </div>
                     <div className="flex justify-end pt-4">
                        <button 
                           disabled={sending || !directiveContent}
                           onClick={handleSendDirective}
                           className="px-12 py-5 bg-primary text-white font-bold uppercase text-[10px] tracking-widest shadow-2xl flex items-center gap-3 disabled:opacity-50"
                        >
                           {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Transmit Directive</>}
                        </button>
                     </div>
                  </div>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}

function ChartBox({ title, subtitle, children }: any) {
   return (
      <div className="bg-white p-12 border border-stone-200 shadow-2xl space-y-10">
         <div className="flex items-center justify-between border-b border-stone-50 pb-6">
            <div>
               <h3 className="text-2xl font-serif font-bold italic text-primary">{title}</h3>
               <p className="text-[9px] font-bold text-stone-300 uppercase tracking-widest mt-1">{subtitle}</p>
            </div>
         </div>
         <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
               {children}
            </ResponsiveContainer>
         </div>
      </div>
   );
}

function KpiCard({ label, value, unit, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-10 border border-stone-200 shadow-xl space-y-6 group hover:border-primary transition-all">
       <div className="flex justify-between items-center">
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-stone-400">{label}</p>
          <div className="p-3 bg-stone-50 rounded-full group-hover:rotate-12 transition-transform">
             <Icon className={`w-5 h-5 ${color}`} />
          </div>
       </div>
       <div className="flex items-baseline gap-2">
          <span className="text-5xl font-serif font-bold text-primary italic">{value}</span>
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{unit}</span>
       </div>
    </div>
  );
}

function LogMiniStat({ label, value, icon: Icon }: any) {
  return (
    <div className="flex items-center gap-3 bg-white px-5 py-3 border border-stone-100 shadow-sm">
       <Icon className="w-4 h-4 text-accent" />
       <div>
          <p className="text-[8px] font-bold uppercase tracking-widest text-stone-400">{label}</p>
          <p className="text-xs font-bold text-stone-600">{value}</p>
       </div>
    </div>
  );
}

function QuickMetric({ label, value }: any) {
  return (
    <div className="space-y-2">
       <p className="text-[8px] font-bold uppercase tracking-widest text-stone-300">{label}</p>
       <p className="text-md font-serif font-bold text-primary italic">{value || "N/A"}</p>
    </div>
  );
}

const parseStudyHours = (val: string) => {
  if (!val) return 0;
  if (val === "12+") return 13;
  const parts = val.split(/[–-]/);
  if (parts.length > 1) return (parseFloat(parts[0]) + parseFloat(parts[1])) / 2;
  return parseFloat(val) || 0;
};

const avg = (arr: any[], key: string) => arr.length > 0 ? arr.reduce((acc, obj) => acc + obj[key], 0) / arr.length : 0;
