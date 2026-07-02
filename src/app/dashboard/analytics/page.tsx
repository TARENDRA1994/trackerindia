"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import AspirantPerformanceReport from "@/components/AspirantPerformanceReport";
import { BarChart3, FileText } from "lucide-react";

export default function AnalyticsPage() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role || "STUDENT";
  const [activeTab, setActiveTab] = useState<"standard" | "report">("standard");

  return (
    <div className="space-y-8">
      {/* Header (Hidden when printing the report) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-6 print:hidden">
        <div>
          <h1 className="text-4xl font-serif font-bold text-primary italic">Aspirant Performance Review</h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Cold analysis of your consistency, academic growth, and time utilization.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-stone-100 p-1 rounded-sm border border-stone-200 self-start md:self-auto">
          <button
            onClick={() => setActiveTab("standard")}
            className={`flex items-center gap-2 px-6 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-all rounded-sm ${
              activeTab === "standard"
                ? "bg-white text-primary shadow-sm"
                : "text-stone-400 hover:text-stone-800"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Standard Dashboard
          </button>
          {role === "STUDENT" && (
            <button
              onClick={() => setActiveTab("report")}
              className={`flex items-center gap-2 px-6 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-all rounded-sm ${
                activeTab === "report"
                  ? "bg-white text-primary shadow-sm"
                  : "text-stone-400 hover:text-stone-800"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Performance Report (APR)
            </button>
          )}
        </div>
      </div>
      
      <div>
        {activeTab === "standard" ? (
          <div className="print:hidden">
            <AnalyticsDashboard />
          </div>
        ) : (
          <AspirantPerformanceReport />
        )}
      </div>
    </div>
  );
}
