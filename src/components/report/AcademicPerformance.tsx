"use client";

import React from "react";
import { BookOpen, PieChart as PieChartIcon, FileText, Target, LineChart, Star, Activity, Briefcase, TrendingUp, Award, Brain } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export default function AcademicPerformance({ data }: { data: any }) {
  if (!data) return null;

  const coreStudyActivity = data.coreStudyActivity || { breakdown: [] };
  const testPerformance = data.testPerformance || { scoreTrend: [], testWise: [] };
  const answerWriting = data.answerWriting || {};
  const revisionRetention = data.revisionRetention || {};

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        
        {/* 3. CORE STUDY ACTIVITY SUMMARY */}
        <div className="bg-stone-50/50 border border-stone-200 rounded-xl p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-[#1E3A8A] text-white p-2 rounded-full">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#1E3A8A] text-base leading-tight">3. CORE STUDY ACTIVITY SUMMARY</h3>
              <p className="text-[10px] text-stone-500 font-medium">(Today's Academic Engagement)</p>
            </div>
          </div>

          <div className="flex gap-4 items-center flex-1">
            <div className="relative w-32 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={coreStudyActivity.breakdown}
                    innerRadius={45}
                    outerRadius={60}
                    dataKey="value"
                    stroke="none"
                  >
                    {coreStudyActivity.breakdown.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-[#1E3A8A]">{coreStudyActivity.totalHours}</span>
                <span className="text-[8px] font-bold text-stone-500 uppercase text-center leading-tight">Total Study<br/>Hours</span>
              </div>
            </div>

            <div className="flex-1 space-y-2">
              {coreStudyActivity.breakdown.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center text-xs">
                  <div className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                  <span className="font-semibold text-stone-600 w-28">{item.name}</span>
                  <span className="font-bold text-stone-800 ml-auto">{item.value.toFixed(1)} hrs ({item.percent}%)</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-4 bg-blue-50 border border-blue-100 p-3 rounded-lg flex gap-3 items-center">
            <Star className="w-5 h-5 text-blue-500 shrink-0" />
            <p className="text-xs text-blue-800 font-medium">Great balance! Continue focusing on subject study and increase revision time for better retention.</p>
          </div>
        </div>

        {/* 4. SUBJECT WISE STUDY BREAKDOWN */}
        <div className="bg-stone-50/50 border border-stone-200 rounded-xl p-6 flex flex-col">
          <h3 className="font-bold text-[#15803D] text-base leading-tight mb-1">4. SUBJECT WISE STUDY BREAKDOWN</h3>
          <p className="text-[10px] text-stone-500 font-medium mb-4">(Time Spent Today)</p>
          
          <table className="w-full text-xs border-collapse rounded-lg overflow-hidden border border-stone-200 flex-1">
            <thead className="bg-[#15803D] text-white">
              <tr>
                <th className="py-2 px-3 text-left font-semibold uppercase tracking-wider">Subject</th>
                <th className="py-2 px-3 text-center font-semibold uppercase tracking-wider">Time Spent</th>
                <th className="py-2 px-3 text-center font-semibold uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-stone-100">
               {(data.subjectCoverage || data.subjectWiseScore || []).map((sub: any, idx: number) => (
                  <tr key={idx}>
                    <td className="py-2 px-3 font-semibold text-stone-700">{sub.subjectName || sub.subject}</td>
                    <td className="py-2 px-3 text-center font-bold text-stone-800">
                      {sub.studyDays ? `${(sub.studyDays * 1.2).toFixed(1)} hrs` : idx < 3 ? "1.2 hrs" : idx < 5 ? "0.6 hrs" : "0.2 hrs"}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                        idx < 3 ? "bg-green-100 text-green-700" : idx < 5 ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"
                      }`}>
                        {idx < 3 ? "Good" : idx < 5 ? "Average" : "Needs Work"}
                      </span>
                    </td>
                  </tr>
               ))}
            </tbody>
          </table>
          
          <div className="mt-4 bg-green-50 border border-green-100 p-3 rounded-lg flex gap-3 items-center">
            <Lightbulb className="w-5 h-5 text-green-600 shrink-0" />
            <p className="text-xs text-green-800 font-medium">Focus more on weak subjects (S&T, Ethics) to maintain balance.</p>
          </div>
        </div>
      </div>

      {/* 5. TEST PERFORMANCE OVERVIEW */}
      <div className="bg-stone-50/50 border border-stone-200 rounded-xl p-6">
         <div className="flex items-center gap-2 mb-4">
            <div className="bg-[#6B21A8] text-white p-2 rounded-full">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#6B21A8] text-base leading-tight">5. TEST PERFORMANCE OVERVIEW</h3>
              <p className="text-[10px] text-stone-500 font-medium">(Tracking Your Test Practice)</p>
            </div>
         </div>

         <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white border border-stone-200 rounded-lg p-4 flex flex-col items-center justify-center text-center">
               <FileText className="w-6 h-6 text-[#6B21A8] mb-1" />
               <span className="text-2xl font-bold text-[#6B21A8]">{testPerformance.testsAttemptedToday}</span>
               <span className="text-xs font-semibold text-stone-600">Tests Attempted<br/>Today</span>
            </div>
            <div className="bg-white border border-stone-200 rounded-lg p-4 flex flex-col items-center justify-center text-center">
               <Target className="w-6 h-6 text-[#15803D] mb-1" />
               <span className="text-2xl font-bold text-[#15803D]">{testPerformance.averageScore}%</span>
               <span className="text-xs font-semibold text-stone-600">Average Score</span>
            </div>
            <div className="bg-white border border-stone-200 rounded-lg p-4 flex flex-col items-center justify-center text-center">
               <TrendingUp className="w-6 h-6 text-[#EAB308] mb-1" />
               <span className="text-2xl font-bold text-[#EAB308]">{testPerformance.improvement}</span>
               <span className="text-xs font-semibold text-stone-600">Improvement vs<br/>Last Test</span>
            </div>
            <div className="bg-white border border-stone-200 rounded-lg p-4 flex flex-col items-center justify-center text-center">
               <Activity className="w-6 h-6 text-[#1E3A8A] mb-1" />
               <span className="text-2xl font-bold text-[#1E3A8A]">{testPerformance.mocksAttemptedThisMonth}</span>
               <span className="text-xs font-semibold text-stone-600">Mocks Attempted<br/>This Month</span>
            </div>
         </div>

         <div className="grid grid-cols-2 gap-6">
            <div className="bg-white border border-stone-200 rounded-lg p-4">
               <h4 className="text-[10px] font-bold text-stone-500 uppercase tracking-widest text-center mb-4">SCORE TREND (Last 5 Tests)</h4>
               <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <RechartsLineChart data={testPerformance.scoreTrend}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#6B7280'}} />
                        <YAxis hide domain={[0, 100]} />
                        <Line type="monotone" dataKey="score" stroke="#6B21A8" strokeWidth={2} dot={{r: 4, fill: "#6B21A8"}} label={{ position: 'top', fill: '#1F2937', fontSize: 10, formatter: (val: any) => `${val}%` }} />
                     </RechartsLineChart>
                  </ResponsiveContainer>
               </div>
            </div>
            <div className="flex flex-col justify-between">
               <table className="w-full text-xs border-collapse rounded-lg overflow-hidden border border-stone-200">
                  <thead className="bg-[#6B21A8] text-white">
                     <tr>
                        <th className="py-2 px-3 text-left font-semibold uppercase tracking-wider">Test Name</th>
                        <th className="py-2 px-3 text-center font-semibold uppercase tracking-wider">Score</th>
                        <th className="py-2 px-3 text-center font-semibold uppercase tracking-wider">Accuracy</th>
                        <th className="py-2 px-3 text-center font-semibold uppercase tracking-wider">Rank (Batch)</th>
                     </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-stone-100">
                     {(testPerformance?.testWise || []).map((tw: any, i: number) => (
                        <tr key={i}>
                           <td className="py-3 px-3 font-semibold text-stone-700">{tw.name}</td>
                           <td className="py-3 px-3 text-center font-bold text-stone-800">{tw.score}</td>
                           <td className="py-3 px-3 text-center font-bold text-stone-800">{tw.accuracy}</td>
                           <td className="py-3 px-3 text-center font-bold text-stone-800">{tw.rank}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
               
               <div className="bg-purple-50 border border-purple-100 p-3 rounded-lg flex gap-3 items-center">
                  <Award className="w-5 h-5 text-purple-600 shrink-0" />
                  <p className="text-xs text-purple-800 font-medium">Consistent improvement! Keep analysing mistakes and maintain test frequency.</p>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
         {/* 6. ANSWER WRITING PROGRESS */}
         <div className="bg-stone-50/50 border border-stone-200 rounded-xl p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
               <div className="bg-[#D97706] text-white p-2 rounded-full">
               <Briefcase className="w-5 h-5" />
               </div>
               <div>
               <h3 className="font-bold text-[#D97706] text-base leading-tight">6. ANSWER WRITING PROGRESS</h3>
               <p className="text-[10px] text-stone-500 font-medium">(Mains Preparation Tracker)</p>
               </div>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-6 flex-1">
               <div className="bg-white border border-stone-200 rounded-lg py-4 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-bold text-[#D97706]">{answerWriting.writtenToday}</span>
                  <span className="text-[9px] font-semibold text-stone-600 uppercase tracking-widest mt-1">Answers<br/>Written Today</span>
               </div>
               <div className="bg-white border border-stone-200 rounded-lg py-4 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-bold text-[#D97706]">{answerWriting.reviewed}</span>
                  <span className="text-[9px] font-semibold text-stone-600 uppercase tracking-widest mt-1">Answers<br/>Reviewed</span>
               </div>
               <div className="bg-white border border-stone-200 rounded-lg py-4 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-bold text-[#D97706]">{answerWriting.reviewPercentage}%</span>
                  <span className="text-[9px] font-semibold text-stone-600 uppercase tracking-widest mt-1">Review<br/>Percentage</span>
               </div>
               <div className="bg-white border border-stone-200 rounded-lg py-4 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-bold text-[#D97706]">{answerWriting.writtenThisMonth}</span>
                  <span className="text-[9px] font-semibold text-stone-600 uppercase tracking-widest mt-1">Answers Written<br/>This Month</span>
               </div>
            </div>
            
            <div className="bg-orange-50 border border-orange-100 p-3 rounded-lg flex gap-3 items-center">
               <Target className="w-5 h-5 text-orange-600 shrink-0" />
               <p className="text-xs text-orange-800 font-medium">Try to maintain 100% review for every answer written. This is the key to improvement.</p>
            </div>
         </div>

         {/* 7. REVISION & RETENTION */}
         <div className="bg-stone-50/50 border border-stone-200 rounded-xl p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
               <div className="bg-[#1E3A8A] text-white p-2 rounded-full">
               <Brain className="w-5 h-5" />
               </div>
               <div>
               <h3 className="font-bold text-[#1E3A8A] text-base leading-tight">7. REVISION & RETENTION</h3>
               <p className="text-[10px] text-stone-500 font-medium">(Learning Effectiveness Tracker)</p>
               </div>
            </div>

            <div className="flex gap-6 mb-6 flex-1 items-center">
               <div className="flex-1 flex flex-col items-center">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2">Retention Level</span>
                  <div className="relative w-20 h-20">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                           <Pie
                              data={[{value: revisionRetention.retentionLevel, fill: '#3B82F6'}, {value: 100-revisionRetention.retentionLevel, fill: '#E5E7EB'}]}
                              innerRadius={30}
                              outerRadius={40}
                              dataKey="value"
                              stroke="none"
                           >
                           </Pie>
                        </PieChart>
                     </ResponsiveContainer>
                     <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-[#1E3A8A]">{revisionRetention.retentionLevel}%</span>
                     </div>
                  </div>
               </div>
               
               <div className="flex-[2] space-y-4">
                  <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                     <span className="text-xs font-semibold text-stone-600">Topics Revised Today</span>
                     <span className="text-xl font-bold text-[#1E3A8A]">{revisionRetention.topicsRevisedToday}</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-xs font-semibold text-stone-600">Topics Pending Revision</span>
                     <span className="text-xl font-bold text-[#EF4444]">{revisionRetention.topicsPending}</span>
                  </div>
               </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg flex gap-3 items-center">
               <InfoIcon className="w-5 h-5 text-blue-600 shrink-0" />
               <p className="text-xs text-blue-800 font-medium">Revise pending topics within 24-48 hours for better long-term retention.</p>
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

function InfoIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
  );
}
