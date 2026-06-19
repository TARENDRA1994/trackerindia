"use client";

import { useState, useEffect } from "react";
import { 
  Users, UserPlus, ShieldCheck, CheckCircle, 
  Search, ArrowRight, GraduationCap, Star,
  ShieldAlert, RefreshCw
} from "lucide-react";
import { motion } from "framer-motion";

export default function MentorAssignmentPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [stuRes, mentRes] = await Promise.all([
        fetch("/api/admin/users?role=STUDENT&status=APPROVED"),
        fetch("/api/admin/users?role=MENTOR&status=APPROVED")
      ]);
      const stuData = await stuRes.json();
      const mentData = await mentRes.json();
      setStudents(stuData);
      setMentors(mentData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssign = async (studentId: string, mentorId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    let currentMentorIds = student.mentors?.map((m: any) => m.id) || [];
    let newMentorIds;

    if (mentorId === "") {
      newMentorIds = [];
    } else {
      if (currentMentorIds.includes(mentorId)) {
        newMentorIds = currentMentorIds.filter((id: string) => id !== mentorId);
      } else {
        newMentorIds = [...currentMentorIds, mentorId];
      }
    }

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: studentId, mentorIds: newMentorIds }),
      });
      if (res.ok) {
        fetchData();
        // Keep selected student updated
        if (selectedStudent?.id === studentId) {
          const updatedStudent = { ...student, mentors: mentors.filter(m => newMentorIds.includes(m.id)) };
          setSelectedStudent(updatedStudent);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 p-8 pt-12">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-2 border-l-4 border-accent pl-6">
           <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent/60">Mentorship Operations</div>
           <h1 className="text-5xl font-serif font-bold italic text-primary">Faculty Assignment</h1>
           <p className="text-stone-500 font-medium max-w-xl">
             Strategically pair aspirants with senior mentors to maximize discipline and consistency.
           </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Student List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
               <h2 className="text-xl font-serif font-bold text-primary italic">Active Aspirants</h2>
               <div className="bg-white border p-2 flex items-center gap-2">
                  <Search className="w-4 h-4 text-stone-300" />
                  <input placeholder="Search name..." className="text-xs outline-none bg-transparent" />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loading ? <LoadingPulse /> : students.map((s) => (
                <div 
                   key={s.id} 
                   className={`p-6 border-2 transition-all cursor-pointer relative overflow-hidden ${
                     selectedStudent?.id === s.id ? "bg-white border-accent shadow-xl scale-[1.02]" : "bg-white border-transparent hover:border-stone-200"
                   }`}
                   onClick={() => setSelectedStudent(s)}
                >
                   <div className="flex justify-between items-start relative z-10">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                           <GraduationCap className="w-4 h-4 text-primary" />
                           <span className="text-xs font-bold uppercase tracking-widest text-primary/40">{s.targetYear} Aspirant</span>
                        </div>
                        <h3 className="text-2xl font-serif font-bold">{s.name}</h3>
                        <div className="flex flex-wrap gap-2">
                           {s.mentors && s.mentors.length > 0 ? s.mentors.map((m: any) => (
                             <div key={m.id} className="text-[9px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-tighter">
                                {m.name}
                             </div>
                           )) : (
                             <div className="text-[9px] font-bold px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-100 uppercase tracking-tighter">
                               UNASSIGNED
                             </div>
                           )}
                        </div>
                      </div>
                      <button className={`p-4 rounded-full transition-all ${selectedStudent?.id === s.id ? "bg-accent text-white" : "bg-stone-50 text-stone-300"}`}>
                         <ArrowRight className="w-6 h-6" />
                      </button>
                   </div>
                   {s.mentors?.length > 0 && <Star className="absolute -bottom-4 -right-4 w-20 h-20 text-emerald-600/5 rotate-12" />}
                </div>
              ))}
            </div>
          </div>

          {/* Mentor Selector (Sticky) */}
          <div className="space-y-6">
             <div className="sticky top-12 space-y-6">
               <div className="bg-primary p-8 text-white space-y-8 shadow-2xl relative overflow-hidden">
                  <ShieldCheck className="absolute -bottom-10 -right-10 w-40 h-40 text-white/5 shadow-inner" />
                  <div className="space-y-2 relative z-10">
                     <h2 className="text-2xl font-serif font-bold italic">Assigning To</h2>
                     <p className="text-white/60 font-bold uppercase text-[10px] tracking-widest">
                       {selectedStudent ? selectedStudent.name : "Please select an aspirant"}
                     </p>
                  </div>
                  
                  {selectedStudent && (
                    <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="space-y-6 relative z-10">
                       <div className="text-[10px] font-bold uppercase text-white/40 tracking-widest">Select Available Mentor(s)</div>
                       <div className="space-y-2">
                          {mentors.length > 0 ? mentors.map(m => {
                            const isAssigned = selectedStudent.mentors?.some((sm: any) => sm.id === m.id);
                            return (
                              <button 
                                key={m.id}
                                onClick={() => handleAssign(selectedStudent.id, m.id)}
                                className={`w-full flex items-center justify-between p-4 border transition-all group ${isAssigned ? "bg-accent text-accent-foreground border-accent" : "bg-white/10 border-white/20 hover:bg-white/20"}`}
                              >
                                 <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${isAssigned ? "bg-white text-accent" : "bg-accent text-accent-foreground"}`}>
                                       {m.name.charAt(0)}
                                    </div>
                                    <div className="text-left">
                                       <div className="text-sm font-bold">{m.name}</div>
                                       <div className={`text-[10px] ${isAssigned ? "text-accent-foreground/60" : "text-white/40"}`}>{isAssigned ? "Already Assigned" : "Verified Faculty"}</div>
                                    </div>
                                 </div>
                                 {isAssigned ? <CheckCircle className="w-4 h-4" /> : <ArrowsUp className="w-4 h-4 text-white/0 group-hover:text-accent transition-all group-hover:translate-x-1" />}
                              </button>
                            );
                          }) : (
                            <div className="p-10 border-2 border-dashed border-white/10 text-center text-white/30 italic text-xs">
                               No mentors approved yet.
                            </div>
                          )}
                       </div>
                       
                       {selectedStudent.mentors?.length > 0 && (
                         <button 
                          onClick={() => handleAssign(selectedStudent.id, "")}
                          className="w-full py-4 bg-rose-600/20 text-rose-300 border border-rose-600/30 text-[10px] font-bold uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all"
                         >
                           Unassign All Mentors
                         </button>
                       )}
                    </motion.div>
                  )}
               </div>

               {!selectedStudent && (
                 <div className="p-10 bg-white border-2 border-dashed border-stone-200 text-center space-y-4">
                    <ShieldAlert className="w-8 h-8 text-stone-200 mx-auto" />
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Select an aspirant on the left to begin assignment</p>
                 </div>
               )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingPulse() {
  return (
    <div className="col-span-2 grid grid-cols-2 gap-4">
      {[1,2,3,4].map(i => (
        <div key={i} className="h-40 bg-white border border-stone-100 animate-pulse" />
      ))}
    </div>
  );
}

function ArrowsUp({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12h14"/><path d="m13 18 6-6-6-6"/>
    </svg>
  );
}
