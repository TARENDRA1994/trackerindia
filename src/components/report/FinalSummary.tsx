"use client";

import React from "react";
import { CheckCircle2, Award, BookOpen, Clock, Target, Star, Trophy, ArrowRight, Heart, PenTool } from "lucide-react";

export default function FinalSummary({ data }: { data: any }) {
  if (!data || !data.finalSummary) return null;
  const fs = data.finalSummary;
  const metrics = fs.metrics;

  const getRingColor = (score: number) => {
    if (score >= 90) return "#15803D"; // Green Excellent
    if (score >= 75) return "#3B82F6"; // Blue Good
    if (score >= 60) return "#8B5CF6"; // Purple
    if (score >= 40) return "#F97316"; // Orange Average
    return "#EF4444"; // Red
  };

  return (
    <div className="space-y-6 flex flex-col min-h-[250mm]">
      
      {/* Top Banner / Heading */}
      <div className="text-center mb-6">
         <h2 className="text-[#1E3A8A] font-bold text-xl uppercase tracking-widest mb-2">FINAL SUMMARY & CONCLUSION</h2>
         <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-[1px] w-12 bg-stone-300"></div>
            <Star className="w-4 h-4 text-[#15803D]" />
            <div className="h-[1px] w-12 bg-stone-300"></div>
         </div>
         <p className="text-xs text-stone-500 font-medium">Your overall performance snapshot and way forward.</p>
      </div>

      {/* 5 Circular Metric Cards */}
      <div className="grid grid-cols-5 gap-4">
         {metrics.map((m: any, idx: number) => (
            <div key={idx} className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col items-center justify-between shadow-sm">
               <div className="text-[#15803D] mb-2">{m.icon === 'Target' ? <Target className="w-5 h-5"/> : m.icon === 'BookOpen' ? <BookOpen className="w-5 h-5"/> : m.icon === 'Clock' ? <Clock className="w-5 h-5"/> : m.icon === 'BarChart' ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10M18 20V4M6 20v-4"/></svg> : <Trophy className="w-5 h-5"/>}</div>
               <p className="text-[8px] font-bold text-[#1E3A8A] uppercase tracking-wider text-center mb-3 h-6">{m.label}</p>
               <div className="relative w-16 h-16 rounded-full border-[5px] flex flex-col items-center justify-center mb-2" style={{ borderColor: getRingColor(m.score) }}>
                  <span className="text-sm font-bold text-stone-800">{m.scoreText || `${m.score}%`}</span>
               </div>
               <span className="text-[10px] font-bold text-stone-600">{m.status}</span>
            </div>
         ))}
      </div>

      <div className="grid grid-cols-2 gap-6 flex-1">
         {/* KEY TAKEAWAYS */}
         <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm flex flex-col">
            <h3 className="font-bold text-[#15803D] text-[10px] uppercase tracking-widest mb-4">KEY TAKEAWAYS</h3>
            <ul className="space-y-4 mb-6 flex-1">
               {fs.takeaways.map((t: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 text-xs font-medium text-stone-700">
                     <div className="bg-[#15803D]/10 rounded-full p-1 mt-0.5 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
                     </div>
                     {t}
                  </li>
               ))}
            </ul>
            <div className="bg-stone-50 border border-stone-100 rounded-lg p-4 flex items-center gap-3">
               <Star className="w-5 h-5 text-[#15803D]" />
               <p className="text-xs font-bold text-[#15803D] leading-tight">Small consistent efforts every day lead to extraordinary results in UPSC.</p>
            </div>
         </div>

         {/* STRENGTHS & AREAS TO IMPROVE */}
         <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm flex flex-col">
            <div className="flex justify-between mb-4">
               <h3 className="font-bold text-[#15803D] text-[10px] uppercase tracking-widest relative">YOUR STRENGTHS <span className="absolute top-1/2 left-full ml-2 w-12 h-[1px] bg-stone-200 -translate-y-1/2"></span></h3>
               <h3 className="font-bold text-red-600 text-[10px] uppercase tracking-widest relative">AREAS TO IMPROVE <span className="absolute top-1/2 right-full mr-2 w-12 h-[1px] bg-stone-200 -translate-y-1/2"></span></h3>
            </div>
            
            <div className="flex gap-4 flex-1">
               {/* Strengths */}
               <div className="flex-1 space-y-4">
                  {fs.strengths.map((s: any, idx: number) => (
                     <div key={idx} className="flex gap-3 items-start">
                        <div className="bg-[#15803D]/10 p-2 rounded-md text-[#15803D] shrink-0">
                           {s.icon === 'Book' ? <BookOpen className="w-4 h-4"/> : s.icon === 'Chart' ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10M18 20V4M6 20v-4"/></svg> : s.icon === 'Target' ? <Target className="w-4 h-4"/> : <CheckCircle2 className="w-4 h-4"/>}
                        </div>
                        <div>
                           <p className="text-xs font-bold text-stone-800">{s.name}</p>
                           <p className="text-[10px] text-stone-500 leading-tight">{s.desc}</p>
                        </div>
                     </div>
                  ))}
               </div>
               
               <div className="w-[1px] bg-stone-100 h-full"></div>

               {/* Improvements */}
               <div className="flex-1 space-y-4">
                  {fs.improvements.map((i: any, idx: number) => (
                     <div key={idx} className="flex gap-3 items-start">
                        <div className="bg-red-50 p-2 rounded-md text-red-600 shrink-0">
                           {i.icon === 'Clipboard' ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg> : i.icon === 'Pen' ? <PenTool className="w-4 h-4"/> : <Clock className="w-4 h-4"/>}
                        </div>
                        <div>
                           <p className="text-xs font-bold text-stone-800">{i.name}</p>
                           <p className="text-[10px] text-stone-500 leading-tight">{i.desc}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* PERSONALIZED ACTION PLAN */}
         <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm flex flex-col">
            <h3 className="font-bold text-[#1E3A8A] text-[10px] uppercase tracking-widest mb-1">PERSONALIZED ACTION PLAN <span className="text-stone-400 capitalize normal-case text-[9px]">(Next 30 Days)</span></h3>
            <ul className="mt-4 space-y-2 flex-1">
               {fs.actionPlan.map((a: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-[10px] font-medium text-stone-700">
                     <CheckCircle2 className="w-3.5 h-3.5 text-[#1E3A8A] shrink-0 mt-0.5" />
                     {a}
                  </li>
               ))}
            </ul>
            <div className="mt-4 bg-[#1E3A8A]/5 p-3 rounded-lg border border-[#1E3A8A]/10 flex items-center justify-center gap-2">
               <Target className="w-4 h-4 text-[#1E3A8A]" />
               <p className="text-[10px] font-bold text-[#1E3A8A]">Follow this plan with full discipline to reach the Top 10%.</p>
            </div>
         </div>

         {/* YOUR PROGRESS JOURNEY */}
         <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm flex flex-col">
            <h3 className="font-bold text-[#1E3A8A] text-[10px] uppercase tracking-widest mb-6">YOUR PROGRESS JOURNEY</h3>
            
            <div className="flex items-center justify-between mb-8 px-4">
               {/* Step 1 */}
               <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-[#15803D]/10 text-[#15803D] flex items-center justify-center mb-2 relative z-10 border-2 border-white">
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22V12"/><path d="M12 12c-2-2-4-4-4-6"/><path d="M12 12c2-2 4-4 4-6"/></svg>
                  </div>
                  <p className="text-[9px] font-bold text-[#15803D] uppercase">START</p>
                  <p className="text-[8px] text-stone-500 text-center w-16 mt-1">Keep Building Good Habits</p>
               </div>
               
               <div className="flex-1 h-[2px] bg-[#1E3A8A]/20 relative -top-6">
                  <ArrowRight className="w-3 h-3 text-[#1E3A8A] absolute top-1/2 right-0 -translate-y-1/2 translate-x-1.5" />
               </div>

               {/* Step 2 */}
               <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center mb-2 relative z-10 border-2 border-white shadow-md">
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>
                  </div>
                  <p className="text-[9px] font-bold text-[#1E3A8A] uppercase">IMPROVE</p>
                  <p className="text-[8px] text-stone-500 text-center w-16 mt-1">Stay Consistent & Focused</p>
               </div>

               <div className="flex-1 h-[2px] bg-[#1E3A8A]/20 relative -top-6">
                  <ArrowRight className="w-3 h-3 text-[#1E3A8A] absolute top-1/2 right-0 -translate-y-1/2 translate-x-1.5" />
               </div>

               {/* Step 3 */}
               <div className="flex flex-col items-center opacity-50">
                  <div className="w-10 h-10 rounded-full bg-[#1E3A8A]/10 text-[#1E3A8A] flex items-center justify-center mb-2 relative z-10 border-2 border-white">
                     <Target className="w-5 h-5" />
                  </div>
                  <p className="text-[9px] font-bold text-[#1E3A8A] uppercase">PERFORM</p>
                  <p className="text-[8px] text-stone-500 text-center w-16 mt-1">Outperform Your Batch</p>
               </div>

               <div className="flex-1 h-[2px] bg-stone-200 relative -top-6">
                  <ArrowRight className="w-3 h-3 text-stone-300 absolute top-1/2 right-0 -translate-y-1/2 translate-x-1.5" />
               </div>

               {/* Step 4 */}
               <div className="flex flex-col items-center opacity-50">
                  <div className="w-10 h-10 rounded-full bg-[#EAB308]/10 text-[#EAB308] flex items-center justify-center mb-2 relative z-10 border-2 border-white">
                     <Trophy className="w-5 h-5" />
                  </div>
                  <p className="text-[9px] font-bold text-[#EAB308] uppercase">ACHIEVE</p>
                  <p className="text-[8px] text-stone-500 text-center w-16 mt-1">Reach Top 10% & Crack UPSC</p>
               </div>
            </div>

            <div className="mt-auto bg-stone-50 p-3 rounded-lg border border-stone-100 flex items-center gap-3">
               <Star className="w-4 h-4 text-[#1E3A8A] shrink-0" />
               <p className="text-[10px] font-bold text-[#1E3A8A] leading-tight">
                  Consistency today, success tomorrow.<br/>
                  <span className="font-medium text-stone-600">You are on the right path. Keep going!</span>
               </p>
            </div>
         </div>
      </div>

      {/* Quote Section */}
      <div className="bg-[#F8FAFC] border border-stone-200 rounded-xl p-6 shadow-sm flex items-center justify-center gap-6 mt-6">
         <div className="bg-white p-3 rounded-full shadow-sm border border-stone-100">
            <Trophy className="w-10 h-10 text-[#EAB308]" />
         </div>
         <div className="relative">
            <span className="absolute -top-4 -left-6 text-4xl text-[#1E3A8A]/20 font-serif">"</span>
            <div className="text-center">
               <h3 className="text-lg font-bold text-[#1E3A8A] mb-1">Believe in your journey.</h3>
               <p className="text-xs text-stone-600 mb-1">Every day of hard work brings you closer to your UPSC dream.</p>
               <p className="text-[11px] font-bold text-[#1E3A8A]">Stay focused. Stay consistent. Success is yours!</p>
            </div>
            <span className="absolute -bottom-6 -right-6 text-4xl text-[#1E3A8A]/20 font-serif">"</span>
         </div>
      </div>

      <div className="flex justify-between items-center bg-stone-50 px-4 py-2 rounded border border-stone-100 mt-2">
         <div className="flex items-center gap-2">
            <Heart className="w-3 h-3 text-[#15803D]" fill="#15803D" />
            <span className="text-[9px] text-stone-500 font-medium tracking-wide">We are proud of your progress. Keep pushing your limits. We are always with you in your UPSC journey.</span>
         </div>
         <span className="text-[9px] font-bold text-[#15803D]">- Mentorship India Team</span>
      </div>

    </div>
  );
}
