"use client";

import React from "react";
import { HeartPulse, CalendarCheck, ClipboardList, PenTool, CheckCircle2, TrendingUp, AlertTriangle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

export default function WellBeingConsistency({ data }: { data: any }) {
  if (!data) return null;

  const { wellBeing, consistencyTracker, backlogManagement, nextDayPlanning } = data;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#15803D"; // Green
    if (score >= 60) return "#EAB308"; // Yellow
    if (score >= 40) return "#F97316"; // Orange
    return "#EF4444"; // Red
  };

  const wbColor = getScoreColor(wellBeing.overallScore);
  const consistencyColor = getScoreColor(consistencyTracker.consistencyScore);
  const planningColor = getScoreColor(nextDayPlanning.clarityScore);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        
        {/* 8. EMOTIONAL & MENTAL WELL-BEING */}
        <div className="bg-stone-50/50 border border-stone-200 rounded-xl p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-[#9333EA] text-white p-2 rounded-full">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#9333EA] text-base leading-tight">8. EMOTIONAL & MENTAL WELL-BEING</h3>
              <p className="text-[10px] text-stone-500 font-medium">(Your Mental & Emotional State Today)</p>
            </div>
          </div>

          <div className="flex gap-6 items-center flex-1">
            <div className="flex-1 flex flex-col items-center">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2">Overall Well-being Score</span>
              <div className="relative w-32 h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[{value: wellBeing.overallScore, fill: wbColor}, {value: 100-wellBeing.overallScore, fill: '#F3F4F6'}]}
                      innerRadius={45}
                      outerRadius={60}
                      startAngle={180}
                      endAngle={0}
                      dataKey="value"
                      stroke="none"
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                  <span className="text-3xl font-bold" style={{ color: wbColor }}>{wellBeing.overallScore}%</span>
                  <span className="text-xs font-bold uppercase mt-1" style={{ color: wbColor }}>Good</span>
                </div>
              </div>
            </div>

            <div className="flex-[1.5]">
               <table className="w-full text-xs border-collapse rounded-lg overflow-hidden border border-stone-200">
                  <thead className="bg-[#9333EA] text-white">
                     <tr>
                        <th className="py-2 px-3 text-left font-semibold uppercase tracking-wider">Parameter</th>
                        <th className="py-2 px-3 text-center font-semibold uppercase tracking-wider">Today</th>
                     </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-stone-100">
                     <tr>
                        <td className="py-2.5 px-3 font-semibold text-stone-700 flex items-center gap-2">😊 Mood</td>
                        <td className="py-2.5 px-3 text-center font-bold text-[#15803D]">{wellBeing.mood}</td>
                     </tr>
                     <tr>
                        <td className="py-2.5 px-3 font-semibold text-stone-700 flex items-center gap-2">🎯 Motivation Level</td>
                        <td className="py-2.5 px-3 text-center font-bold text-[#15803D]">{wellBeing.motivationLevel}</td>
                     </tr>
                     <tr>
                        <td className="py-2.5 px-3 font-semibold text-stone-700 flex items-center gap-2">🧠 Focus Level</td>
                        <td className="py-2.5 px-3 text-center font-bold text-[#EAB308]">{wellBeing.focusLevel}</td>
                     </tr>
                     <tr>
                        <td className="py-2.5 px-3 font-semibold text-stone-700 flex items-center gap-2">😥 Stress / Pressure</td>
                        <td className="py-2.5 px-3 text-center font-bold text-[#15803D]">{wellBeing.stressPressure}</td>
                     </tr>
                     <tr>
                        <td className="py-2.5 px-3 font-semibold text-stone-700 flex items-center gap-2">🔋 Energy Level</td>
                        <td className="py-2.5 px-3 text-center font-bold text-[#15803D]">{wellBeing.energyLevel}</td>
                     </tr>
                  </tbody>
               </table>
            </div>
          </div>
          
          <div className="mt-4 bg-purple-50 border border-purple-100 p-3 rounded-lg flex gap-3 items-center">
            <Lightbulb className="w-5 h-5 text-purple-600 shrink-0" />
            <p className="text-xs text-purple-800 font-medium">You are in a good mental space. Continue working with consistency and avoid unnecessary distractions.</p>
          </div>
        </div>

        {/* 9. CONSISTENCY & DISCIPLINE TRACKER */}
        <div className="bg-stone-50/50 border border-stone-200 rounded-xl p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-[#0284C7] text-white p-2 rounded-full">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#0284C7] text-base leading-tight">9. CONSISTENCY & DISCIPLINE TRACKER</h3>
              <p className="text-[10px] text-stone-500 font-medium">(Your Consistency Over Time)</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-6 flex-1">
             <div className="bg-white border border-stone-200 rounded-lg py-3 flex flex-col items-center justify-center text-center">
                <span className="text-[9px] font-semibold text-stone-600 uppercase tracking-widest mb-1">Form Submission<br/>Streak</span>
                <span className="text-2xl font-bold text-[#0284C7]">{consistencyTracker.streak}</span>
                <span className="text-[9px] text-stone-500">days</span>
             </div>
             <div className="bg-white border border-stone-200 rounded-lg py-3 flex flex-col items-center justify-center text-center">
                <span className="text-[9px] font-semibold text-stone-600 uppercase tracking-widest mb-1">Study Days<br/>This Month</span>
                <span className="text-2xl font-bold text-[#0284C7]">{consistencyTracker.studyDaysThisMonth}</span>
                <span className="text-[9px] text-stone-500">days</span>
             </div>
             <div className="bg-white border border-stone-200 rounded-lg py-3 flex flex-col items-center justify-center text-center">
                <span className="text-[9px] font-semibold text-stone-600 uppercase tracking-widest mb-1">Consistency<br/>Score</span>
                <span className="text-2xl font-bold" style={{ color: consistencyColor }}>{consistencyTracker.consistencyScore}%</span>
                <span className="text-[9px] font-bold" style={{ color: consistencyColor }}>Good</span>
             </div>
             <div className="bg-white border border-stone-200 rounded-lg py-3 flex flex-col items-center justify-center text-center">
                <span className="text-[9px] font-semibold text-stone-600 uppercase tracking-widest mb-1">Missed Days<br/>This Month</span>
                <span className="text-2xl font-bold text-[#EF4444]">{consistencyTracker.missedDays}</span>
                <span className="text-[9px] text-stone-500">days</span>
             </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-lg p-4 mb-4">
            <h4 className="text-[9px] font-bold text-stone-500 uppercase tracking-widest text-center mb-3">DAILY CONSISTENCY (Last 14 Days)</h4>
            <div className="flex justify-between items-center px-2">
               {consistencyTracker.heatmap.map((d: any, i: number) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                     <span className="text-[9px] font-bold text-stone-400">{d.day}</span>
                     {d.status === "submitted" && <CheckCircle2 className="w-4 h-4 text-[#15803D] fill-green-100" />}
                     {d.status === "late" && <CheckCircle2 className="w-4 h-4 text-[#F59E0B] fill-orange-100" />}
                     {d.status === "missed" && <AlertCircle className="w-4 h-4 text-[#EF4444] fill-red-100" />}
                  </div>
               ))}
            </div>
            <div className="flex justify-center gap-4 mt-4">
               <div className="flex items-center gap-1 text-[9px] font-semibold text-stone-600"><CheckCircle2 className="w-3 h-3 text-[#15803D]" /> Submitted</div>
               <div className="flex items-center gap-1 text-[9px] font-semibold text-stone-600"><CheckCircle2 className="w-3 h-3 text-[#F59E0B]" /> Submitted Late</div>
               <div className="flex items-center gap-1 text-[9px] font-semibold text-stone-600"><AlertCircle className="w-3 h-3 text-[#EF4444]" /> Missed</div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg flex gap-3 items-center">
            <Target className="w-5 h-5 text-blue-600 shrink-0" />
            <p className="text-xs text-blue-800 font-medium">Excellent consistency! Try to maintain 100% form submission for better tracking and improvement.</p>
          </div>
        </div>
      </div>

      {/* 10. BACKLOG & TASK MANAGEMENT */}
      <div className="bg-stone-50/50 border border-stone-200 rounded-xl p-6">
         <div className="flex items-center gap-2 mb-6">
            <div className="bg-[#B45309] text-white p-2 rounded-full">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#B45309] text-base leading-tight">10. BACKLOG & TASK MANAGEMENT</h3>
              <p className="text-[10px] text-stone-500 font-medium">(How You Are Managing Your Workload)</p>
            </div>
         </div>

         <div className="flex gap-6">
            <div className="flex-1 space-y-4">
               <div className="grid grid-cols-4 gap-2">
                  <div className="bg-white border border-stone-200 rounded-lg py-3 flex flex-col items-center text-center">
                     <FileText className="w-4 h-4 text-[#B45309] mb-1" />
                     <span className="text-xl font-bold text-[#B45309]">{backlogManagement.pendingFromYesterday}</span>
                     <span className="text-[9px] font-semibold text-stone-600 uppercase tracking-widest mt-1">Tasks Pending<br/>From Yesterday</span>
                  </div>
                  <div className="bg-white border border-stone-200 rounded-lg py-3 flex flex-col items-center text-center">
                     <TrendingUp className="w-4 h-4 text-stone-600 mb-1" />
                     <span className="text-xl font-bold text-stone-800">{backlogManagement.carriedForwardToday}</span>
                     <span className="text-[9px] font-semibold text-stone-600 uppercase tracking-widest mt-1">Tasks Carried<br/>Forward Today</span>
                  </div>
                  <div className="bg-white border border-stone-200 rounded-lg py-3 flex flex-col items-center text-center">
                     <CheckCircle2 className="w-4 h-4 text-[#15803D] mb-1" />
                     <span className="text-xl font-bold text-[#15803D]">{backlogManagement.completedToday}</span>
                     <span className="text-[9px] font-semibold text-stone-600 uppercase tracking-widest mt-1">Tasks Completed<br/>Today</span>
                  </div>
                  <div className="bg-white border border-stone-200 rounded-lg py-3 flex flex-col items-center text-center">
                     <ClipboardList className="w-4 h-4 text-stone-600 mb-1" />
                     <span className="text-xl font-bold text-stone-800">{backlogManagement.totalForToday}</span>
                     <span className="text-[9px] font-semibold text-stone-600 uppercase tracking-widest mt-1">Total Tasks<br/>For Today</span>
                  </div>
               </div>
               
               <div className="bg-white border border-stone-200 rounded-lg p-4">
                  <h4 className="text-[9px] font-bold text-stone-500 uppercase tracking-widest mb-2">BACKLOG TREND (Last 7 Days)</h4>
                  <div className="h-28 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart data={backlogManagement.trend}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} />
                           <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#6B7280'}} />
                           <YAxis hide domain={[0, 'dataMax + 2']} />
                           <Line type="monotone" dataKey="count" stroke="#D97706" strokeWidth={2} dot={{r: 3, fill: "#D97706"}} label={{ position: 'top', fill: '#1F2937', fontSize: 10 }} />
                        </RechartsLineChart>
                     </ResponsiveContainer>
                  </div>
               </div>
            </div>

            <div className="flex-[0.8] bg-white border border-stone-200 rounded-lg p-4 flex flex-col">
               <h4 className="text-[10px] font-bold text-[#B45309] uppercase tracking-widest mb-4">BACKLOG STATUS</h4>
               <div className="flex gap-4 items-center flex-1">
                  <div className="relative w-24 h-24">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                           <Pie
                              data={[{value: 80, fill: '#15803D'}, {value: 20, fill: '#E5E7EB'}]}
                              innerRadius={35}
                              outerRadius={45}
                              dataKey="value"
                              stroke="none"
                           />
                        </PieChart>
                     </ResponsiveContainer>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xs font-bold text-[#15803D]">Low</span>
                        <span className="text-[10px] font-bold text-[#15803D]">Risk</span>
                     </div>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                     <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-stone-600">Backlog Load</span>
                        <span className="font-bold text-[#15803D]">Low</span>
                     </div>
                     <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-stone-600">Managing Well</span>
                        <span className="font-bold text-[#15803D]">Yes</span>
                     </div>
                     <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-stone-600">Overwhelmed</span>
                        <span className="font-bold text-[#15803D]">No</span>
                     </div>
                     <div className="flex justify-between items-center text-xs pt-2 border-t border-stone-100">
                        <span className="font-bold text-stone-800">Risk Level</span>
                        <span className="font-bold text-[#15803D] bg-green-100 px-2 py-0.5 rounded uppercase text-[10px]">Low Risk</span>
                     </div>
                  </div>
               </div>

               <div className="mt-4 bg-orange-50 border border-orange-100 p-2.5 rounded-lg flex gap-2 items-center">
                  <Star className="w-4 h-4 text-orange-500 shrink-0" />
                  <p className="text-[10px] text-orange-800 font-medium leading-tight">Great job! Your backlog is low and you are managing your tasks well. Keep this momentum going.</p>
               </div>
            </div>
         </div>
      </div>

      {/* 11. NEXT DAY PLANNING */}
      <div className="bg-stone-50/50 border border-stone-200 rounded-xl p-6">
         <div className="flex items-center gap-2 mb-6">
            <div className="bg-[#047857] text-white p-2 rounded-full">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#047857] text-base leading-tight">11. NEXT DAY PLANNING & PREPAREDNESS</h3>
              <p className="text-[10px] text-stone-500 font-medium">(Clarity & Planning for Tomorrow)</p>
            </div>
         </div>

         <div className="flex gap-6 items-start">
            <div className="flex-1 flex gap-4">
               <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2">Planning Clarity Score</span>
                  <div className="relative w-28 h-28">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                           <Pie
                              data={[{value: nextDayPlanning.clarityScore, fill: planningColor}, {value: 100-nextDayPlanning.clarityScore, fill: '#F3F4F6'}]}
                              innerRadius={40}
                              outerRadius={55}
                              dataKey="value"
                              stroke="none"
                           />
                        </PieChart>
                     </ResponsiveContainer>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold" style={{ color: planningColor }}>{nextDayPlanning.clarityScore}%</span>
                        <span className="text-[9px] font-bold uppercase" style={{ color: planningColor }}>Well Planned</span>
                     </div>
                  </div>
               </div>

               <table className="flex-1 text-xs border-collapse rounded-lg overflow-hidden border border-stone-200">
                  <thead className="bg-[#047857] text-white">
                     <tr>
                        <th className="py-2 px-3 text-left font-semibold uppercase tracking-wider">Planning Area</th>
                        <th className="py-2 px-3 text-center font-semibold uppercase tracking-wider">Status</th>
                     </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-stone-100">
                     <tr>
                        <td className="py-2.5 px-3 font-semibold text-stone-700">Tomorrow's Plan Clarity</td>
                        <td className="py-2.5 px-3 text-center font-bold text-[#15803D]">{nextDayPlanning.planClarity}</td>
                     </tr>
                     <tr>
                        <td className="py-2.5 px-3 font-semibold text-stone-700">Subject Priority Set</td>
                        <td className="py-2.5 px-3 text-center font-bold text-[#15803D]">{nextDayPlanning.subjectPrioritySet}</td>
                     </tr>
                     <tr>
                        <td className="py-2.5 px-3 font-semibold text-stone-700">Target Time for Study</td>
                        <td className="py-2.5 px-3 text-center font-bold text-[#15803D]">{nextDayPlanning.targetTimeForStudy}</td>
                     </tr>
                     <tr>
                        <td className="py-2.5 px-3 font-semibold text-stone-700">Confidence for Tomorrow</td>
                        <td className="py-2.5 px-3 text-center font-bold text-[#15803D]">{nextDayPlanning.confidence}</td>
                     </tr>
                  </tbody>
               </table>
            </div>

            <div className="flex-1 bg-white border border-stone-200 rounded-lg p-4">
               <div className="flex items-center gap-2 mb-3 border-b border-stone-100 pb-2">
                  <CheckCircle2 className="w-4 h-4 text-stone-600" />
                  <h4 className="text-[10px] font-bold text-stone-700 uppercase tracking-widest">TOMORROW'S TOP PRIORITIES</h4>
               </div>
               <ul className="space-y-2">
                  {nextDayPlanning.priorities.map((item: string, idx: number) => (
                     <li key={idx} className="flex items-start gap-2 text-xs font-semibold text-stone-700">
                        <CheckCircle2 className="w-3 h-3 text-[#15803D] shrink-0 mt-0.5" /> {item}
                     </li>
                  ))}
               </ul>
            </div>
         </div>

         <div className="mt-4 bg-green-50 border border-green-100 p-3 rounded-lg flex gap-3 items-center">
            <Lightbulb className="w-5 h-5 text-green-600 shrink-0" />
            <p className="text-xs text-green-800 font-medium">Your planning is good. Follow your plan strictly and avoid distractions to maximize productivity.</p>
         </div>
      </div>
    </div>
  );
}

function Lightbulb(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
  );
}

function AlertCircle(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  );
}

function Star(props: any) {
   return (
     <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
   );
}
