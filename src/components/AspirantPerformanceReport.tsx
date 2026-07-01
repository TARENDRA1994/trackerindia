"use client";

import { useEffect, useState, useRef } from "react";
import { Calendar, Printer, RefreshCw, AlertCircle } from "lucide-react";

import ReportHeader from "@/components/report/ReportHeader";
import PerformanceMatrix from "@/components/report/PerformanceMatrix";
import AcademicPerformance from "@/components/report/AcademicPerformance";
import WellBeingConsistency from "@/components/report/WellBeingConsistency";
import PerformanceInsights from "@/components/report/PerformanceInsights";
import ImprovementMap from "@/components/report/ImprovementMap";

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
      <div className="p-20 text-center font-serif text-[#1E3A8A] animate-pulse italic flex flex-col items-center gap-4">
        <RefreshCw className="w-8 h-8 animate-spin" />
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
        <button onClick={fetchReport} className="px-6 py-2 bg-[#1E3A8A] text-white text-xs font-bold uppercase tracking-widest">
          Retry Report Run
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-stone-100 min-h-screen py-10 print:bg-white print:py-0">
      {/* Controls: hidden during printing */}
      <div className="bg-white border border-stone-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden shadow-sm max-w-5xl mx-auto">
        <div className="flex items-center gap-3 flex-wrap">
          <Calendar className="w-5 h-5 text-[#1E3A8A]" />
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
            className="px-6 py-3 bg-[#1E3A8A] hover:bg-[#1e3a8a]/90 text-white font-bold uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-2 transition-all rounded-sm"
          >
            <Printer className="w-4 h-4" /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* Global Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background-color: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .page-break-after {
            page-break-after: always;
            break-after: page;
          }
          @page {
            size: A4 portrait;
            margin: 0;
          }
        }
      `}</style>

      {/* Report Pages Container */}
      <div className="max-w-[210mm] mx-auto space-y-10 print:space-y-0 text-black">
        
        {/* PAGE 1: DAILY PERFORMANCE SUMMARY */}
        <div className="bg-white w-[210mm] min-h-[297mm] shadow-xl mx-auto p-12 print:shadow-none print:p-8 page-break-after">
          <ReportHeader 
            studentName={data.metadata.aspirantName}
            mentorName={data.metadata.mentorName}
            enrolledDate={data.metadata.enrolledOn}
            reportDate={new Date().toISOString()}
            title="DAILY PERFORMANCE SUMMARY"
            pageNumber={1}
            totalPages={5}
          />
          <PerformanceMatrix data={data} />
          
          <div className="mt-12 flex items-center gap-2 text-stone-400">
            <div className="bg-stone-200 p-1 rounded-full"><div className="w-3 h-3 bg-stone-400 rounded-full"/></div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500">TRACKER INDIA</p>
              <p className="text-[9px] font-medium">Empowering UPSC Aspirants</p>
            </div>
            <div className="ml-auto text-[10px] font-bold uppercase text-[#1E3A8A]">Page 1 of 5</div>
          </div>
        </div>

        {/* PAGE 2: STUDY PROGRESS & ACADEMIC PERFORMANCE */}
        <div className="bg-white w-[210mm] min-h-[297mm] shadow-xl mx-auto p-12 print:shadow-none print:p-8 page-break-after flex flex-col">
          <ReportHeader 
            studentName={data.metadata.aspirantName}
            mentorName={data.metadata.mentorName}
            enrolledDate={data.metadata.enrolledOn}
            reportDate={new Date().toISOString()}
            title="STUDY PROGRESS & ACADEMIC PERFORMANCE"
            pageNumber={2}
            totalPages={5}
          />
          <div className="flex-1">
             <AcademicPerformance data={data} />
          </div>
          
          <div className="mt-12 flex items-center gap-2 text-stone-400">
            <div className="bg-stone-200 p-1 rounded-full"><div className="w-3 h-3 bg-stone-400 rounded-full"/></div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500">TRACKER INDIA</p>
              <p className="text-[9px] font-medium">Empowering UPSC Aspirants</p>
            </div>
            <div className="ml-auto text-[10px] font-bold uppercase text-[#1E3A8A]">Page 2 of 5</div>
          </div>
        </div>

        {/* PAGE 3: HABITS, WELL-BEING & CONSISTENCY ANALYSIS */}
        <div className="bg-white w-[210mm] min-h-[297mm] shadow-xl mx-auto p-12 print:shadow-none print:p-8 page-break-after flex flex-col">
          <ReportHeader 
            studentName={data.metadata.aspirantName}
            mentorName={data.metadata.mentorName}
            enrolledDate={data.metadata.enrolledOn}
            reportDate={new Date().toISOString()}
            title="HABITS, WELL-BEING & CONSISTENCY ANALYSIS"
            pageNumber={3}
            totalPages={5}
          />
          <div className="flex-1">
             <WellBeingConsistency data={data} />
          </div>
          
          <div className="mt-12 flex items-center gap-2 text-stone-400">
            <div className="bg-stone-200 p-1 rounded-full"><div className="w-3 h-3 bg-stone-400 rounded-full"/></div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500">TRACKER INDIA</p>
              <p className="text-[9px] font-medium">Empowering UPSC Aspirants</p>
            </div>
            <div className="ml-auto text-[10px] font-bold uppercase text-[#1E3A8A]">Page 3 of 5</div>
          </div>
        </div>

        {/* PAGE 4: DETAILED PERFORMANCE INSIGHTS */}
        <div className="bg-white w-[210mm] min-h-[297mm] shadow-xl mx-auto p-12 print:shadow-none print:p-8 page-break-after flex flex-col">
          <ReportHeader 
            studentName={data.metadata.aspirantName}
            mentorName={data.metadata.mentorName}
            enrolledDate={data.metadata.enrolledOn}
            reportDate={new Date().toISOString()}
            title="DETAILED PERFORMANCE INSIGHTS"
            pageNumber={4}
            totalPages={5}
          />
          <div className="flex-1">
             <PerformanceInsights data={data} />
          </div>
          
          <div className="mt-12 flex items-center gap-2 text-stone-400">
            <div className="bg-stone-200 p-1 rounded-full"><div className="w-3 h-3 bg-stone-400 rounded-full"/></div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500">TRACKER INDIA</p>
              <p className="text-[9px] font-medium">Empowering UPSC Aspirants</p>
            </div>
            <div className="ml-auto text-[10px] font-bold uppercase text-[#1E3A8A]">Page 4 of 5</div>
          </div>
        </div>

        {/* PAGE 5: DETAILED ANALYSIS & IMPROVEMENT MAP */}
        <div className="bg-white w-[210mm] min-h-[297mm] shadow-xl mx-auto p-12 print:shadow-none print:p-8 page-break-after flex flex-col">
          <ReportHeader 
            studentName={data.metadata.aspirantName}
            mentorName={data.metadata.mentorName}
            enrolledDate={data.metadata.enrolledOn}
            reportDate={new Date().toISOString()}
            title="DETAILED ANALYSIS & IMPROVEMENT MAP"
            pageNumber={5}
            totalPages={5}
          />
          <div className="flex-1">
             <ImprovementMap data={data} />
          </div>
          
          <div className="mt-12 flex items-center gap-2 text-stone-400">
            <div className="bg-stone-200 p-1 rounded-full"><div className="w-3 h-3 bg-stone-400 rounded-full"/></div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500">TRACKER INDIA</p>
              <p className="text-[9px] font-medium">Empowering UPSC Aspirants</p>
            </div>
            <div className="ml-auto text-[10px] font-bold uppercase text-[#1E3A8A]">Page 5 of 5</div>
          </div>
        </div>

      </div>
    </div>
  );
}
