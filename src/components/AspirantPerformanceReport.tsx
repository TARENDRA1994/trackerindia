"use client";

import { useEffect, useState, useRef } from "react";
import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from "recharts";
import {
  Calendar, Printer, RefreshCw, ChevronRight, AlertCircle, Award
} from "lucide-react";

interface APRReportProps {
  studentId?: string;
}

export default function AspirantPerformanceReport({ studentId }: APRReportProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Default dates: last 30 days
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const [startDate, setStartDate] = useState(thirtyDaysAgo.toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(today.toISOString().split("T")[0]);
  const [preset, setPreset] = useState("30");

  const printAreaRef = useRef<HTMLDivElement>(null);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `/api/analytics/report?startDate=${startDate}&endDate=${endDate}`;
      if (studentId) {
        url += `&studentId=${studentId}`;
      }
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Unable to synthesize performance report metrics");
      }
      const reportData = await res.json();
      setData(reportData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [startDate, endDate, studentId]);

  const handlePresetChange = (val: string) => {
    setPreset(val);
    const end = new Date();
    const start = new Date();

    if (val === "30") {
      start.setDate(end.getDate() - 30);
    } else if (val === "60") {
      start.setDate(end.getDate() - 60);
    } else if (val === "feb25") {
      // 15-Jan-25 to 15-Feb-25 (like screenshot)
      setStartDate("2025-01-15");
      setEndDate("2025-02-15");
      return;
    } else if (val === "jan25") {
      setStartDate("2025-01-01");
      setEndDate("2025-01-31");
      return;
    } else {
      return; // custom
    }

    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading && !data) {
    return (
      <div className="p-20 text-center font-serif text-primary animate-pulse italic flex flex-col items-center gap-4">
        <RefreshCw className="w-8 h-8 animate-spin text-accent" />
        <span>Generating Aspirant Performance Report...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-12 bg-red-50 border border-red-200 text-center text-red-900 space-y-4">
        <AlertCircle className="w-12 h-12 text-red-600 mx-auto" />
        <h3 className="text-xl font-bold">Report Synthesis Interrupted</h3>
        <p className="text-sm">{error}</p>
        <button onClick={fetchReport} className="px-6 py-2 bg-primary text-white text-xs font-bold uppercase tracking-widest">
          Retry Report Run
        </button>
      </div>
    );
  }

  const { metadata, ranges, timeUtilization, emotionalStatus, dayCycle, dnaAndChallenges, subjectCoverage } = data;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "2-digit"
    }).replace(/ /g, "-");
  };

  const currentRangeStr = `${formatDate(ranges.current.start)} to ${formatDate(ranges.current.end)}`;
  const prevRangeStr = `${formatDate(ranges.previous.start)} to ${formatDate(ranges.previous.end)}`;

  // PIE CHART DATA (Current & Previous)
  const currentPieData = [
    { name: "Sleep Time %", value: timeUtilization.current.sleepPct, color: "#2563eb" },
    { name: "Study Time %", value: timeUtilization.current.studyPct, color: "#16a34a" },
    { name: "Free Time %", value: timeUtilization.current.freePct, color: "#dc2626" }
  ].filter(d => d.value > 0);

  const prevPieData = [
    { name: "Sleep Time %", value: timeUtilization.previous.sleepPct, color: "#2563eb" },
    { name: "Study Time %", value: timeUtilization.previous.studyPct, color: "#16a34a" },
    { name: "Free Time %", value: timeUtilization.previous.freePct, color: "#dc2626" }
  ].filter(d => d.value > 0);

  // EMOTIONAL STATUS DATA (Donut Chart)
  const emotionData = [
    { name: "Positive", value: emotionalStatus.counts.Positive, color: "#1e3a8a" },
    { name: "Exhausted", value: emotionalStatus.counts.Exhausted, color: "#eab308" },
    { name: "Confused", value: emotionalStatus.counts.Confused, color: "#22c55e" },
    { name: "Sad", value: emotionalStatus.counts.Sad, color: "#60a5fa" },
    { name: "Depressed", value: emotionalStatus.counts.Depressed, color: "#ec4899" }
  ].filter(d => d.value > 0);

  // DNA & Challenges Grouped Bar Chart
  const dnaChallengesData = [
    {
      name: "DNA Days",
      Previous: dnaAndChallenges.dna.previous,
      Current: dnaAndChallenges.dna.current
    },
    {
      name: "Total Challenges",
      Previous: dnaAndChallenges.challenges.previous,
      Current: dnaAndChallenges.challenges.current
    }
  ];

  return (
    <div className="space-y-6">
      {/* Controls: hidden during printing */}
      <div className="bg-white border border-stone-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden shadow-sm">
        <div className="flex items-center gap-3 flex-wrap">
          <Calendar className="w-5 h-5 text-primary" />
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Select APR Period:</span>
          
          <select
            value={preset}
            onChange={(e) => handlePresetChange(e.target.value)}
            className="p-2 border border-stone-300 text-xs font-bold bg-white text-stone-700 rounded-sm"
          >
            <option value="feb25">15-Jan-25 to 15-Feb-25 (Reference)</option>
            <option value="30">Last 30 Days</option>
            <option value="60">Last 60 Days</option>
            <option value="jan25">January 2025</option>
            <option value="custom">Custom Date Range</option>
          </select>

          {preset === "custom" && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="p-1.5 border border-stone-300 text-xs text-stone-700"
              />
              <span className="text-xs text-stone-400">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="p-1.5 border border-stone-300 text-xs text-stone-700"
              />
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={fetchReport}
            className="p-3 bg-stone-100 hover:bg-stone-200 text-stone-600 transition-all text-xs font-bold flex items-center gap-2 rounded-sm"
            title="Refresh Report Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handlePrint}
            className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-2 transition-all rounded-sm"
          >
            <Printer className="w-4 h-4" /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* PRINT STYLES SHEET */}
      <style jsx global>{`
        @media print {
          aside, header, nav, .print\\:hidden {
            display: none !important;
          }
          main {
            margin-left: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
          .print-page {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            background: white !important;
          }
          .page-break {
            page-break-before: always !important;
            break-before: page !important;
            margin-top: 40px !important;
          }
          body {
            background: white !important;
            color: black !important;
            font-size: 11px !important;
          }
        }
      `}</style>

      {/* Main Report Container */}
      <div ref={printAreaRef} className="print-page bg-white border border-stone-200 shadow-2xl p-10 md:p-14 max-w-[1200px] mx-auto text-black space-y-8 font-serif leading-relaxed">
        
        {/* ================= PAGE 1 ================= */}
        <div className="space-y-6">
          {/* Header Area */}
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end border-b-4 border-primary pb-4 gap-6">
            <div className="flex items-center gap-4">
              {/* Custom UPSC Mentorship Logo */}
              <div className="flex items-center gap-2">
                <svg width="60" height="60" viewBox="0 0 100 100" className="flex-shrink-0">
                  <path d="M 20 20 L 50 10 L 80 20 L 90 50 L 80 80 L 50 90 L 20 80 L 10 50 Z" fill="#1D0A69" />
                  <circle cx="50" cy="50" r="30" fill="#DAA520" />
                  <path d="M 35 60 L 50 30 L 65 60 Z" fill="white" />
                  <circle cx="50" cy="50" r="8" fill="#1D0A69" />
                </svg>
                <div>
                  <h2 className="text-3xl font-serif font-black tracking-tighter text-primary leading-tight">UPSC</h2>
                  <h3 className="text-2xl font-serif font-bold tracking-tight text-primary leading-none">Mentorship</h3>
                  <p className="text-[7px] uppercase font-bold tracking-[0.25em] text-stone-500 mt-1">A Unit of Mentorship India</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-primary italic">Aspirant Performance Report (APR)</h1>
              <h3 className="text-md md:text-lg font-serif font-bold text-primary mt-1">{currentRangeStr}</h3>
            </div>

            {/* Metadata Block */}
            <div className="border border-stone-300 p-3 bg-stone-50/50 text-[10px] font-bold uppercase tracking-wider space-y-1 self-stretch md:self-auto min-w-[220px]">
              <div className="flex justify-between gap-4">
                <span className="text-stone-500">Aspirant ID:</span>
                <span className="text-stone-800 font-mono">#{metadata.aspirantId.substring(0, 12).toUpperCase()}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-stone-500">Mentor Name:</span>
                <span className="text-stone-800">{metadata.mentorName}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-stone-500">Aspirant Name:</span>
                <span className="text-stone-800">{metadata.aspirantName}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-stone-500">Enrolled on:</span>
                <span className="text-stone-800">{new Date(metadata.enrolledOn).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>
            </div>
          </div>

          {/* Description & Key Points */}
          <div className="text-xs text-stone-700 space-y-3 border-b border-stone-200 pb-4">
            <p className="italic">This report aims to guide you in strategic preparation by providing insights based on your submitted information.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div>
                <span className="font-bold text-primary block">Key Points:</span>
                <ul className="list-disc pl-4 space-y-1 mt-1 text-[11px]">
                  <li><strong className="text-stone-800">Strategic Preparation:</strong> Use the data and insights to plan your next steps effectively.</li>
                  <li><strong className="text-stone-800">Accountability:</strong> Ensure that the information you provide is accurate and complete to make the most of the report.</li>
                  <li><strong className="text-stone-800">Continuous Improvement:</strong> Regularly review your progress and adjust your strategies accordingly.</li>
                </ul>
              </div>
              <div className="bg-stone-50/50 border border-stone-200 p-3 rounded-sm space-y-1">
                <span className="font-bold text-primary block">Feedback:</span>
                <p className="text-[11px]">We value your input! Please share your suggestions to enhance your learning experience at <a href="mailto:services@mentorshipindia.com" className="text-blue-600 underline">services@mentorshipindia.com</a></p>
                <p className="text-[11px] font-bold text-stone-800">Access Your DAT Form: <span className="text-primary underline cursor-pointer">Click Here</span></p>
                <p className="text-[10px] text-stone-500 italic">Remember to complete your DAT Form regularly to keep your progress up to date.</p>
              </div>
            </div>
          </div>

          {/* Core Performance Section 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2 items-start">
            
            {/* Current Period Utilization */}
            <div className="lg:col-span-4 border border-stone-200 p-4 rounded-sm flex flex-col justify-between h-full min-h-[350px]">
              <div>
                <h3 className="text-center font-bold text-primary text-xs uppercase tracking-wider border-b border-primary pb-2 mb-4">{currentRangeStr}</h3>
                <h4 className="text-center font-serif text-accent font-bold text-md italic mb-2">Current Time Utilization (24 Hrs)</h4>
                
                {/* Pie Chart */}
                <div className="h-44 flex justify-center items-center">
                  {currentPieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={currentPieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={0}
                          outerRadius={65}
                          dataKey="value"
                          label={({ name, value }) => `${(name || "").split(" ")[0]}: ${value}%`}
                        >
                          {currentPieData.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <span className="text-xs text-stone-300 italic">No Logs Submitted</span>
                  )}
                </div>
              </div>

              {/* Table */}
              <div className="mt-4">
                <table className="w-full text-center text-[10px] font-sans border-collapse">
                  <thead>
                    <tr className="bg-stone-50 text-[9px] font-bold text-stone-500 border-b border-stone-200">
                      <th className="py-1.5 border border-stone-200">Average Sleep</th>
                      <th className="py-1.5 border border-stone-200">Average Study</th>
                      <th className="py-1.5 border border-stone-200">Working</th>
                      <th className="py-1.5 border border-stone-200">Free Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="font-bold text-stone-800">
                      <td className="py-2 border border-stone-200 text-blue-600">{timeUtilization.current.sleep}h</td>
                      <td className="py-2 border border-stone-200 text-green-700">{timeUtilization.current.study}h</td>
                      <td className="py-2 border border-stone-200 text-stone-500">{timeUtilization.current.working}h</td>
                      <td className="py-2 border border-stone-200 text-red-600">{timeUtilization.current.free}h</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Previous Period Utilization */}
            <div className="lg:col-span-4 border border-stone-200 p-4 rounded-sm flex flex-col justify-between h-full min-h-[350px]">
              <div>
                <h3 className="text-center font-bold text-primary text-xs uppercase tracking-wider border-b border-primary pb-2 mb-4">{prevRangeStr}</h3>
                <h4 className="text-center font-serif text-accent font-bold text-md italic mb-2">Previous Time Utilization (24 Hrs)</h4>
                
                {/* Pie Chart */}
                <div className="h-44 flex justify-center items-center">
                  {prevPieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={prevPieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={0}
                          outerRadius={65}
                          dataKey="value"
                          label={({ name, value }) => `${(name || "").split(" ")[0]}: ${value}%`}
                        >
                          {prevPieData.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <span className="text-xs text-stone-300 italic">No Previous Period Logs</span>
                  )}
                </div>
              </div>

              {/* Table */}
              <div className="mt-4">
                <table className="w-full text-center text-[10px] font-sans border-collapse">
                  <thead>
                    <tr className="bg-stone-50 text-[9px] font-bold text-stone-500 border-b border-stone-200">
                      <th className="py-1.5 border border-stone-200">Average Sleep</th>
                      <th className="py-1.5 border border-stone-200">Average Study</th>
                      <th className="py-1.5 border border-stone-200">Working</th>
                      <th className="py-1.5 border border-stone-200">Free Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="font-bold text-stone-800">
                      <td className="py-2 border border-stone-200 text-blue-600">{timeUtilization.previous.sleep}h</td>
                      <td className="py-2 border border-stone-200 text-green-700">{timeUtilization.previous.study}h</td>
                      <td className="py-2 border border-stone-200 text-stone-500">{timeUtilization.previous.working}h</td>
                      <td className="py-2 border border-stone-200 text-red-600">{timeUtilization.previous.free}h</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Emotional Status (Donut Chart) */}
            <div className="lg:col-span-4 border border-stone-200 p-4 rounded-sm flex flex-col justify-between h-full min-h-[350px]">
              <div>
                <h3 className="text-center font-bold text-primary text-xs uppercase tracking-wider border-b border-primary pb-2 mb-4">{currentRangeStr}</h3>
                <h4 className="text-center font-serif text-accent font-bold text-md italic mb-2">Emotional Status</h4>
                
                {/* Donut Chart */}
                <div className="h-44 relative flex justify-center items-center">
                  {emotionData.length > 0 ? (
                    <>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={emotionData}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={65}
                            dataKey="value"
                            label={({ name, value }) => `${name || ""}: ${value}d`}
                          >
                            {emotionData.map((entry, idx) => (
                              <Cell key={`cell-${idx}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      
                      {/* Inside Ring Text */}
                      <div className="absolute text-center flex flex-col justify-center items-center">
                        <span className="text-[9px] uppercase tracking-wider font-bold text-green-600">OverAll</span>
                        <span className="text-sm font-bold text-stone-700 font-serif leading-none italic">{emotionalStatus.overall}</span>
                        <span className="text-xs font-mono font-bold text-stone-400 mt-1">{emotionalStatus.totalLogs} Logs</span>
                      </div>
                    </>
                  ) : (
                    <span className="text-xs text-stone-300 italic">No Logs Submitted</span>
                  )}
                </div>
              </div>

              {/* Legends list */}
              <div className="mt-4 flex flex-wrap gap-2 justify-center text-[8px] font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#1e3a8a] inline-block" /> Positive</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#eab308] inline-block" /> Exhausted</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#22c55e] inline-block" /> Confused</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#60a5fa] inline-block" /> Sad</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#ec4899] inline-block" /> Depressed</span>
              </div>
            </div>

          </div>
        </div>

        {/* ================= PAGE 2 (Page Break in Print) ================= */}
        <div className="page-break pt-8 border-t-2 border-stone-200 space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left side: Day Cycle bar chart */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="font-serif text-accent font-bold text-lg italic border-b border-stone-200 pb-2">Day Cycle</h3>
              
              <div className="h-[340px] w-full bg-stone-50/50 p-4 border border-stone-100">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dayCycle} margin={{ top: 10, right: 10, left: -25, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                    <XAxis dataKey="date" tick={{ fontSize: 7, fontWeight: 'bold' }} interval={0} angle={-45} textAnchor="end" dy={10} stroke="#444" />
                    <YAxis tick={{ fontSize: 8, fontWeight: 'bold' }} stroke="#444" domain={[0, 24]} ticks={[0, 5, 10, 15, 20, 25]} />
                    <Tooltip contentStyle={{ fontSize: 10, border: '1px solid #ccc' }} />
                    <Bar dataKey="Study" stackId="a" fill="#16a34a" />
                    <Bar dataKey="Sleep" stackId="a" fill="#2563eb" />
                    <Bar dataKey="Free" stackId="a" fill="#d97706" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Legends */}
              <div className="flex gap-6 justify-center text-[10px] font-sans font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 bg-[#d97706] inline-block" /> Free Time</span>
                <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 bg-[#2563eb] inline-block" /> Sleep Time</span>
                <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 bg-[#16a34a] inline-block" /> Study Time</span>
              </div>

              {/* Explanation Note */}
              <div className="text-[10px] text-stone-500 bg-stone-50 p-4 border border-stone-200 rounded-sm leading-relaxed space-y-2">
                <p>Your daily activities are categorized into four areas: study, sleep, work (whether you're a student or employed) and free time based on your DAT form submission.</p>
                <p className="font-bold text-red-600 italic">Note: Displaying "Free time as 24" indicates that either you have submitted 0 hours for study, sleep, and work or you have not submitted the form for that day.</p>
              </div>
            </div>

            {/* Right side: Subject Coverage table */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="font-serif text-accent font-bold text-lg italic border-b border-stone-200 pb-2">
                Subject Coverage ({ranges.current.days} Days)
              </h3>
              
              <div className="border border-stone-200 overflow-hidden shadow-inner max-h-[460px] overflow-y-auto bg-white">
                <table className="w-full text-left text-[11px] font-sans border-collapse">
                  <thead className="bg-[#1D0A69] text-white font-bold sticky top-0 uppercase tracking-wider text-[9px]">
                    <tr>
                      <th className="px-4 py-2.5 border-r border-white/20">Subject Name</th>
                      <th className="px-4 py-2.5 text-center border-r border-white/20">Total Days</th>
                      <th className="px-4 py-2.5 text-center">Study Days</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {subjectCoverage.map((row: any, index: number) => (
                      <tr 
                        key={row.subjectName} 
                        className={`${index % 2 === 0 ? "bg-white" : "bg-stone-50"} hover:bg-stone-100/60 transition-colors`}
                      >
                        <td className="px-4 py-2 border-r border-stone-200 font-medium text-stone-700">{row.subjectName}</td>
                        <td className="px-4 py-2 border-r border-stone-200 text-center font-mono text-stone-500">{row.totalDays}</td>
                        <td className={`px-4 py-2 text-center font-mono font-bold ${row.studyDays > 0 ? "text-green-700 bg-green-50/50" : "text-stone-400"}`}>
                          {row.studyDays}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* DNA & Challenges Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 items-center">
            
            {/* Bar chart comparison */}
            <div className="lg:col-span-6 space-y-4">
              <h3 className="font-serif text-accent font-bold text-lg italic border-b border-stone-200 pb-2">
                DNA (Current Affairs) & Challenges Completion
              </h3>

              <div className="h-[250px] w-full bg-stone-50/50 p-4 border border-stone-100">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dnaChallengesData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                    <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 'bold' }} stroke="#444" />
                    <YAxis tick={{ fontSize: 9, fontWeight: 'bold' }} stroke="#444" />
                    <Tooltip />
                    <Bar dataKey="Previous" fill="#8d7148" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="Current" fill="#1D0A69" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Legends */}
              <div className="flex gap-6 justify-center text-[10px] font-sans font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 bg-[#8d7148] inline-block" /> Previous Period</span>
                <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 bg-[#1D0A69] inline-block" /> Current Period</span>
              </div>
            </div>

            {/* Descriptions & Legends Details */}
            <div className="lg:col-span-6 space-y-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-stone-50 border border-stone-200 p-4 rounded-sm">
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider block">Previous Date Range</span>
                  <span className="text-xs font-serif font-bold text-[#8d7148] block mt-1">{prevRangeStr}</span>
                </div>
                <div className="bg-stone-50 border border-stone-200 p-4 rounded-sm">
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider block">Current Date Range</span>
                  <span className="text-xs font-serif font-bold text-[#1D0A69] block mt-1">{currentRangeStr}</span>
                </div>
              </div>

              <div className="space-y-4 text-xs text-stone-600 leading-relaxed border-l-4 border-accent pl-4">
                <span className="font-bold text-primary text-sm block">Understanding DNA & Challenges Completion:</span>
                <p>For each student, we track the number of days they engaged with two tasks:</p>
                <ul className="list-disc pl-4 space-y-2 text-[11px]">
                  <li><strong>Task A: DNA (Current Affairs):</strong> We track the number of days they read and studied current affairs topics.</li>
                  <li><strong>Task B: Challenge Completion (Self-assigned tasks):</strong> We analyze the number of days they accomplished their primary study targets over two distinct comparison periods.</li>
                </ul>
              </div>
            </div>

          </div>

          {/* Footer Area */}
          <div className="border-t border-stone-300 pt-6 text-center text-[9px] text-stone-400 font-sans tracking-widest uppercase flex flex-col md:flex-row justify-between gap-4">
            <span>UPSC Performance Report (APR) • System Log Generated</span>
            <span>Aunit of Mentorship India • Confidential Report Map</span>
          </div>

        </div>

      </div>
    </div>
  );
}
