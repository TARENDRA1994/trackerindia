"use client";

import { useState } from "react";
import { UserPlus, Mail, Phone, Lock, CheckCircle, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function MentorCreationForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ loginId: string; email: string } | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch("/api/admin/create-mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resultData = await res.json();

      if (res.ok) {
        setResult({ loginId: resultData.loginId, email: resultData.email });
      } else {
        setError(resultData.message || "Failed to create mentor");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="bg-white border border-stone-200 p-12 text-center space-y-6 shadow-2xl max-w-lg mx-auto"
      >
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-serif font-bold text-primary">Mentor Created Successfully</h2>
          <p className="text-stone-500 text-sm italic">Credential package generated and secured.</p>
        </div>
        
        <div className="bg-stone-50 p-6 border border-stone-200 space-y-4 text-left">
           <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Login ID</p>
              <p className="text-xl font-mono font-bold text-primary">{result.loginId}</p>
           </div>
           <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Linked Email</p>
              <p className="text-sm font-medium text-stone-600">{result.email}</p>
           </div>
        </div>

        <p className="text-[10px] text-stone-400 font-medium px-6">
          Provide these credentials to the faculty member. They can login using either their Login ID or Email.
        </p>

        <button 
          onClick={() => setResult(null)}
          className="w-full py-4 bg-primary text-white font-bold uppercase tracking-widest text-[10px] hover:shadow-xl transition-all"
        >
          Create Another Account
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 flex justify-between items-end">
         <div className="space-y-1">
            <h1 className="text-3xl font-serif font-bold text-primary italic">Faculty Onboarding</h1>
            <p className="text-stone-500 text-sm">Issue new administrative and mentoring credentials.</p>
         </div>
         <Link href="/dashboard/admin" className="text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-primary flex items-center gap-1 transition-all">
            <ArrowLeft className="w-3 h-3" /> Dashboard
         </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-stone-200 shadow-2xl overflow-hidden">
        <div className="p-8 md:p-12 space-y-8">
          
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }} 
                animate={{ height: "auto", opacity: 1 }} 
                className="p-4 bg-rose-50 border border-rose-100 flex items-center gap-3 text-rose-600 text-xs font-bold"
              >
                <AlertCircle className="w-4 h-4" /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Full Name</label>
              <div className="relative">
                <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                <input 
                  required
                  name="name"
                  type="text" 
                  placeholder="e.g. Dr. Satish Verma"
                  className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 outline-none focus:border-accent font-serif italic text-sm transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                <input 
                  required
                  name="email"
                  type="email" 
                  placeholder="faculty@trackerindia.com"
                  className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 outline-none focus:border-accent text-sm transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">WhatsApp Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                <input 
                  required
                  name="whatsapp"
                  type="tel" 
                  placeholder="+91 99999 99999"
                  className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 outline-none focus:border-accent text-sm transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Temporary Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                <input 
                  required
                  name="password"
                  type="password" 
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 outline-none focus:border-accent text-sm transition-all"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-100 flex flex-col items-center gap-6">
             <button 
               disabled={loading}
               type="submit"
               className="w-full py-5 bg-primary text-white font-bold uppercase tracking-[0.4em] text-[10px] shadow-2xl hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
             >
               {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Generate Faculty Account <UserPlus className="w-4 h-4" /></>}
             </button>
             <p className="text-[9px] text-stone-400 text-center leading-relaxed">
               By proceeding, you are authorizing the creation of a restricted administrative account. <br />
               The system will automatically assign a unique Login ID (MNT-XXXX) to this user.
             </p>
          </div>
        </div>
      </form>
    </div>
  );
}
