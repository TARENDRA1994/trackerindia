"use client";

import React from "react";
import { EyeOff, Clock, Award, Compass, Brain, CheckCircle2, Trophy, Target } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

export default function ImprovementMap({ data }: { data: any }) {
  if (!data) return null;

  const { focusDistraction, timeUtilization, strengthWeakness, overallPreparationIndex } = data;

  const prepColor = (score: number) => {
    if (score >= 90) return "#15803D"; // Excellent
    if (score >= 75) return "#86EFAC"; // Very Good
    if (score >= 50) return "#EAB308"; // Good
    if (score >= 25) return "#F97316"; // Average
    return "#EF4444"; // Needs Improvement
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        
        {/* 16. FOCUS & DISTRACTION ANALYSIS */}
        <div className="bg-stone-50/50 border border-stone-200 rounded-xl p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-[#1E40AF] text-white p-2 rounded-full">
              <EyeOff className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#1E40AF] text-base leading-tight">16. FOCUS & DISTRACTION ANALYSIS</h3>
              <p className="text-[10px] text-stone-500 font-medium">(What Helps & What Hurts Your Focus)</p>
            </div>
          </div>

          <div className="flex gap-4 items-center mb-6">
             <div className="flex flex-col items-center flex-1">
               <span className="text-[10px] font-bold text-stone-700 mb-2">Focus Quality Distribution</span>
               <div className="relative w-28 h-28">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie
                           data={[
                              {value: focusDistraction.deepFocus, fill: '#15803D'},
                              {value: focusDistraction.moderateFocus, fill: '#3B82F6'},
                              {value: focusDistraction.lowFocus, fill: '#EAB308'},
                              {value: focusDistraction.veryLowFocus, fill: '#EF4444'}
                           ]}
                           innerRadius={35}
                           outerRadius={50}
                           dataKey="value"
                           stroke="none"
                        />
                     </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <span className="text-xl font-bold text-[#1E3A8A]">{focusDistraction.deepFocus}%</span>
                     <span className="text-[8px] font-bold text-[#15803D] uppercase">Good Focus</span>
                  </div>
               </div>
             </div>

             <div className="flex-1 space-y-2 text-[10px] font-semibold text-stone-600">
               <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-[#15803D] rounded-full"/> Deep Focus <span className="ml-auto font-bold text-stone-800">{focusDistraction.deepFocus}%</span></div>
               <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-[#3B82F6] rounded-full"/> Moderate Focus <span className="ml-auto font-bold text-stone-800">{focusDistraction.moderateFocus}%</span></div>
               <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-[#EAB308] rounded-full"/> Low Focus <span className="ml-auto font-bold text-stone-800">{focusDistraction.lowFocus}%</span></div>
               <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-[#EF4444] rounded-full"/> Very Low Focus <span className="ml-auto font-bold text-stone-800">{focusDistraction.veryLowFocus}%</span></div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4 flex-1">
             <div>
                <h4 className="text-[9px] font-bold text-[#15803D] uppercase tracking-widest flex items-center gap-1 mb-2"><CheckCircle2 className="w-3 h-3"/> Top 3 Things That Helped You Focus</h4>
                <ul className="space-y-1.5">
                   {focusDistraction.helpedFocus.map((item: string, idx: number) => (
                      <li key={idx} className="flex justify-between items-center text-[10px] font-semibold text-stone-700">
                         {idx + 1}. {item}
                         <div className="w-4 h-1 bg-[#15803D] rounded-full"></div>
                      </li>
                   ))}
                </ul>
             </div>
             <div>
                <h4 className="text-[9px] font-bold text-[#EF4444] uppercase tracking-widest flex items-center gap-1 mb-2"><EyeOff className="w-3 h-3"/> Top 3 Biggest Distractions</h4>
                <ul className="space-y-1.5">
                   {focusDistraction.distractions.map((item: any, idx: number) => (
                      <li key={idx} className="flex justify-between items-center text-[10px] font-semibold text-stone-700">
                         {idx + 1}. {item.name}
                         <div className={`w-4 h-1 rounded-full ${item.severity === 'High' ? 'bg-[#EF4444]' : 'bg-[#F59E0B]'}`}></div>
                      </li>
                   ))}
                </ul>
             </div>
          </div>
          
          <div className="mt-4 bg-blue-50 border border-blue-100 p-2.5 rounded-lg flex gap-2 items-center">
            <Lightbulb className="w-4 h-4 text-blue-600 shrink-0" />
            <p className="text-[10px] text-blue-800 font-medium">Try to reduce social media usage and overthinking.<br/>Use Pomodoro technique for better deep focus.</p>
          </div>
        </div>

        {/* 17. TIME UTILIZATION ANALYSIS */}
        <div className="bg-stone-50/50 border border-stone-200 rounded-xl p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-[#15803D] text-white p-2 rounded-full">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#15803D] text-base leading-tight">17. TIME UTILIZATION ANALYSIS</h3>
              <p className="text-[10px] text-stone-500 font-medium">(How Well You Use Your Study Time)</p>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
             <div className="flex flex-col items-center justify-center">
               <div className="w-24 h-24 rounded-full border-[6px] border-[#15803D] flex flex-col items-center justify-center bg-white shadow-inner">
                  <span className="text-2xl font-bold text-[#15803D]">{timeUtilization.effectiveTimePercentage}%</span>
                  <span className="text-[8px] font-bold text-[#15803D] uppercase text-center leading-tight mt-1">Effective<br/>Time</span>
               </div>
             </div>
             
             <div className="flex-1">
               <table className="w-full text-[10px] border-collapse rounded-lg overflow-hidden border border-stone-200">
                  <thead className="bg-[#15803D] text-white">
                     <tr>
                        <th className="py-1 px-2 text-left font-semibold uppercase tracking-wider">Time Category</th>
                        <th className="py-1 px-2 text-center font-semibold uppercase tracking-wider">Hours</th>
                        <th className="py-1 px-2 text-center font-semibold uppercase tracking-wider">% Of Time</th>
                     </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-stone-100 font-semibold">
                     {timeUtilization.categories.map((cat: any, i: number) => (
                        <tr key={i}>
                           <td className="py-1.5 px-2 text-stone-700" style={{ color: cat.color === '#EF4444' ? '#EF4444' : undefined }}>{cat.name}</td>
                           <td className="py-1.5 px-2 text-center text-stone-800" style={{ color: cat.color === '#EF4444' ? '#EF4444' : undefined }}>{cat.hrs} hrs</td>
                           <td className="py-1.5 px-2 text-center" style={{ color: cat.color }}>{cat.percent}%</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
             </div>
          </div>

          <h4 className="text-[9px] font-bold text-stone-500 uppercase tracking-widest text-center mb-1">Effective Study Hours Trend (Last 7 Days)</h4>
          <div className="h-20 w-full mb-4">
            <ResponsiveContainer width="100%" height="100%">
               <LineChart data={timeUtilization.trend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 8, fill: '#6B7280'}} />
                  <YAxis hide domain={[0, 'dataMax + 2']} />
                  <Line type="monotone" dataKey="hrs" stroke="#15803D" strokeWidth={2} dot={{r: 3, fill: "#15803D"}} label={{ position: 'top', fill: '#1F2937', fontSize: 9 }} />
               </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="bg-green-50 border border-green-100 p-2.5 rounded-lg flex gap-2 items-center">
            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
            <p className="text-[10px] text-green-800 font-medium">Your time utilization is good.<br/>Try to increase focused study time by 1–1.5 hrs daily.</p>
          </div>
        </div>
      </div>

      {/* 18. STRENGTH & WEAKNESS ANALYSIS */}
      <div className="bg-stone-50/50 border border-stone-200 rounded-xl p-6">
         <div className="flex items-center gap-2 mb-6">
            <div className="bg-[#B45309] text-white p-2 rounded-full">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#B45309] text-base leading-tight">18. STRENGTH & WEAKNESS ANALYSIS</h3>
              <p className="text-[10px] text-stone-500 font-medium">(Know Your Strong Areas & Areas to Improve)</p>
            </div>
         </div>

         <div className="flex gap-8 items-center mb-4">
            <div className="flex-1">
               <h4 className="text-xs font-bold text-[#15803D] uppercase tracking-widest mb-3">STRENGTHS <span className="text-[10px] text-stone-500 capitalize normal-case">(Keep Doing)</span></h4>
               <table className="w-full text-xs border-collapse rounded-lg overflow-hidden border border-stone-200">
                  <thead className="bg-[#f0fdf4]">
                     <tr>
                        <th className="py-2 px-3 text-left font-bold text-[#15803D] uppercase tracking-wider border-b border-green-200">Area</th>
                        <th className="py-2 px-3 text-center font-bold text-[#15803D] uppercase tracking-wider border-b border-green-200">Score</th>
                     </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-stone-100">
                     {strengthWeakness.strengths.map((item: any, i: number) => (
                        <tr key={i}>
                           <td className="py-2.5 px-3 font-semibold text-stone-700 flex items-center gap-2"><Trophy className="w-3.5 h-3.5 text-[#15803D]"/> {item.area}</td>
                           <td className="py-2.5 px-3 text-center font-bold text-[#15803D]">
                              <div className="flex items-center gap-2 justify-center">
                                 {item.score}% <div className="w-8 h-1.5 bg-[#15803D] rounded-full"></div>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>

            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center shrink-0 border border-purple-200">
               <Trophy className="w-6 h-6 text-[#9333EA]" />
            </div>

            <div className="flex-1">
               <h4 className="text-xs font-bold text-[#EF4444] uppercase tracking-widest mb-3">WEAK AREAS <span className="text-[10px] text-stone-500 capitalize normal-case">(Need More Focus)</span></h4>
               <table className="w-full text-xs border-collapse rounded-lg overflow-hidden border border-stone-200">
                  <thead className="bg-[#fef2f2]">
                     <tr>
                        <th className="py-2 px-3 text-left font-bold text-[#EF4444] uppercase tracking-wider border-b border-red-200">Area</th>
                        <th className="py-2 px-3 text-center font-bold text-[#EF4444] uppercase tracking-wider border-b border-red-200">Score</th>
                     </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-stone-100">
                     {strengthWeakness.weaknesses.map((item: any, i: number) => (
                        <tr key={i}>
                           <td className="py-2.5 px-3 font-semibold text-stone-700 flex items-center gap-2"><Target className="w-3.5 h-3.5 text-[#EF4444]"/> {item.area}</td>
                           <td className="py-2.5 px-3 text-center font-bold text-[#EF4444]">
                              <div className="flex items-center gap-2 justify-center">
                                 {item.score}% <div className="w-8 h-1.5 bg-[#EF4444] rounded-full"></div>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         <div className="bg-purple-50 border border-purple-100 p-3 rounded-lg flex gap-3 items-center">
            <Target className="w-5 h-5 text-purple-600 shrink-0" />
            <p className="text-xs text-purple-800 font-medium">Focus more on weak areas to balance your overall preparation.<br/>Allocate specific time slots for Science & Tech and Ethics.</p>
         </div>
      </div>

      {/* 19. OVERALL PREPARATION INDEX & AI INSIGHTS */}
      <div className="grid grid-cols-2 gap-6">
         <div className="col-span-2 bg-stone-50/50 border border-stone-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
               <div className="bg-[#D97706] text-white p-2 rounded-full">
               <Compass className="w-5 h-5" />
               </div>
               <div>
               <h3 className="font-bold text-[#D97706] text-base leading-tight">19. OVERALL PREPARATION INDEX</h3>
               <p className="text-[10px] text-stone-500 font-medium">(Your Overall UPSC Preparation Snapshot)</p>
               </div>
            </div>

            <div className="flex gap-6">
               <div className="flex flex-col items-center justify-center border-r border-stone-200 pr-6">
                  <div className="relative w-32 h-32 mb-2">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                           <Pie
                              data={[{value: overallPreparationIndex.overallScore, fill: prepColor(overallPreparationIndex.overallScore)}, {value: 100-overallPreparationIndex.overallScore, fill: '#F3F4F6'}]}
                              innerRadius={45}
                              outerRadius={60}
                              dataKey="value"
                              stroke="none"
                           />
                        </PieChart>
                     </ResponsiveContainer>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold" style={{ color: prepColor(overallPreparationIndex.overallScore) }}>{overallPreparationIndex.overallScore}%</span>
                        <span className="text-[9px] font-bold text-stone-500 uppercase mt-1 leading-tight text-center">Overall<br/>Index</span>
                     </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-[#15803D] rounded-full text-xs font-bold uppercase">{overallPreparationIndex.status}</span>
               </div>

               <div className="flex-[1.5]">
                  <table className="w-full text-[10px] border-collapse rounded-lg overflow-hidden border border-stone-200">
                     <thead className="bg-[#D97706] text-white">
                        <tr>
                           <th className="py-1.5 px-3 text-left font-semibold uppercase tracking-wider">Parameter</th>
                           <th className="py-1.5 px-3 text-center font-semibold uppercase tracking-wider">Score</th>
                           <th className="py-1.5 px-3 text-center font-semibold uppercase tracking-wider">Weightage</th>
                        </tr>
                     </thead>
                     <tbody className="bg-white divide-y divide-stone-100">
                        {overallPreparationIndex.parameters.map((p: any, i: number) => (
                           <tr key={i}>
                              <td className="py-1.5 px-3 font-semibold text-stone-700 flex items-center gap-1.5">
                                 <CheckCircle2 className="w-3 h-3 text-[#D97706]"/> {p.name}
                              </td>
                              <td className="py-1.5 px-3 text-center font-bold text-stone-800">{p.score}%</td>
                              <td className="py-1.5 px-3 text-center text-stone-500 font-medium">{p.weight}%</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>

               <div className="flex-[1.2] flex flex-col gap-4">
                  <div className="border border-stone-200 rounded-lg overflow-hidden">
                     <table className="w-full text-[9px]">
                        <thead className="bg-stone-100 text-stone-600">
                           <tr><th colSpan={2} className="py-1 text-center uppercase tracking-widest font-bold">Preparation Level</th></tr>
                        </thead>
                        <tbody className="bg-white font-semibold">
                           <tr><td className="py-1 px-2 border-r border-stone-100">90% - 100%</td><td className="py-1 px-2 text-center text-[#15803D]">Excellent</td></tr>
                           <tr><td className="py-1 px-2 border-r border-stone-100">75% - 89%</td><td className="py-1 px-2 text-center text-[#86EFAC]">Very Good</td></tr>
                           <tr className="bg-yellow-50"><td className="py-1 px-2 border-r border-stone-100">50% - 74%</td><td className="py-1 px-2 text-center text-[#EAB308]">Good ◀</td></tr>
                           <tr><td className="py-1 px-2 border-r border-stone-100">25% - 49%</td><td className="py-1 px-2 text-center text-[#F97316]">Average</td></tr>
                           <tr><td className="py-1 px-2 border-r border-stone-100">0% - 24%</td><td className="py-1 px-2 text-center text-[#EF4444]">Needs Improvement</td></tr>
                        </tbody>
                     </table>
                  </div>

                  <div className="border border-stone-200 rounded-lg p-2 bg-white flex flex-col items-center">
                     <h4 className="text-[9px] font-bold text-stone-500 uppercase tracking-widest mb-2">Exam Readiness Indicator</h4>
                     <div className="flex gap-4 w-full justify-around text-center">
                        <div>
                           <div className="w-10 h-10 rounded-full border-[3px] border-[#15803D] flex items-center justify-center font-bold text-[10px] text-[#1E3A8A] mx-auto">{overallPreparationIndex.readiness.prelims}%</div>
                           <p className="text-[8px] font-bold text-stone-600 mt-1 uppercase">Prelims</p>
                           <p className="text-[8px] font-bold text-[#15803D] uppercase">Good</p>
                        </div>
                        <div>
                           <div className="w-10 h-10 rounded-full border-[3px] border-[#F59E0B] flex items-center justify-center font-bold text-[10px] text-[#1E3A8A] mx-auto">{overallPreparationIndex.readiness.mains}%</div>
                           <p className="text-[8px] font-bold text-stone-600 mt-1 uppercase">Mains</p>
                           <p className="text-[8px] font-bold text-[#F59E0B] uppercase">Average</p>
                        </div>
                        <div>
                           <div className="w-10 h-10 rounded-full border-[3px] border-[#EF4444] flex items-center justify-center font-bold text-[10px] text-[#1E3A8A] mx-auto">{overallPreparationIndex.readiness.interview}%</div>
                           <p className="text-[8px] font-bold text-stone-600 mt-1 uppercase">Interview</p>
                           <p className="text-[8px] font-bold text-[#EF4444] uppercase">Average</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="mt-4 bg-orange-50 border border-orange-100 p-2.5 rounded-lg flex gap-2 items-center">
               <Star className="w-4 h-4 text-orange-500 shrink-0" />
               <p className="text-[10px] text-orange-800 font-medium leading-tight">Consistent efforts are giving good results. Maintain discipline and improve weak areas.</p>
            </div>
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
