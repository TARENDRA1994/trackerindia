import MentorLogForm from "@/components/MentorLogForm";
import { Award, ShieldCheck } from "lucide-react";

export default function MentorLogPage() {
  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Header Decoration */}
      <div className="bg-white border-b border-stone-200 py-16 mb-12">
        <div className="max-w-4xl mx-auto px-6 space-y-4">
           <div className="flex items-center gap-2 text-accent">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Faculty Operations</span>
           </div>
           <h1 className="text-5xl font-serif font-bold text-primary italic">Daily Productivity Record</h1>
           <p className="text-stone-500 font-medium max-w-xl">
             Submit your daily engagement metrics to help us optimize student success and maintain high faculty standards.
           </p>
        </div>
      </div>

      <div className="px-6">
        <MentorLogForm />
      </div>
      <div className="max-w-4xl mx-auto px-6 mt-16 text-center">
         <div className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-stone-300">
            <Award className="w-4 h-4" /> Secure Protocol • Data Privacy Enforced • Tracker India 🇮🇳
         </div>
      </div>
    </div>
  );
}
