"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Users, ShieldCheck, Clock, Search, 
  ArrowLeft, AlertTriangle, CheckCircle2, 
  TrendingUp, Calendar, ChevronDown, ChevronUp, UserCheck,
  Trophy, BarChart3, Filter
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminMentorLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dashboard Controls
  const [selectedMentorId, setSelectedMentorId] = useState<string>("ALL");
  const [dateRange, setDateRange] = useState<string>("7"); // 7, 30, ALL
  
  // Archive Controls
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/mentor-logs");
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (err) {
      console.error("Failed to fetch mentor logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  // 1. Base derived data
  const uniqueMentors = useMemo(() => {
    const map = new Map<string, { id: string, name: string }>();
    logs.forEach(log => {
      if (log.mentor?.id) {
        map.set(log.mentor.id, { id: log.mentor.id, name: log.mentor.name });
      }
    });
    return Array.from(map.values());
  }, [logs]);

  // 2. Filter logs by Date
  const dateFilteredLogs = useMemo(() => {
    if (dateRange === "ALL") return logs;
    const days = parseInt(dateRange);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return logs.filter(l => new Date(l.timestamp) >= cutoff);
  }, [logs, dateRange]);

  // 3. Leaderboard Calculation (Arena View)
  const leaderboard = useMemo(() => {
    const stats: Record<string, { name: string, totalHours: number, totalProductivity: number, count: number }> = {};
    dateFilteredLogs.forEach(log => {
      if (!log.mentor?.id) return;
      const mId = log.mentor.id;
      if (!stats[mId]) {
        stats[mId] = { name: log.mentor.name || "Unknown", totalHours: 0, totalProductivity: 0, count: 0 };
      }
      stats[mId].totalHours += (log.workHours || 0);
      stats[mId].totalProductivity += (log.dailyProductivity || 0);
      stats[mId].count += 1;
    });

    return Object.values(stats).map(s => ({
      ...s,
      avgProductivity: s.count > 0 ? (s.totalProductivity / s.count) : 0
    })).sort((a, b) => b.avgProductivity - a.avgProductivity);
  }, [dateFilteredLogs]);

  // 4. Mentor Specific Deep Dive Logs
  const mentorDeepDiveLogs = useMemo(() => {
    if (selectedMentorId === "ALL") return [];
    return dateFilteredLogs.filter(l => l.mentor?.id === selectedMentorId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [dateFilteredLogs, selectedMentorId]);

  // 5. Raw Archive Logs (Applies search term)
  const searchFilteredArchiveLogs = useMemo(() => {
    let base = selectedMentorId === "ALL" ? dateFilteredLogs : mentorDeepDiveLogs;
    if (!searchTerm) return base;
    const term = searchTerm.toLowerCase();
    return base.filter(log => {
      return (log.mentor?.name?.toLowerCase().includes(term) ||
              log.mentor?.email?.toLowerCase().includes(term) ||
              log.additionalTasks?.toLowerCase().includes(term) ||
              log.batchOverview?.toLowerCase().includes(term));
    });
  }, [dateFilteredLogs, mentorDeepDiveLogs, searchTerm, selectedMentorId]);


  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Header */}
      <div className="bg-primary text-white pt-10 pb-20 px-8 relative overflow-hidden">
        <Trophy className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <Link href="/dashboard/admin" className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 flex items-center gap-2 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" /> Admin Dashboard
            </Link>
            <h1 className="text-4xl font-serif font-bold italic text-white flex items-center gap-3">
              Faculty Command Center
            </h1>
            <p className="text-white/70 font-medium">Compare mentor performance, track consistency, and analyze daily output.</p>
          </div>

          {/* Global Controls */}
          <div className="flex flex-col sm:flex-row gap-4 bg-white/10 p-4 rounded backdrop-blur-sm border border-white/20">
             <div className="space-y-1">
               <label className="text-[9px] font-bold uppercase tracking-widest text-white/60 flex items-center gap-1"><UserCheck className="w-3 h-3" /> Select Faculty</label>
               <select 
                 value={selectedMentorId} 
                 onChange={e => setSelectedMentorId(e.target.value)}
                 className="bg-primary text-white border border-white/30 px-3 py-2 text-sm outline-none w-full sm:w-48 font-semibold"
               >
                 <option value="ALL">All Mentors (The Arena)</option>
                 {uniqueMentors.map(m => (
                   <option key={m.id} value={m.id}>{m.name}</option>
                 ))}
               </select>
             </div>
             <div className="space-y-1">
               <label className="text-[9px] font-bold uppercase tracking-widest text-white/60 flex items-center gap-1"><Filter className="w-3 h-3" /> Time Range</label>
               <select 
                 value={dateRange} 
                 onChange={e => setDateRange(e.target.value)}
                 className="bg-primary text-white border border-white/30 px-3 py-2 text-sm outline-none w-full sm:w-32 font-semibold"
               >
                 <option value="7">Last 7 Days</option>
                 <option value="30">Last 30 Days</option>
                 <option value="ALL">All Time</option>
               </select>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 -mt-10 space-y-10">
        
        {/* VIEW 1: THE ARENA (All Mentors Comparison) */}
        {selectedMentorId === "ALL" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold italic text-primary flex items-center gap-2">
              <Trophy className="w-6 h-6 text-accent" /> The Arena Leaderboard
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Productivity Leaderboard */}
              <div className="bg-white p-8 border border-stone-200 shadow-xl">
                 <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-6 flex items-center gap-2">
                   <TrendingUp className="w-4 h-4 text-emerald-500" /> Avg Productivity Ranking
                 </h3>
                 <div className="space-y-6">
                   {leaderboard.length > 0 ? leaderboard.map((mentor, index) => (
                     <div key={mentor.name} className="space-y-2">
                       <div className="flex justify-between items-center text-sm font-bold text-stone-800">
                         <span className="flex items-center gap-2">
                           <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] ${index === 0 ? "bg-accent text-accent-foreground" : "bg-stone-100 text-stone-400"}`}>{index + 1}</span>
                           {mentor.name}
                         </span>
                         <span>{mentor.avgProductivity.toFixed(1)} / 10</span>
                       </div>
                       <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }} 
                           animate={{ width: `${(mentor.avgProductivity / 10) * 100}%` }} 
                           transition={{ duration: 1, ease: "easeOut" }}
                           className={`h-full ${index === 0 ? "bg-emerald-500" : "bg-primary/40"}`}
                         />
                       </div>
                     </div>
                   )) : (
                     <p className="text-xs text-stone-400 font-bold uppercase tracking-widest text-center py-10">No data for this period</p>
                   )}
                 </div>
              </div>

              {/* Work Hours Leaderboard */}
              <div className="bg-white p-8 border border-stone-200 shadow-xl">
                 <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-6 flex items-center gap-2">
                   <Clock className="w-4 h-4 text-blue-500" /> Total Work Hours Output
                 </h3>
                 <div className="space-y-6">
                   {[...leaderboard].sort((a,b) => b.totalHours - a.totalHours).map((mentor, index) => {
                     const maxHours = Math.max(...leaderboard.map(l => l.totalHours), 1);
                     return (
                     <div key={mentor.name} className="space-y-2">
                       <div className="flex justify-between items-center text-sm font-bold text-stone-800">
                         <span className="flex items-center gap-2">
                           <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] ${index === 0 ? "bg-blue-600 text-white" : "bg-stone-100 text-stone-400"}`}>{index + 1}</span>
                           {mentor.name}
                         </span>
                         <span>{mentor.totalHours} hrs <span className="text-[10px] text-stone-400">({mentor.count} logs)</span></span>
                       </div>
                       <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }} 
                           animate={{ width: `${(mentor.totalHours / maxHours) * 100}%` }} 
                           transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                           className={`h-full ${index === 0 ? "bg-blue-500" : "bg-blue-200"}`}
                         />
                       </div>
                     </div>
                   )})}
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: MENTOR DEEP DIVE (Specific Mentor Selected) */}
        {selectedMentorId !== "ALL" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold italic text-primary flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-accent" /> Faculty Deep Dive
            </h2>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(() => {
                 const mStats = leaderboard.find(l => dateFilteredLogs.find(d => d.mentor?.id === selectedMentorId && d.mentor?.name === l.name));
                 return (
                   <>
                    <div className="bg-white p-6 border shadow-lg flex justify-between items-center">
                      <div><p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Logs Submitted</p><p className="text-3xl font-serif font-bold">{mStats?.count || 0}</p></div>
                      <Calendar className="w-8 h-8 text-stone-200" />
                    </div>
                    <div className="bg-white p-6 border shadow-lg flex justify-between items-center">
                      <div><p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Avg Productivity</p><p className="text-3xl font-serif font-bold text-emerald-600">{mStats?.avgProductivity.toFixed(1) || 0}</p></div>
                      <TrendingUp className="w-8 h-8 text-emerald-100" />
                    </div>
                    <div className="bg-white p-6 border shadow-lg flex justify-between items-center">
                      <div><p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Total Hours</p><p className="text-3xl font-serif font-bold text-blue-600">{mStats?.totalHours || 0}</p></div>
                      <Clock className="w-8 h-8 text-blue-100" />
                    </div>
                   </>
                 )
              })()}
            </div>

            {/* Daily Timeline */}
            <div className="bg-white border border-stone-200 shadow-xl p-8">
               <h3 className="text-sm font-bold uppercase tracking-widest text-stone-800 mb-6">Daily Operational Timeline</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                 {mentorDeepDiveLogs.length > 0 ? mentorDeepDiveLogs.map(log => (
                   <div key={log.id} className={`p-4 border ${log.hasIssue ? 'border-rose-300 bg-rose-50' : 'border-stone-100 bg-stone-50/50 hover:border-primary/30'} transition-colors relative`}>
                     {log.hasIssue && <AlertTriangle className="absolute top-2 right-2 w-4 h-4 text-rose-500" />}
                     <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">{new Date(log.timestamp).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric'})}</p>
                     <div className="flex justify-between items-end">
                       <div>
                         <p className="text-[10px] text-stone-500 font-semibold uppercase">Hours</p>
                         <p className="text-lg font-bold text-primary">{log.workHours}h</p>
                       </div>
                       <div className="text-right">
                         <p className="text-[10px] text-stone-500 font-semibold uppercase">Output</p>
                         <p className={`text-lg font-bold ${log.dailyProductivity >= 7 ? "text-emerald-600" : "text-amber-600"}`}>{log.dailyProductivity}/10</p>
                       </div>
                     </div>
                     <div className="mt-4 pt-3 border-t border-stone-200/50 text-xs text-stone-600 line-clamp-2 italic">
                       {log.batchSessionDone ? `Batch: ${log.batchOverview}` : log.additionalTasks || "Routine 1:1s completed"}
                     </div>
                   </div>
                 )) : (
                   <p className="col-span-full py-10 text-center text-xs font-bold text-stone-400 uppercase">No daily logs found for this period.</p>
                 )}
               </div>
            </div>
          </div>
        )}

        {/* RAW ARCHIVE (Always visible, filtered by global state) */}
        <div className="bg-white border border-stone-200 shadow-xl overflow-hidden mt-12">
          <div className="p-8 border-b border-stone-100 flex flex-col md:flex-row md:items-center justify-between bg-stone-50/50 gap-4">
            <div>
              <h2 className="text-xl font-serif font-bold text-primary">Raw Operational Archive</h2>
              <div className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mt-1">Detailed Log Inspector</div>
            </div>
            
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
              <input 
                 className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200 outline-none focus:border-primary transition-all text-xs font-semibold placeholder:text-stone-400"
                 placeholder="Search details..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="divide-y divide-stone-100">
            {loading ? (
              <div className="p-20 text-center text-stone-400 font-bold uppercase tracking-widest text-xs">
                Analyzing Faculty Logs...
              </div>
            ) : searchFilteredArchiveLogs.length > 0 ? searchFilteredArchiveLogs.map((log) => {
              const isExpanded = expandedLogId === log.id;
              const parseJSON = (str: string) => { try { return str ? JSON.parse(str) : []; } catch (e) { return []; } };
              const sessionDetails = parseJSON(log.sessionDetails);
              const topStudents = parseJSON(log.topStudents);

              return (
                <div key={log.id} className={`transition-all hover:bg-stone-50/50 ${log.hasIssue ? "border-l-4 border-rose-500" : ""}`}>
                  <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer" onClick={() => toggleExpand(log.id)}>
                    <div className="flex gap-4 items-center">
                      <div className="w-10 h-10 bg-primary/5 flex items-center justify-center font-serif font-bold text-primary border border-primary/10">
                        {log.mentor?.name?.charAt(0) || "M"}
                      </div>
                      <div>
                        <h3 className="font-bold text-stone-800 text-sm">{log.mentor?.name || "Unknown"}</h3>
                        <p className="text-[10px] text-stone-400 font-medium flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(log.timestamp).toLocaleDateString()}</span>
                          {log.hasIssue && <span className="text-rose-500 flex items-center gap-1 font-bold"><AlertTriangle className="w-3 h-3"/> Flagged</span>}
                        </p>
                      </div>
                    </div>
                    <button className="p-2 text-stone-400 hover:text-primary transition-colors">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: "auto", opacity: 1 }} 
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-stone-50/30 border-t border-stone-100 p-8 space-y-6 overflow-hidden text-sm"
                      >
                         {/* Expanded Content (Same as before) */}
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                           <div className="space-y-6">
                              {/* 1:1 Sessions Section */}
                              <div>
                                <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary/60 border-l-4 border-accent pl-3 mb-3">1:1 Mentorship Sessions</h4>
                                {log.oneOnOneDone ? (
                                  <div className="space-y-3">
                                    <p className="text-xs text-stone-400">Total sessions: <strong className="text-stone-700">{log.sessionCount}</strong></p>
                                    <div className="space-y-2">
                                      {sessionDetails.map((s: any, idx: number) => (
                                        <div key={idx} className="bg-white border p-3 rounded-sm shadow-sm space-y-2">
                                          <div className="flex justify-between items-center">
                                            <span className="font-bold text-stone-700 text-xs">{s.studentName}</span>
                                            <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded font-bold uppercase tracking-wider">{s.prepLevel}</span>
                                          </div>
                                          <p className="text-xs text-stone-500 italic">"{s.overview}"</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-stone-400 italic text-xs">No 1:1 sessions.</p>
                                )}
                              </div>
                           </div>
                           
                           <div className="space-y-6">
                              {/* Batch Session Section */}
                              <div>
                                <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary/60 border-l-4 border-stone-300 pl-3 mb-3">Batch Session</h4>
                                {log.batchSessionDone ? (
                                  <div className="bg-white border p-3 rounded-sm shadow-sm">
                                    <p className="text-stone-700 italic text-xs">"{log.batchOverview}"</p>
                                  </div>
                                ) : (
                                  <p className="text-stone-400 italic text-xs">No batch session. ({log.batchMissedReason || "N/A"})</p>
                                )}
                              </div>

                              {/* Additional Work Section */}
                              <div>
                                <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary/60 border-l-4 border-stone-300 pl-3 mb-3">Additional Tasks</h4>
                                {log.additionalTasks ? (
                                  <div className="flex flex-wrap gap-2">
                                    {log.additionalTasks.split(",").map((task: string, idx: number) => (
                                      <span key={idx} className="px-2 py-1 bg-white border border-stone-200 text-[10px] font-semibold text-stone-600 rounded">{task}</span>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-stone-400 italic text-xs">None.</p>
                                )}
                              </div>

                              {/* Top Students Section */}
                              {topStudents.length > 0 && (
                                <div>
                                  <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary/60 border-l-4 border-emerald-500 pl-3 mb-3">Top Students</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {topStudents.map((ts: any, idx: number) => (
                                      <div key={idx} className="bg-emerald-50/50 border border-emerald-100 px-3 py-1.5 rounded-sm text-xs flex items-center gap-2">
                                        <UserCheck className="w-3 h-3 text-emerald-600" />
                                        <span className="font-bold text-emerald-800">{ts.studentName}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Issues / Flags */}
                              {log.hasIssue && (
                                <div className="bg-rose-50 border border-rose-200 p-4 rounded-sm mt-4">
                                  <h4 className="text-[10px] uppercase font-bold text-rose-700 flex items-center gap-2 mb-1 tracking-widest">
                                    <AlertTriangle className="w-3 h-3" /> Flag Raised
                                  </h4>
                                  <p className="text-rose-600 font-medium italic text-xs">"{log.issueDetail}"</p>
                                </div>
                              )}
                           </div>
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }) : (
              <div className="p-20 text-center space-y-4">
                 <CheckCircle2 className="w-12 h-12 text-stone-200 mx-auto" />
                 <p className="text-stone-400 font-bold uppercase text-[10px] tracking-widest">No detailed logs found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
