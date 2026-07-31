"use client";

import { useState } from "react";
import { Mail, Loader2, CheckCircle2, AlertCircle, ChevronDown, Users, GraduationCap, ShieldCheck, X } from "lucide-react";

type BroadcastResult = {
  message: string;
  sent: number;
  failed: number;
  total: number;
  failures: { name: string; email: string; reason: string }[];
};

export default function BroadcastButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [targetRole, setTargetRole] = useState<"ALL" | "STUDENT" | "MENTOR">("ALL");
  const [result, setResult] = useState<BroadcastResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const roleOptions = [
    { value: "ALL", label: "All Users", icon: Users },
    { value: "STUDENT", label: "Students Only", icon: GraduationCap },
    { value: "MENTOR", label: "Mentors Only", icon: ShieldCheck },
  ] as const;

  const handleBroadcast = async () => {
    const selected = roleOptions.find(r => r.value === targetRole);
    if (!confirm(`Send daily reminder email to ${selected?.label}?\n\nThis will dispatch an email to all active ${selected?.label.toLowerCase()} via AWS SES.`)) {
      return;
    }

    setIsLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: targetRole }),
      });
      const data = await res.json();

      if (res.ok) {
        setResult(data);
        setShowResult(true);
      } else {
        alert(`Error: ${data.error || "Failed to broadcast"}`);
      }
    } catch (error) {
      alert("An unexpected error occurred. Check server logs.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Broadcast Controls */}
      <div className="space-y-2">
        {/* Role Selector */}
        <div className="relative">
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value as any)}
            disabled={isLoading}
            className="w-full py-3 px-4 pr-8 bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-widest appearance-none cursor-pointer hover:bg-white/20 transition-all disabled:opacity-50 focus:outline-none"
          >
            {roleOptions.map(o => (
              <option key={o.value} value={o.value} className="bg-primary text-white">
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/60 pointer-events-none" />
        </div>

        {/* Send Button */}
        <button
          onClick={handleBroadcast}
          disabled={isLoading}
          className="w-full py-4 bg-white/10 border border-white/20 hover:bg-white/20 text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Sending Emails...</>
          ) : (
            <><Mail className="w-4 h-4" /> Broadcast Daily Reminder</>
          )}
        </button>

        {/* Quick result badge (inline) */}
        {result && !showResult && (
          <button
            onClick={() => setShowResult(true)}
            className="w-full py-2 bg-white/10 text-[10px] font-bold uppercase tracking-widest text-white/80 flex items-center justify-center gap-2 hover:bg-white/20 transition-all"
          >
            {result.failed === 0
              ? <><CheckCircle2 className="w-3 h-3 text-emerald-400" /> {result.sent} Sent · All OK</>
              : <><AlertCircle className="w-3 h-3 text-amber-400" /> {result.sent} Sent · {result.failed} Failed · View</>
            }
          </button>
        )}
      </div>

      {/* Result Modal */}
      {showResult && result && (
        <div className="fixed inset-0 bg-stone-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            {/* Modal Header */}
            <div className={`p-6 flex items-center justify-between ${result.failed === 0 ? "bg-emerald-600" : "bg-amber-600"} text-white`}>
              <div className="flex items-center gap-3">
                {result.failed === 0
                  ? <CheckCircle2 className="w-6 h-6" />
                  : <AlertCircle className="w-6 h-6" />
                }
                <div>
                  <p className="font-bold text-sm uppercase tracking-widest">Broadcast Complete</p>
                  <p className="text-white/80 text-xs mt-0.5">{result.message}</p>
                </div>
              </div>
              <button onClick={() => setShowResult(false)} className="p-1 hover:bg-white/20 rounded transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 divide-x divide-stone-100 border-b border-stone-100">
              <div className="p-6 text-center">
                <p className="text-3xl font-bold text-stone-800">{result.total}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mt-1">Total</p>
              </div>
              <div className="p-6 text-center">
                <p className="text-3xl font-bold text-emerald-600">{result.sent}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mt-1">Sent ✓</p>
              </div>
              <div className="p-6 text-center">
                <p className="text-3xl font-bold text-rose-600">{result.failed}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mt-1">Failed ✗</p>
              </div>
            </div>

            {/* Failure List */}
            {result.failures.length > 0 && (
              <div className="max-h-64 overflow-y-auto">
                <div className="px-6 py-3 bg-stone-50 border-b border-stone-100">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Failed Recipients</p>
                </div>
                {result.failures.map((f, i) => (
                  <div key={i} className="px-6 py-4 border-b border-stone-50 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-stone-800 text-sm">{f.name}</p>
                      <p className="text-stone-400 text-xs font-medium">{f.email}</p>
                    </div>
                    <span className="text-rose-500 text-xs font-medium text-right shrink-0 max-w-[160px]">{f.reason}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Close Button */}
            <div className="p-6">
              <button
                onClick={() => setShowResult(false)}
                className="w-full py-3 bg-primary text-white text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
