"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Printer, Loader2 } from "lucide-react";
import ReportHeader from "@/components/report/ReportHeader";
import PerformanceMatrix from "@/components/report/PerformanceMatrix";
import AcademicPerformance from "@/components/report/AcademicPerformance";
import WellBeingConsistency from "@/components/report/WellBeingConsistency";
import PerformanceInsights from "@/components/report/PerformanceInsights";
import ImprovementMap from "@/components/report/ImprovementMap";

export default function APRReportPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics/report")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-[#1E3A8A]" />
        <p className="mt-4 text-stone-500 font-serif italic">Generating APR Report...</p>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-stone-100 min-h-screen py-10 print:bg-white print:py-0">
      
      {/* Controls (Hidden on Print) */}
      <div className="max-w-5xl mx-auto mb-6 flex justify-between items-center print:hidden px-4">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-bold uppercase tracking-widest text-xs">Back to Profile</span>
        </button>
        <button 
          onClick={handlePrint}
          className="bg-[#1E3A8A] text-white px-6 py-2 rounded font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-[#1e3a8a]/90 transition-all shadow-md"
        >
          <Printer className="w-4 h-4" />
          Export PDF
        </button>
      </div>

      {/* Report Pages Container */}
      <div className="max-w-[210mm] mx-auto space-y-10 print:space-y-0">
        
        {/* PAGE 1: DAILY PERFORMANCE SUMMARY */}
        <div className="bg-white w-[210mm] min-h-[297mm] shadow-xl mx-auto p-12 print:shadow-none print:p-8 page-break-after">
          <ReportHeader 
            studentName={data?.metadata?.aspirantName || "Student"}
            mentorName={data?.metadata?.mentorName || "Unassigned"}
            enrolledDate={data?.metadata?.enrolledOn || ""}
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
            studentName={data?.metadata?.aspirantName || "Student"}
            mentorName={data?.metadata?.mentorName || "Unassigned"}
            enrolledDate={data?.metadata?.enrolledOn || ""}
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
            studentName={data?.metadata?.aspirantName || "Student"}
            mentorName={data?.metadata?.mentorName || "Unassigned"}
            enrolledDate={data?.metadata?.enrolledOn || ""}
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
    </div>
  );
}
