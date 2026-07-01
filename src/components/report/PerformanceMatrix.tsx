"use client";

import React from "react";
import { Target, TrendingUp, Star, Award, Clock, Moon, CheckCircle2, HeartPulse, Lightbulb, Brain, Sun } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function PerformanceMatrix({ data }: { data: any }) {
  if (!data) return null;

  const studyPerformanceMatrix = data.studyPerformanceMatrix || {};
  const dailyRoutineAnalysis = data.dailyRoutineAnalysis || {};
  const focusDistraction = data.focusDistraction || { distractions: [] };

  // Colors
  const scoreColor = (score: number) => {
    if (score >= 80) return "#15803D"; // Green
    if (score >= 60) return "#EAB308"; // Yellow
    if (score >= 40) return "#F97316"; // Orange
    return "#EF4444"; // Red
  };

  const matrixData = [
    { name: "Score", value: studyPerformanceMatrix.percentage, fill: scoreColor(studyPerformanceMatrix.percentage) },
    { name: "Remaining", value: 100 - studyPerformanceMatrix.percentage, fill: "#F3F4F6" }
  ];

  const routineData = [
    { name: "Score", value: dailyRoutineAnalysis.percentage, fill: scoreColor(dailyRoutineAnalysis.percentage) },
    { name: "Remaining", value: 100 - dailyRoutineAnalysis.percentage, fill: "#F3F4F6" }
  ];

  return (
    <div className="space-y-6">
      {/* 1. STUDY PERFORMANCE MATRIX */}
      <div className="bg-stone-50/50 border border-stone-200 rounded-xl p-6">
        <div className="flex gap-8">
          {/* Left Chart */}
          <div className="flex-1 flex flex-col items-center">
            <div className="flex items-center gap-2 self-start mb-4">
              <div className="bg-[#1E3A8A] text-white p-2 rounded-full">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[#1E3A8A] text-lg leading-tight">1. STUDY PERFORMANCE MATRIX</h3>
                <p className="text-xs text-stone-500 font-medium">(Based on Focus Level + Study Effectiveness)</p>
              </div>
            </div>
            
            <div className="relative w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={matrixData}
                    innerRadius={65}
                    outerRadius={85}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                  >
                    {matrixData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-[#1E3A8A]">{studyPerformanceMatrix.percentage}%</span>
                <span className="text-xs font-bold text-[#15803D] uppercase">{studyPerformanceMatrix.overallStatus.split(' ')[0]}</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-stone-700 mt-4 text-center">
              You are focused and studying effectively.<br/>Keep up the good momentum!
            </p>
          </div>

          {/* Right Table */}
          <div className="flex-1">
            <table className="w-full text-sm border-collapse rounded-lg overflow-hidden border border-stone-200 shadow-sm">
              <thead className="bg-[#1E3A8A] text-white">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold uppercase tracking-wider text-xs w-1/2">Metric</th>
                  <th className="py-3 px-4 text-center font-semibold uppercase tracking-wider text-xs">Today</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-stone-100">
                <tr>
                  <td className="py-4 px-4 font-semibold text-stone-700 flex items-center gap-3">
                    <Target className="w-4 h-4 text-[#1E3A8A]" /> Focus Level
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-[#EAB308]">{studyPerformanceMatrix.focusLevel}</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold text-stone-700 flex items-center gap-3">
                    <TrendingUp className="w-4 h-4 text-[#1E3A8A]" /> Study Effectiveness
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-[#15803D]">{studyPerformanceMatrix.studyEffectiveness}</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold text-stone-700 flex items-center gap-3">
                    <Star className="w-4 h-4 text-[#1E3A8A]" /> Performance Rating
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-[#1E3A8A]">{studyPerformanceMatrix.performanceRating} / 100</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold text-stone-700 flex items-center gap-3">
                    <Award className="w-4 h-4 text-[#1E3A8A]" /> Overall Status
                  </td>
                  <td className="py-4 px-4 text-center">
                     <span className="bg-green-100 text-[#15803D] px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider">
                        {studyPerformanceMatrix.overallStatus}
                     </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 2. DAILY ROUTINE ANALYSIS */}
      <div className="bg-stone-50/50 border border-stone-200 rounded-xl p-6">
        <div className="flex gap-8">
          {/* Left Chart */}
          <div className="flex-1 flex flex-col items-center">
            <div className="flex items-center gap-2 self-start mb-4">
              <div className="bg-[#15803D] text-white p-2 rounded-full">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[#15803D] text-lg leading-tight">2. DAILY ROUTINE ANALYSIS</h3>
                <p className="text-xs text-stone-500 font-medium">(Based on Wake-up Time + Sleep Duration)</p>
              </div>
            </div>
            
            <div className="relative w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={routineData}
                    innerRadius={65}
                    outerRadius={85}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                  >
                    {routineData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-[#15803D]">{dailyRoutineAnalysis.percentage}%</span>
                <span className="text-xs font-bold text-[#15803D] uppercase">EXCELLENT</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-stone-700 mt-4 text-center">
              Your routine is healthy and consistent.<br/>Maintain this for better long-term results!
            </p>
          </div>

          {/* Right Table */}
          <div className="flex-1">
            <table className="w-full text-sm border-collapse rounded-lg overflow-hidden border border-stone-200 shadow-sm">
              <thead className="bg-[#15803D] text-white">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold uppercase tracking-wider text-xs w-1/2">Habit</th>
                  <th className="py-3 px-4 text-center font-semibold uppercase tracking-wider text-xs">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-stone-100">
                <tr>
                  <td className="py-4 px-4 font-semibold text-stone-700 flex items-center gap-3">
                    <Sun className="w-4 h-4 text-[#15803D]" /> Wake-up Time
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-[#1E3A8A]">{dailyRoutineAnalysis.wakeUpTime}</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold text-stone-700 flex items-center gap-3">
                    <Moon className="w-4 h-4 text-[#15803D]" /> Sleep Duration
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-[#15803D]">{dailyRoutineAnalysis.sleepDuration}</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold text-stone-700 flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#15803D]" /> Routine Discipline
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-[#15803D]">{dailyRoutineAnalysis.routineDiscipline}</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold text-stone-700 flex items-center gap-3">
                    <HeartPulse className="w-4 h-4 text-[#15803D]" /> Biological Routine
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-[#1E3A8A]">{dailyRoutineAnalysis.biologicalRoutine}</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold text-stone-700 flex items-center gap-3">
                    <Lightbulb className="w-4 h-4 text-[#15803D]" /> Recommendation
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-[#15803D]">Maintain Current Routine</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Highlights & AI Insight */}
      <div className="grid grid-cols-2 gap-6 pt-4">
        <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-[#F59E0B] text-white p-1.5 rounded-full">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-[#D97706] uppercase tracking-wider text-sm">Today's Highlights</h4>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start gap-2 text-sm font-semibold text-stone-700">
               <CheckCircle2 className="w-5 h-5 text-[#15803D] shrink-0" /> Healthy Morning Routine
            </li>
            <li className="flex items-start gap-2 text-sm font-semibold text-stone-700">
               <CheckCircle2 className="w-5 h-5 text-[#15803D] shrink-0" /> Good Study Effectiveness
            </li>
            <li className="flex items-start gap-2 text-sm font-semibold text-stone-700">
               <CheckCircle2 className="w-5 h-5 text-[#15803D] shrink-0" /> Consistent Focus
            </li>
            <li className="flex items-start gap-2 text-sm font-semibold text-stone-700">
               <CheckCircle2 className="w-5 h-5 text-[#15803D] shrink-0" /> Continue Maintaining Momentum
            </li>
          </ul>
        </div>
        
        <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-[#1E40AF] text-white p-1.5 rounded-full">
              <Brain className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-[#1E40AF] uppercase tracking-wider text-sm">AI Insight</h4>
          </div>
          <p className="text-sm font-medium text-stone-700 leading-relaxed">
            Your routine is consistent and your study effectiveness is above average. Maintaining this pattern can significantly improve your overall preparation quality. Focus on maintaining a balanced schedule and utilizing active recall methods to boost retention further.
          </p>
        </div>
      </div>
    </div>
  );
}

// Simple Sun Icon wrapper
function Sun(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}
