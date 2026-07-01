"use client";

import React from "react";
import { BarChart as BarChartIcon, Brain, Activity, Scale, Lightbulb, Star, Target, CheckCircle2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, LineChart, Line } from "recharts";

export default function PerformanceInsights({ data }: { data: any }) {
  if (!data) return null;

  const { subjectWiseScore, retentionEffectiveness, performanceTrend, batchAverageComparison } = data;

  const getRetentionColor = (score: number) => {
    if (score >= 75) return "#15803D"; // High
    if (score >= 50) return "#3B82F6"; // Moderate
    if (score >= 25) return "#F59E0B"; // Below Average
    return "#EF4444"; // Low
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        
        {/* 12. SUBJECT WISE PERFORMANCE SCORE */}
        <div className="bg-stone-50/50 border border-stone-200 rounded-xl p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-[#6B21A8] text-white p-2 rounded-full">
              <BarChartIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#6B21A8] text-base leading-tight">12. SUBJECT WISE PERFORMANCE SCORE</h3>
              <p className="text-[10px] text-stone-500 font-medium">(Performance Based on Time, Focus & Productivity)</p>
            </div>
          </div>

          <div className="flex-1 w-full h-48 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectWiseScore} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#6B7280'}} interval={0} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#6B7280'}} />
                <Bar dataKey="score" radius={[4, 4, 0, 0]} barSize={24} label={{ position: 'top', fill: '#1F2937', fontSize: 10, formatter: (val: any) => `${val}%` }}>
                  {subjectWiseScore.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill="#6B21A8" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="bg-purple-50 border border-purple-100 p-3 rounded-lg flex gap-3 items-center">
            <Star className="w-5 h-5 text-purple-600 shrink-0" />
            <p className="text-xs text-purple-800 font-medium">Polity and Economy are your strongest areas. Focus more on Science & Tech and Ethics to improve balance.</p>
          </div>
        </div>

        {/* 13. RETENTION & LEARNING EFFECTIVENESS */}
        <div className="bg-stone-50/50 border border-stone-200 rounded-xl p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-[#1E3A8A] text-white p-2 rounded-full">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#1E3A8A] text-base leading-tight">13. RETENTION & LEARNING EFFECTIVENESS</h3>
              <p className="text-[10px] text-stone-500 font-medium">(How Well You Retain What You Study)</p>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="flex-1 flex flex-col items-center">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2">Overall Retention Score</span>
              <div className="w-24 h-24 rounded-full border-[6px] border-[#3B82F6] flex flex-col items-center justify-center bg-white shadow-inner">
                <span className="text-2xl font-bold text-[#1E3A8A]">{retentionEffectiveness.overallScore}%</span>
                <span className="text-[10px] font-bold text-[#3B82F6]">Moderate</span>
              </div>
            </div>
            
            <div className="flex-1">
               <table className="w-full text-[10px] border-collapse rounded-lg overflow-hidden border border-stone-200">
                  <thead className="bg-[#1E3A8A] text-white">
                     <tr>
                        <th className="py-1.5 px-2 text-left font-semibold uppercase tracking-wider">Retention Range</th>
                        <th className="py-1.5 px-2 text-center font-semibold uppercase tracking-wider">Topic Retention</th>
                     </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-stone-100 font-semibold">
                     <tr>
                        <td className="py-1.5 px-2 text-stone-600">0 – 25%</td>
                        <td className="py-1.5 px-2 text-center text-[#EF4444]">Low</td>
                     </tr>
                     <tr>
                        <td className="py-1.5 px-2 text-stone-600">25 – 50%</td>
                        <td className="py-1.5 px-2 text-center text-[#F59E0B]">Below Average</td>
                     </tr>
                     <tr>
                        <td className="py-1.5 px-2 text-stone-600">50 – 75%</td>
                        <td className="py-1.5 px-2 text-center text-[#3B82F6]">Moderate</td>
                     </tr>
                     <tr>
                        <td className="py-1.5 px-2 text-stone-600">75 – 100%</td>
                        <td className="py-1.5 px-2 text-center text-[#15803D]">High</td>
                     </tr>
                  </tbody>
               </table>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4 flex-1">
             <div>
                <h4 className="text-[10px] font-bold text-[#15803D] uppercase tracking-widest mb-2 border-b border-stone-200 pb-1">TOP 3 STRONG TOPICS</h4>
                <ul className="space-y-1.5">
                   {retentionEffectiveness.strongTopics.map((topic: any, idx: number) => (
                      <li key={idx} className="flex justify-between items-center text-[10px] font-semibold text-stone-700">
                         <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#15803D]"/> {topic.name}</div>
                         <span className="text-stone-500">({topic.score}%)</span>
                      </li>
                   ))}
                </ul>
             </div>
             <div>
                <h4 className="text-[10px] font-bold text-[#EF4444] uppercase tracking-widest mb-2 border-b border-stone-200 pb-1">TOP 3 WEAK TOPICS</h4>
                <ul className="space-y-1.5">
                   {retentionEffectiveness.weakTopics.map((topic: any, idx: number) => (
                      <li key={idx} className="flex justify-between items-center text-[10px] font-semibold text-stone-700">
                         <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#EF4444]"/> {topic.name}</div>
                         <span className="text-stone-500">({topic.score}%)</span>
                      </li>
                   ))}
                </ul>
             </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-100 p-2.5 rounded-lg flex gap-2 items-center">
            <Lightbulb className="w-4 h-4 text-blue-600 shrink-0" />
            <p className="text-[10px] text-blue-800 font-medium">Revise weak topics within 24–48 hours to improve retention and long-term understanding.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
         {/* 14A. PERFORMANCE TREND ANALYSIS */}
         <div className="bg-stone-50/50 border border-stone-200 rounded-xl p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
               <div className="bg-[#15803D] text-white p-2 rounded-full">
               <Activity className="w-5 h-5" />
               </div>
               <div>
               <h3 className="font-bold text-[#15803D] text-base leading-tight">14A. PERFORMANCE TREND ANALYSIS</h3>
               <p className="text-[10px] text-stone-500 font-medium">(Your Progress Over Time)</p>
               </div>
            </div>

            <h4 className="text-[10px] font-bold text-[#1E3A8A] uppercase tracking-widest mb-4">OVERALL PERFORMANCE TREND (Last 7 Days)</h4>
            
            <div className="flex-1 w-full h-32 mb-4">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} />
                     <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#6B7280'}} />
                     <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#6B7280'}} domain={[0, 100]} />
                     <Line type="monotone" dataKey="score" stroke="#15803D" strokeWidth={2} dot={{r: 4, fill: "#15803D"}} label={{ position: 'top', fill: '#1F2937', fontSize: 10, formatter: (val: any) => `${val}%` }} />
                  </LineChart>
               </ResponsiveContainer>
            </div>
            
            <div className="bg-green-50 border border-green-100 p-3 rounded-lg flex gap-3 items-center">
               <TrendingUp className="w-5 h-5 text-green-600 shrink-0" />
               <p className="text-xs text-green-800 font-medium">Great improvement! You are on the right track.<br/>Keep maintaining consistency.</p>
            </div>
         </div>

         {/* 14B. ACTIVITY CONSISTENCY HEATMAP */}
         <div className="bg-stone-50/50 border border-stone-200 rounded-xl p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
               <div className="bg-[#D97706] text-white p-2 rounded-full">
               <CalendarCheck className="w-5 h-5" />
               </div>
               <div>
               <h3 className="font-bold text-[#D97706] text-base leading-tight">14B. ACTIVITY CONSISTENCY HEATMAP</h3>
               <p className="text-[10px] text-stone-500 font-medium">(Your Daily Activity Intensity)</p>
               </div>
            </div>

            <div className="flex-1 bg-white border border-stone-200 rounded-lg p-3 mb-4">
               {/* Heatmap Grid Mockup */}
               <table className="w-full text-[9px] font-bold text-stone-500 uppercase tracking-widest text-center border-separate border-spacing-1">
                  <thead>
                     <tr>
                        <th className="text-left w-20">TIME</th>
                        <th>MON</th><th>TUE</th><th>WED</th><th>THU</th><th>FRI</th><th>SAT</th><th>SUN</th>
                     </tr>
                  </thead>
                  <tbody>
                     {[
                        {label: "Morning\n(5 AM - 9 AM)", row: [3,3,3,3,2,1,0]},
                        {label: "Forenoon\n(9 AM - 1 PM)", row: [2,2,3,2,2,1,0]},
                        {label: "Afternoon\n(1 PM - 5 PM)", row: [1,2,1,1,2,0,0]},
                        {label: "Evening\n(5 PM - 9 PM)", row: [2,3,2,3,1,0,0]},
                        {label: "Night\n(9 PM - 12 AM)", row: [3,3,3,2,1,0,0]}
                     ].map((r, rIdx) => (
                        <tr key={rIdx}>
                           <td className="text-left whitespace-pre-line leading-tight py-1">{r.label}</td>
                           {r.row.map((val, cIdx) => (
                              <td key={cIdx} className={`rounded-sm h-6 ${
                                 val === 3 ? "bg-[#15803D]" : 
                                 val === 2 ? "bg-[#86EFAC]" : 
                                 val === 1 ? "bg-[#FCD34D]" : 
                                 "bg-[#FCA5A5]"
                              }`}></td>
                           ))}
                        </tr>
                     ))}
                  </tbody>
               </table>
               
               <div className="flex justify-between items-center mt-3 pt-3 border-t border-stone-100 px-2">
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-[#15803D] rounded-sm"/> <span className="text-[8px] font-bold text-stone-500 uppercase">High Activity</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-[#86EFAC] rounded-sm"/> <span className="text-[8px] font-bold text-stone-500 uppercase">Good Activity</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-[#FCD34D] rounded-sm"/> <span className="text-[8px] font-bold text-stone-500 uppercase">Moderate</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-[#FCA5A5] rounded-sm"/> <span className="text-[8px] font-bold text-stone-500 uppercase">Low Activity</span></div>
               </div>
            </div>
            
            <div className="bg-orange-50 border border-orange-100 p-2.5 rounded-lg flex gap-2 items-center">
               <Target className="w-4 h-4 text-orange-500 shrink-0" />
               <p className="text-[10px] text-orange-800 font-medium leading-tight">Try to maintain high activity in the evening slot on weekends for better overall productivity.</p>
            </div>
         </div>
      </div>

      {/* 15. COMPARISON WITH BATCH AVERAGE */}
      <div className="bg-stone-50/50 border border-stone-200 rounded-xl p-6">
         <div className="flex items-center gap-2 mb-4">
            <div className="bg-[#1E3A8A] text-white p-2 rounded-full">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#1E3A8A] text-base leading-tight">15. COMPARISON WITH BATCH AVERAGE</h3>
            </div>
         </div>

         <table className="w-full text-xs border-collapse rounded-lg overflow-hidden border border-stone-200 mb-4">
            <thead className="bg-[#1E3A8A] text-white">
               <tr>
                  <th className="py-2.5 px-4 text-left font-semibold uppercase tracking-wider">Parameter</th>
                  <th className="py-2.5 px-4 text-center font-semibold uppercase tracking-wider">Your Performance</th>
                  <th className="py-2.5 px-4 text-center font-semibold uppercase tracking-wider">Batch Average</th>
                  <th className="py-2.5 px-4 text-center font-semibold uppercase tracking-wider">Difference</th>
                  <th className="py-2.5 px-4 text-center font-semibold uppercase tracking-wider">Status</th>
               </tr>
            </thead>
            <tbody className="bg-white divide-y divide-stone-100">
               {batchAverageComparison.map((item: any, idx: number) => (
                  <tr key={idx}>
                     <td className="py-3 px-4 font-semibold text-stone-700 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-stone-400" /> {item.parameter}
                     </td>
                     <td className="py-3 px-4 text-center font-bold text-[#1E3A8A]">{item.student}</td>
                     <td className="py-3 px-4 text-center font-bold text-stone-500">{item.batch}</td>
                     <td className={`py-3 px-4 text-center font-bold ${item.diff.startsWith('+') ? 'text-[#15803D]' : 'text-[#EF4444]'}`}>{item.diff}</td>
                     <td className="py-3 px-4 text-center font-bold text-[#15803D]">{item.status}</td>
                  </tr>
               ))}
            </tbody>
         </table>

         <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg flex gap-3 items-center">
            <BarChartIcon className="w-5 h-5 text-blue-600 shrink-0" />
            <p className="text-xs text-blue-800 font-bold">You are performing better than most students in your batch. Keep working on weak subjects and revision.</p>
         </div>
      </div>

    </div>
  );
}

function CalendarCheck(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="m9 16 2 2 4-4"/></svg>
  );
}
