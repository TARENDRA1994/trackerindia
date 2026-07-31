"use client";

import { useState, useEffect } from "react";
import { 
  Users, ShieldCheck, Clock, Search, 
  ArrowLeft, AlertTriangle, CheckCircle2, 
  TrendingUp, Calendar, ChevronDown, ChevronUp, UserCheck
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminMentorLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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

  const filteredLogs = logs.filter(log => {
    const mentorName = log.mentor?.name?.toLowerCase() || "";
    const mentorEmail = log.mentor?.email?.toLowerCase() || "";
    const tasks = log.additionalTasks?.toLowerCase() || "";
    const batchInfo = log.batchOverview?.toLowerCase() || "";
    const term = searchTerm.toLowerCase();

    return mentorName.includes(term) || 
           mentorEmail.includes(term) || 
           tasks.includes(term) || 
           batchInfo.includes(term);
  });

  // Calculate Metrics
  const totalLogs = logs.length;
  const avgWorkHours = totalLogs > 0 ? (logs.reduce((acc, l) => acc + (l.workHours || 0), 0) / totalLogs).toFixed(1) : 0;
  const avgProductivity = totalLogs > 0 ? (logs.reduce((acc, l) => acc + (l.dailyProductivity || 0), 0) / totalLogs).toFixed(1) : 0;
  const issuesCount = logs.filter(l => l.hasIssue).length;

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Header */}
      <div className="bg-primary text-white pt-10 pb-20 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <Link href="/dashboard/admin" className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 flex items-center gap-2 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" /> Admin Dashboard
            </Link>
            <h1 className="text-4xl font-serif font-bold italic text-white flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-accent" /> Faculty Logs Report
            </h1>
            <p className="text-white/70 font-medium">Daily operational performance logs submitted by Mentors.</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 -mt-10 space-y-10">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-8 border border-stone-200 shadow-xl flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest">Total Submissions</p>
              <p className="text-4xl font-serif font-bold text-primary">{totalLogs}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-full">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-8 border border-stone-200 shadow-xl flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest">Avg Work Hours</p>
              <p className="text-4xl font-serif font-bold text-primary">{avgWorkHours}h</p>
            </div>
            <div className="p-4 bg-amber-50 rounded-full">
              <Clock className="w-8 h-8 text-amber-600" />
            </div>
          </div>

          <div className="bg-white p-8 border border-stone-200 shadow-xl flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest">Avg Faculty Efficiency</p>
              <p className="text-4xl font-serif font-bold text-primary">{avgProductivity}/10</p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-full">
              <TrendingUp className="w-8 h-8 text-emerald-600" />
            </div>
          </div>

          <div className="bg-white p-8 border border-stone-200 shadow-xl flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest">Issues Reported</p>
              <p className="text-4xl font-serif font-bold text-rose-600">{issuesCount}</p>
            </div>
            <div className="p-4 bg-rose-50 rounded-full">
              <AlertTriangle className="w-8 h-8 text-rose-600" />
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
          <input 
             className="w-full pl-12 pr-4 py-4 bg-white border border-stone-200 shadow-md outline-none focus:border-primary transition-all text-sm font-semibold placeholder:text-stone-400"
             placeholder="Search by mentor name, email, task detail, or batch overview..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Logs List */}
        <div className="bg-white border border-stone-200 shadow-xl overflow-hidden">
          <div className="p-8 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
            <h2 className="text-xl font-serif font-bold text-primary">Operational Log Archive</h2>
            <div className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Faculty Protocol Active</div>
          </div>

          <div className="divide-y divide-stone-100">
            {loading ? (
              <div className="p-20 text-center text-stone-400 font-bold uppercase tracking-widest text-xs">
                Analyzing Faculty Logs...
              </div>
            ) : filteredLogs.length > 0 ? filteredLogs.map((log) => {
              const isExpanded = expandedLogId === log.id;
              
              // Safe JSON Parsing helper
              const parseJSON = (str: string) => {
                try {
                  return str ? JSON.parse(str) : [];
                } catch (e) {
                  return [];
                }
              };

              const sessionDetails = parseJSON(log.sessionDetails);
              const topStudents = parseJSON(log.topStudents);

              return (
                <div key={log.id} className={`transition-all hover:bg-stone-50/50 ${log.hasIssue ? "border-l-4 border-rose-500" : ""}`}>
                  <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer" onClick={() => toggleExpand(log.id)}>
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 bg-primary/5 flex items-center justify-center font-serif font-bold text-primary border border-primary/10">
                        {log.mentor?.name?.charAt(0) || "M"}
                      </div>
                      <div>
                        <h3 className="font-bold text-stone-800 text-lg">{log.mentor?.name || "Unknown Mentor"}</h3>
                        <p className="text-xs text-stone-400 font-medium flex items-center gap-4">
                          <span>{log.mentor?.email}</span>
                          <span className="flex items-center gap-1 text-stone-500"><Calendar className="w-3.5 h-3.5" /> {new Date(log.timestamp).toLocaleDateString()}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                      <div className="flex gap-4">
                        <div className="text-center bg-stone-100/50 px-4 py-2 border rounded-sm">
                          <p className="text-[8px] font-bold text-stone-400 uppercase tracking-widest">Work Hours</p>
                          <p className="text-sm font-bold text-stone-700">{log.workHours || 0}h</p>
                        </div>
                        <div className="text-center bg-stone-100/50 px-4 py-2 border rounded-sm">
                          <p className="text-[8px] font-bold text-stone-400 uppercase tracking-widest">Efficiency</p>
                          <p className={`text-sm font-bold ${log.dailyProductivity >= 7 ? "text-emerald-600" : "text-amber-600"}`}>{log.dailyProductivity}/10</p>
                        </div>
                      </div>
                      <button className="p-2 text-stone-400 hover:text-primary transition-colors">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: "auto", opacity: 1 }} 
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-stone-50/30 border-t border-stone-100 p-8 space-y-6 overflow-hidden text-sm"
                      >
                        {/* 1:1 Sessions Section */}
                        <div>
                          <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary/60 border-l-4 border-accent pl-3 mb-3">1:1 Mentorship Sessions</h4>
                          {log.oneOnOneDone ? (
                            <div className="space-y-3">
                              <p className="text-xs text-stone-400">Total sessions: <strong className="text-stone-700">{log.sessionCount}</strong></p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {sessionDetails.map((s: any, idx: number) => (
                                  <div key={idx} className="bg-white border p-4 rounded-sm shadow-sm space-y-2">
                                    <div className="flex justify-between items-center border-b pb-1">
                                      <span className="font-bold text-stone-700">{s.studentName}</span>
                                      <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded font-bold uppercase tracking-wider">{s.prepLevel}</span>
                                    </div>
                                    <p className="text-xs text-stone-500 italic">"{s.overview}"</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <p className="text-stone-400 italic text-xs">No 1:1 sessions conducted today.</p>
                          )}
                        </div>

                        {/* Batch Session Section */}
                        <div>
                          <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary/60 border-l-4 border-stone-300 pl-3 mb-3">Batch Session</h4>
                          {log.batchSessionDone ? (
                            <div className="bg-white border p-4 rounded-sm shadow-sm">
                              <p className="text-stone-700 italic">"{log.batchOverview}"</p>
                            </div>
                          ) : (
                            <p className="text-stone-400 italic text-xs">No batch session conducted. Reason: {log.batchMissedReason || "N/A"}</p>
                          )}
                        </div>

                        {/* Additional Work Section */}
                        <div>
                          <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary/60 border-l-4 border-stone-300 pl-3 mb-3">Additional Tasks Completed</h4>
                          {log.additionalTasks ? (
                            <div className="flex flex-wrap gap-2">
                              {log.additionalTasks.split(",").map((task: string, idx: number) => (
                                <span key={idx} className="px-3 py-1 bg-white border border-stone-200 text-xs font-semibold text-stone-600 rounded">{task}</span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-stone-400 italic text-xs">No additional tasks declared.</p>
                          )}
                        </div>

                        {/* Top Students Section */}
                        {topStudents.length > 0 && (
                          <div>
                            <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary/60 border-l-4 border-emerald-500 pl-3 mb-3">Top Performing Students of the Day</h4>
                            <div className="flex flex-wrap gap-3">
                              {topStudents.map((ts: any, idx: number) => (
                                <div key={idx} className="bg-emerald-50/50 border border-emerald-100 px-4 py-2 rounded-sm text-xs flex items-center gap-2">
                                  <UserCheck className="w-4 h-4 text-emerald-600" />
                                  <span className="font-bold text-emerald-800">{ts.studentName}</span>
                                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">Rating: {ts.rating}/10</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Issues / Flags */}
                        {log.hasIssue && (
                          <div className="bg-rose-50 border border-rose-200 p-4 rounded-sm">
                            <h4 className="text-xs font-bold text-rose-700 flex items-center gap-2 mb-1">
                              <AlertTriangle className="w-4 h-4" /> Faculty Flag Raised / Support Required
                            </h4>
                            <p className="text-rose-600 font-medium italic">"{log.issueDetail}"</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }) : (
              <div className="p-20 text-center space-y-4">
                 <CheckCircle2 className="w-12 h-12 text-stone-200 mx-auto" />
                 <p className="text-stone-400 font-bold uppercase text-[10px] tracking-widest">No faculty logs match your query</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
