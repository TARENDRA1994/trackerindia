"use client";

import { useState, useEffect } from "react";
import { 
  Users, GraduationCap, MapPin, 
  MessageSquare, BarChart3, Search, 
  Phone, Mail, Calendar, TrendingUp,
  LayoutDashboard, Star, ChevronRight, X, Clock, Target, BookOpen
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function MentorDashboard() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/mentor/students");
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F9F8F4]">
      {/* Mentor Header */}
      <div className="bg-primary text-white pt-12 pb-24 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-4">
             <div className="flex items-center gap-2 text-accent text-[10px] font-bold uppercase tracking-[0.3em]">
               <Star className="w-4 h-4 fill-accent" /> Senior Faculty Portal
             </div>
             <h1 className="text-5xl font-serif font-bold italic">Mentor Dashboard</h1>
             <p className="text-white/60 font-medium max-w-xl text-sm italic">
               "Guiding the next generation of Civil Servants with data-driven precision."
             </p>
          </div>
          <div className="bg-white/10 border border-white/20 p-8 backdrop-blur-md">
             <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest mb-1">Assigned Aspirants</p>
             <p className="text-5xl font-serif font-bold italic">{students.length}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 -mt-12 space-y-12 pb-20">
        <div className="flex flex-col md:flex-row gap-4 items-center">
           <div className="flex-1 relative w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300 w-5 h-5" />
              <input 
                 className="w-full pl-16 pr-6 py-6 bg-white border border-stone-200 shadow-2xl outline-none focus:border-primary transition-all text-sm font-bold placeholder:text-stone-300 italic"
                 placeholder="Search student by name or ID..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <Link href="/dashboard/analytics" className="px-10 py-6 bg-primary text-white font-bold uppercase text-[10px] tracking-widest hover:translate-y-[-2px] transition-all flex items-center gap-2 shadow-xl shadow-primary/20">
              <TrendingUp className="w-4 h-4" /> Global Consistency Map
           </Link>
        </div>

        <div className="bg-white border border-stone-200 shadow-2xl overflow-hidden relative">
           <div className="p-10 border-b border-stone-100 flex items-center justify-between bg-stone-50/30">
              <h2 className="text-2xl font-serif font-bold text-primary italic">Aspirant Roaster</h2>
              <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Active Monitoring Protocol Enforced</div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead className="bg-stone-50/50 border-b border-stone-100">
                    <tr className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]">
                       <th className="px-10 py-7">Student Identity</th>
                       <th className="px-10 py-7">Target Profile</th>
                       <th className="px-10 py-7">Engagement</th>
                       <th className="px-10 py-7">Consistency</th>
                       <th className="px-10 py-7 text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-stone-50">
                   {loading ? <TableLoading /> : filteredStudents.map(s => (
                     <tr 
                        key={s.id} 
                        onClick={() => setSelectedStudent(s)}
                        className="group hover:bg-stone-50/80 transition-all cursor-pointer"
                     >
                        <td className="px-10 py-8">
                           <div className="flex items-center gap-5">
                              <div className="w-14 h-14 bg-stone-100 flex items-center justify-center font-serif text-primary font-bold border border-stone-200 shadow-inner overflow-hidden uppercase">
                                 {s.image ? <img src={s.image} className="w-full h-full object-cover" /> : s.name.charAt(0)}
                              </div>
                              <div>
                                 <div className="font-bold text-stone-800 text-lg font-serif italic">{s.name}</div>
                                 <div className="text-[10px] text-stone-400 font-bold flex items-center gap-1 uppercase tracking-widest mt-1">
                                    <MapPin className="w-3 h-3 text-primary" /> {s.city}, {s.state}
                                 </div>
                              </div>
                           </div>
                        </td>
                        <td className="px-10 py-8">
                           <div className="space-y-1">
                              <div className="text-sm font-bold text-stone-600">{s.exam} {s.targetYear}</div>
                              <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest italic">{s.medium} Medium</div>
                           </div>
                        </td>
                        <td className="px-10 py-8 text-xs font-bold text-stone-500 font-mono">
                           {s.whatsapp}
                        </td>
                        <td className="px-10 py-8">
                           <div className="flex items-center gap-3">
                              <div className="text-[10px] font-bold text-primary uppercase tracking-widest">{s._count.dailyLogs} logs</div>
                              <div className="h-1.5 w-32 bg-stone-100 rounded-full overflow-hidden shadow-inner">
                                 <motion.div 
                                    initial={{width: 0}}
                                    animate={{width: `${Math.min(s._count.dailyLogs * 5, 100)}%`}}
                                    className="h-full bg-accent"
                                 />
                              </div>
                           </div>
                        </td>
                        <td className="px-10 py-8 text-right">
                           <div className="flex justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                              <Link href={`/dashboard/mentor/students/${s.id}`} className="p-3 bg-primary text-white shadow-xl shadow-primary/20">
                                 <BarChart3 className="w-5 h-5" />
                              </Link>
                              <button className="p-3 bg-stone-100 text-stone-500 hover:bg-stone-200 transition-all">
                                 <MessageSquare className="w-5 h-5" />
                              </button>
                           </div>
                        </td>
                     </tr>
                   ))}
                 </tbody>
              </table>
           </div>
        </div>
      </div>

      {/* Profile Modal */}
      <AnimatePresence>
         {selectedStudent && (
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="fixed inset-0 bg-primary/40 backdrop-blur-md z-50 flex items-center justify-center p-6"
            >
               <motion.div 
                  initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                  className="bg-[#F9F8F4] w-full max-w-4xl shadow-2xl relative border border-white/20"
               >
                  <button onClick={() => setSelectedStudent(null)} className="absolute top-6 right-6 p-2 hover:bg-stone-200 rounded-full transition-all">
                     <X className="w-6 h-6 text-stone-500" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-12">
                     {/* Left Sidebar Info */}
                     <div className="md:col-span-4 bg-white p-12 space-y-8 border-r border-stone-200">
                        <div className="text-center">
                           <div className="w-24 h-24 bg-stone-100 mx-auto rounded-sm border-2 border-primary/10 mb-6 flex items-center justify-center font-serif text-3xl font-bold text-primary italic uppercase shadow-xl">
                              {selectedStudent.image ? <img src={selectedStudent.image} className="w-full h-full object-cover" /> : selectedStudent.name.charAt(0)}
                           </div>
                           <h3 className="text-2xl font-serif font-bold text-primary">{selectedStudent.name}</h3>
                           <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1 italic">UPSC Aspirant</p>
                        </div>

                        <div className="space-y-6 pt-10 border-t border-stone-50">
                           <InfoItem icon={MapPin} label="Origin" val={`${selectedStudent.city}, ${selectedStudent.state}`} />
                           <InfoItem icon={Calendar} label="Last Active" val="Today at 06:45 PM" />
                           <InfoItem icon={Phone} label="Official contact" val={selectedStudent.whatsapp} />
                           <InfoItem icon={Mail} label="Academic Email" val={selectedStudent.email} />
                        </div>
                     </div>

                     {/* Right Main Content */}
                     <div className="md:col-span-8 p-12 space-y-10 max-h-[80vh] overflow-y-auto">
                        <div>
                           <h4 className="text-[10px] uppercase font-bold tracking-[0.3em] text-stone-400 mb-6">Subject Competency</h4>
                           <div className="flex flex-wrap gap-2">
                              {["Polity", "History", "Economy", "Ethics"].map(tag => (
                                 <span key={tag} className="px-4 py-2 border border-stone-200 text-[10px] font-bold uppercase tracking-widest text-primary italic bg-white">{tag}</span>
                              ))}
                           </div>
                        </div>

                        <div>
                           <h4 className="text-[10px] uppercase font-bold tracking-[0.3em] text-stone-400 mb-6">Course Metrics</h4>
                           <div className="grid grid-cols-2 gap-4">
                              <StatItem icon={Clock} label="Avg Study Hours" val="8.4h" />
                              <StatItem icon={Target} label="Revision Loop" val="Active" />
                              <StatItem icon={BookOpen} label="MCQ Accuracy" val="72%" />
                              <StatItem icon={TrendingUp} label="Retention" val="High" />
                           </div>
                        </div>

                        <div className="pt-10 flex justify-end gap-4 border-t border-stone-100">
                           <button className="px-10 py-4 border border-stone-200 text-[10px] font-bold uppercase tracking-widest italic hover:bg-stone-50 transition-all">Send Direct Directive</button>
                           <Link href={`/dashboard/mentor/students/${selectedStudent.id}`} className="px-10 py-4 bg-primary text-white text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all">Full Graph Review</Link>
                        </div>
                     </div>
                  </div>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}

function InfoItem({ icon: Icon, label, val }: any) {
   return (
      <div className="flex gap-4">
         <div className="p-2 bg-stone-50"><Icon className="w-4 h-4 text-primary" /></div>
         <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400">{label}</p>
            <p className="text-sm font-bold text-stone-600">{val}</p>
         </div>
      </div>
   );
}

function StatItem({ icon: Icon, label, val }: any) {
   return (
      <div className="p-6 bg-white border border-stone-100 shadow-sm flex flex-col gap-2">
         <Icon className="w-5 h-5 text-accent" />
         <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">{label}</span>
         <span className="text-xl font-serif font-bold text-primary italic">{val}</span>
      </div>
   );
}

function TableLoading() {
  return (
    <>
      {[1,2,3,4,5].map(i => (
        <tr key={i} className="animate-pulse">
           <td colSpan={6} className="px-10 py-10 border-b border-stone-100">
              <div className="h-12 bg-stone-50 w-full" />
           </td>
        </tr>
      ))}
    </>
  );
}
