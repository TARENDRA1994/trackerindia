"use client";

import React from "react";
import { Trophy, Clock, BookOpen, PenTool, CheckCircle2, History, RotateCw, Target, Star, Brain, ChevronUp, ChevronDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function TopperComparison({ data }: { data: any }) {
  if (!data || !data.topperComparison) return null;
  const tc = data.topperComparison;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex justify-between gap-6">
        <div className="flex-1 bg-white border border-stone-200 rounded-xl p-6 flex items-center justify-center gap-6 shadow-sm">
          <div className="bg-[#EAB308]/20 p-4 rounded-full">
            <Trophy className="w-12 h-12 text-[#EAB308]" />
          </div>
          <div>
             <p className="text-xs font-bold text-stone-500 uppercase tracking-widest">You are in the</p>
             <h2 className="text-3xl font-bold text-[#15803D]">Top {tc.percentile}%</h2>
             <p className="text-[10px] font-bold text-stone-600 mt-1">of your batch</p>
             <p className="text-[9px] text-stone-400 mt-2">Keep following topper habits<br/>to reach the top 10%!</p>
          </div>
        </div>

        <div className="flex-[1.5] flex gap-6 bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
           <div className="flex-1 flex flex-col items-center border-r border-stone-200 pr-4">
              <h3 className="text-xs font-bold text-[#1E3A8A] uppercase tracking-widest mb-4">Overall Topper Score</h3>
              <div className="flex gap-8">
                 <div className="flex flex-col items-center">
                    <p className="text-[10px] font-bold text-stone-500 mb-2 uppercase">You</p>
                    <div className="relative w-20 h-20 rounded-full border-[6px] border-[#15803D] flex items-center justify-center">
                       <span className="text-xl font-bold text-stone-800">{tc.yourScore}%</span>
                    </div>
                 </div>
                 <div className="flex flex-col items-center">
                    <p className="text-[10px] font-bold text-stone-500 mb-2 uppercase">Top 10% Students</p>
                    <div className="relative w-20 h-20 rounded-full border-[6px] border-[#1E3A8A] flex items-center justify-center">
                       <span className="text-xl font-bold text-stone-800">{tc.topperScore}%</span>
                    </div>
                 </div>
              </div>
           </div>
           <div className="flex-1 flex flex-col justify-center pl-2">
              <div className="flex items-center gap-2 mb-2 text-[#15803D]">
                 <Star className="w-4 h-4" />
                 <span className="text-[10px] font-bold uppercase tracking-widest">Key Insight</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed font-medium">
                 Top 10% students are <b>{tc.topperScore - tc.yourScore}% ahead</b> of you overall.
                 <br/><br/>
                 Focus on revision, tests, and answer writing.
              </p>
           </div>
        </div>
      </div>

      {/* 1. DETAILED HABIT & PERFORMANCE COMPARISON */}
      <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-[#1E3A8A] text-white px-4 py-2 font-bold text-[10px] uppercase tracking-widest">
           1. Detailed Habit & Performance Comparison
        </div>
        <table className="w-full text-xs">
           <thead className="bg-[#1E3A8A]/90 text-white">
              <tr>
                 <th className="py-2 px-4 text-left font-bold uppercase tracking-widest text-[9px] w-1/3">Parameter</th>
                 <th className="py-2 px-4 text-center font-bold uppercase tracking-widest text-[9px]">You</th>
                 <th className="py-2 px-4 text-center font-bold uppercase tracking-widest text-[9px]">Top 10% Students</th>
                 <th className="py-2 px-4 text-center font-bold uppercase tracking-widest text-[9px]">Difference</th>
                 <th className="py-2 px-4 text-left font-bold uppercase tracking-widest text-[9px]">Insight</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-stone-200 font-medium">
              {tc.habits.map((h: any, idx: number) => (
                 <tr key={idx} className={idx % 2 === 0 ? "bg-stone-50" : "bg-white"}>
                    <td className="py-2.5 px-4 flex items-center gap-2 text-[#1E3A8A]">
                       {h.icon === 'Clock' && <Clock className="w-4 h-4"/>}
                       {h.icon === 'BookOpen' && <BookOpen className="w-4 h-4"/>}
                       {h.icon === 'PenTool' && <PenTool className="w-4 h-4"/>}
                       {h.icon === 'CheckCircle2' && <CheckCircle2 className="w-4 h-4"/>}
                       {h.icon === 'History' && <History className="w-4 h-4"/>}
                       {h.icon === 'RotateCw' && <RotateCw className="w-4 h-4"/>}
                       {h.icon === 'Target' && <Target className="w-4 h-4"/>}
                       <span>{h.parameter}</span>
                    </td>
                    <td className="py-2.5 px-4 text-center text-stone-800 font-bold">{h.you}</td>
                    <td className="py-2.5 px-4 text-center text-stone-800 font-bold">{h.topper}</td>
                    <td className="py-2.5 px-4 text-center text-red-600 font-bold bg-red-50/50">{h.difference}</td>
                    <td className="py-2.5 px-4 text-left text-stone-600 text-[10px]">{h.insight}</td>
                 </tr>
              ))}
           </tbody>
        </table>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6">
         {/* 2. SUBJECT WISE SCORE COMPARISON */}
         <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm flex flex-col">
            <h3 className="font-bold text-[#1E3A8A] text-[10px] uppercase tracking-widest mb-4">2. Subject Wise Score Comparison</h3>
            <div className="flex gap-4 mb-2 text-[10px] font-bold text-stone-500 uppercase justify-center">
               <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#15803D]"></div> You</div>
               <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#1E3A8A]"></div> Top 10% Students</div>
            </div>
            <div className="h-48 w-full mt-2">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tc.subjects} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                     <XAxis dataKey="subject" tick={{ fontSize: 9, fontWeight: 'bold', fill: '#4B5563' }} axisLine={false} tickLine={false} />
                     <YAxis tick={{ fontSize: 9, fill: '#6B7280' }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}%`} />
                     <Tooltip cursor={{fill: '#f5f5f4'}} />
                     <Bar dataKey="you" fill="#15803D" radius={[2, 2, 0, 0]} barSize={12} />
                     <Bar dataKey="topper" fill="#1E3A8A" radius={[2, 2, 0, 0]} barSize={12} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
            <div className="mt-4 bg-[#1E3A8A]/5 p-3 rounded-lg flex items-start gap-2 border border-[#1E3A8A]/10">
               <Star className="w-4 h-4 text-[#1E3A8A] mt-0.5 shrink-0" />
               <p className="text-[10px] text-[#1E3A8A] font-medium leading-relaxed">
                  Top 10% students are stronger in History, S&T and Environment. Keep improving consistently.
               </p>
            </div>
         </div>

         {/* 3. TOPPER HABIT PATTERNS */}
         <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm flex flex-col">
            <h3 className="font-bold text-[#1E3A8A] text-[10px] uppercase tracking-widest mb-4">3. Topper Habit Patterns</h3>
            <div className="space-y-3 flex-1 flex flex-col justify-center">
               {tc.patterns.map((p: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between border-b border-stone-100 pb-2 last:border-0 last:pb-0">
                     <div className="flex items-start gap-3">
                        <div className="bg-stone-100 p-1.5 rounded-md text-stone-500">
                           {p.icon === 'Sun' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>}
                           {p.icon === 'Book' && <BookOpen className="w-3.5 h-3.5"/>}
                           {p.icon === 'Test' && <Target className="w-3.5 h-3.5"/>}
                           {p.icon === 'Pen' && <PenTool className="w-3.5 h-3.5"/>}
                           {p.icon === 'Balance' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v18M3 12h18"/></svg>}
                        </div>
                        <div>
                           <p className="text-[10px] font-bold text-stone-800">{p.title}</p>
                           <p className="text-[9px] text-stone-500">{p.desc}</p>
                        </div>
                     </div>
                     <span className="text-[11px] font-bold text-[#15803D]">{p.percentage}</span>
                  </div>
               ))}
            </div>
            <div className="mt-4 bg-[#15803D]/10 p-3 rounded-lg flex items-center gap-2 border border-[#15803D]/20">
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#15803D" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
               <p className="text-[10px] text-[#15803D] font-bold uppercase tracking-widest">
                  Adopt these habits consistently to reach the top 10%.
               </p>
            </div>
         </div>
      </div>

      {/* Gap Analysis & Action Plan */}
      <div className="grid grid-cols-2 gap-6">
         {/* 4. GAP ANALYSIS */}
         <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm">
            <h3 className="font-bold text-[#1E3A8A] text-[10px] uppercase tracking-widest mb-4">4. Gap Analysis</h3>
            <div className="flex gap-4">
               {/* Biggest Strength */}
               <div className="flex-1 flex flex-col items-center justify-center text-center p-3 border-r border-stone-100">
                  <p className="text-[9px] font-bold text-[#15803D] uppercase tracking-widest mb-2">Biggest Strength</p>
                  <div className="bg-[#15803D]/10 p-2 rounded-full text-[#15803D] mb-1">
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
                  </div>
                  <p className="text-xs font-bold text-stone-800">{tc.gapAnalysis.strength.name}</p>
                  <p className="text-[9px] text-stone-500 mb-1">{tc.gapAnalysis.strength.desc}</p>
                  <p className="text-xs font-bold text-[#15803D]">{tc.gapAnalysis.strength.stat}</p>
               </div>
               {/* Biggest Gap */}
               <div className="flex-1 flex flex-col items-center justify-center text-center p-3 border-r border-stone-100">
                  <p className="text-[9px] font-bold text-red-600 uppercase tracking-widest mb-2">Biggest Gap</p>
                  <div className="bg-red-100 p-2 rounded-full text-red-600 mb-1">
                     <Target className="w-[18px] h-[18px]" />
                  </div>
                  <p className="text-xs font-bold text-stone-800">{tc.gapAnalysis.gap1.name}</p>
                  <p className="text-[9px] text-stone-500 mb-1">{tc.gapAnalysis.gap1.desc}</p>
                  <p className="text-xs font-bold text-red-600">{tc.gapAnalysis.gap1.stat}</p>
               </div>
               {/* Second Biggest Gap */}
               <div className="flex-1 flex flex-col items-center justify-center text-center p-3">
                  <p className="text-[9px] font-bold text-[#EAB308] uppercase tracking-widest mb-2">Second Biggest Gap</p>
                  <div className="bg-[#EAB308]/10 p-2 rounded-full text-[#EAB308] mb-1">
                     <BookOpen className="w-[18px] h-[18px]" />
                  </div>
                  <p className="text-xs font-bold text-stone-800">{tc.gapAnalysis.gap2.name}</p>
                  <p className="text-[9px] text-stone-500 mb-1">{tc.gapAnalysis.gap2.desc}</p>
                  <p className="text-xs font-bold text-[#EAB308]">{tc.gapAnalysis.gap2.stat}</p>
               </div>
            </div>
         </div>

         {/* 5. ACTION PLAN */}
         <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm flex flex-col">
            <h3 className="font-bold text-[#1E3A8A] text-[10px] uppercase tracking-widest mb-3">5. Action Plan To Reach Top 10%</h3>
            <ul className="space-y-2 mb-3 flex-1">
               {tc.actionPlan.map((action: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-[10px] font-medium text-stone-700">
                     <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] shrink-0 mt-0.5" />
                     {action}
                  </li>
               ))}
            </ul>
            <div className="bg-stone-50 p-2 text-center rounded-lg border border-stone-100">
               <p className="text-[9px] font-bold text-[#15803D] uppercase tracking-widest flex items-center justify-center gap-1">
                  <Trophy className="w-3 h-3" /> Small daily improvements lead to big rank improvements!
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
