import React from "react";
import { User, Calendar, Award } from "lucide-react";

export default function ReportHeader({
  studentName = "",
  mentorName = "",
  enrolledDate = "",
  reportDate = "",
  title = "",
  pageNumber = 1,
  totalPages = 1
}: {
  studentName: string;
  mentorName: string;
  enrolledDate: string;
  reportDate: string;
  title: string;
  pageNumber: number;
  totalPages: number;
}) {
  return (
    <div className="flex flex-col border-b-2 border-stone-800 pb-4 mb-6">
      <div className="flex justify-between items-start">
        {/* Logo Section */}
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center">
            {/* Custom TI Logo */}
            <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 20H55V35H40V90H25V35H10V20Z" fill="#1E3A8A"/>
              <path d="M70 40H85V90H70V40Z" fill="#1E3A8A"/>
              <circle cx="77.5" cy="22.5" r="10" fill="#F59E0B"/>
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#1E3A8A] leading-tight">TRACKER</h1>
            <h2 className="text-xl font-semibold text-[#1E3A8A] tracking-widest uppercase flex items-center gap-1">INDIA</h2>
            <p className="text-[9px] uppercase font-bold text-stone-400 tracking-[0.2em] mt-1">
              TRACK. ANALYZE. IMPROVE.
            </p>
          </div>
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-1 gap-2 text-xs font-bold text-stone-700 p-2 min-w-[300px]">
          <div className="flex items-center gap-4">
            <User className="w-4 h-4 text-[#1E3A8A]" />
            <span className="w-24 text-stone-800">Student Name</span>
            <span className="text-stone-800">: {studentName}</span>
          </div>
          <div className="flex items-center gap-4">
            <User className="w-4 h-4 text-[#1E3A8A]" />
            <span className="w-24 text-stone-800">Mentor Name</span>
            <span className="text-stone-800">: {mentorName}</span>
          </div>
          <div className="flex items-center gap-4">
            <Calendar className="w-4 h-4 text-[#1E3A8A]" />
            <span className="w-24 text-stone-800">Enrolled Date</span>
            <span className="text-stone-800">: {new Date(enrolledDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
          </div>
        </div>
        
        {/* Right Section / Report Date */}
        <div className="flex flex-col items-end justify-center bg-stone-50 p-4 rounded-md">
           <div className="flex items-center gap-2 text-stone-700 font-bold">
              <Calendar className="w-5 h-5 text-[#1E3A8A]" />
              <span>Report Date</span>
           </div>
           <span className="text-sm font-medium text-stone-600 mt-1">
              {new Date(reportDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
           </span>
           <span className="text-[10px] text-stone-500 font-medium">(Daily Report)</span>
        </div>
      </div>

      <div className="flex flex-col items-center mt-6">
        <h3 className="text-2xl font-bold text-[#1E3A8A] uppercase tracking-wide">{title}</h3>
        {pageNumber > 1 && (
          <p className="text-xs text-[#1E3A8A] font-semibold mt-1">Page {pageNumber} of {totalPages}</p>
        )}
      </div>
    </div>
  );
}
