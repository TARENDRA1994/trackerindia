import React from "react";
import { User, Calendar, Award } from "lucide-react";

export default function ReportHeader({
  studentName,
  mentorName,
  enrolledDate,
  reportDate,
  title,
  pageNumber,
  totalPages
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
          <div className="flex items-center justify-center w-12 h-12 bg-[#1E3A8A] text-white font-bold text-2xl rounded-sm">
            Ti
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#1E3A8A] leading-tight">TRACKER</h1>
            <h2 className="text-xl font-semibold text-[#F59E0B] tracking-widest uppercase">INDIA</h2>
            <p className="text-[10px] uppercase font-semibold text-stone-500 tracking-[0.2em] mt-1">
              TRACK. ANALYZE. IMPROVE.
            </p>
          </div>
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-1 gap-2 text-sm font-medium text-stone-700 bg-stone-50 p-4 rounded-md min-w-[300px]">
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-[#1E3A8A]" />
            <span className="w-24 text-stone-500 font-semibold">Student Name</span>
            <span>: {studentName}</span>
          </div>
          <div className="flex items-center gap-3">
            <Award className="w-4 h-4 text-[#1E3A8A]" />
            <span className="w-24 text-stone-500 font-semibold">Mentor Name</span>
            <span>: {mentorName}</span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-[#1E3A8A]" />
            <span className="w-24 text-stone-500 font-semibold">Enrolled Date</span>
            <span>: {new Date(enrolledDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
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
