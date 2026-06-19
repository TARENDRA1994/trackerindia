"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Search, Filter, CheckCircle, XCircle, 
  PauseCircle, Edit3, MoreHorizontal, 
  MapPin, Clock, Calendar, Mail, 
  Phone, Book, Target, Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function RegistrationsContent() {
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get("status") || "PENDING";
  const initialRole = searchParams.get("role") || "";

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [filter, setFilter] = useState(initialFilter);
  const [roleFilter, setRoleFilter] = useState(initialRole);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let url = `/api/admin/users?status=${filter}`;
      if (roleFilter) url += `&role=${roleFilter}`;
      
      const res = await fetch(url);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filter, roleFilter]);

  const handleUpdateStatus = async (userId: string, status: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, status }),
      });
      if (res.ok) {
        fetchUsers();
        setSelectedUser(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
             <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary/50 flex items-center gap-1">
               <Clock className="w-3 h-3" /> Queue Management {roleFilter && `(${roleFilter}s)`}
             </div>
             <h1 className="text-4xl font-serif font-bold italic text-primary">Admission Reviews</h1>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {["PENDING", "APPROVED", "HOLD", "REJECTED"].map(s => (
              <button 
                key={s} 
                onClick={() => { setFilter(s); setRoleFilter(""); }}
                className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all ${
                  filter === s && !roleFilter ? "bg-primary text-white border-primary shadow-lg" : "bg-white text-stone-400 hover:border-primary/30"
                }`}
              >
                {s}
              </button>
            ))}
            {["STUDENT", "MENTOR"].map(r => (
               <button 
                key={r} 
                onClick={() => { setRoleFilter(r); setFilter("APPROVED"); }}
                className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all ${
                  roleFilter === r ? "bg-accent text-accent-foreground border-accent shadow-lg" : "bg-white text-stone-400 hover:border-primary/30"
                }`}
              >
                {r}s
              </button>
            ))}
          </div>
        </div>

        {/* User List Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-full py-20 text-center text-stone-400 font-bold uppercase tracking-widest text-xs">
              Fetching Applications...
            </div>
          ) : users.length > 0 ? users.map((user) => (
            <motion.div 
               layoutId={user.id}
               key={user.id} 
               className="bg-white border border-stone-200 shadow-lg p-6 hover:border-primary transition-all group flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4">
                  <div className="w-14 h-14 bg-stone-100 flex items-center justify-center font-serif text-2xl font-bold text-primary italic">
                    {user.name.charAt(0)}
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold text-stone-800">{user.name}</h2>
                    <p className="text-xs font-medium text-stone-400 flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {user.email}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                   <div className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                     user.status === "APPROVED" ? "bg-emerald-50 text-emerald-600" : 
                     user.status === "PENDING" ? "bg-amber-50 text-amber-600" :
                     user.status === "HOLD" ? "bg-blue-50 text-blue-600" : "bg-red-50 text-red-600"
                   }`}>
                     {user.status}
                   </div>
                   <div className="text-[8px] font-bold text-stone-300 uppercase tracking-widest">{user.role}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-4 mb-8">
                <InfoItem icon={MapPin} label="Location" value={`${user.city}, ${user.state}`} />
                <InfoItem icon={Target} label="Target Year" value={user.targetYear.toString()} />
                <InfoItem icon={Book} label="Medium" value={user.medium} />
                <InfoItem icon={Calendar} label="Registered" value={new Date(user.createdAt).toLocaleDateString()} />
              </div>

              <div className="flex gap-2 pt-4 border-t border-stone-100">
                <ActionButton 
                   icon={CheckCircle} 
                   label="Approve" 
                   color="text-emerald-600 hover:bg-emerald-50" 
                   onClick={() => handleUpdateStatus(user.id, "APPROVED")} 
                   visible={user.status !== "APPROVED"}
                />
                <ActionButton 
                   icon={PauseCircle} 
                   label="Hold" 
                   color="text-blue-600 hover:bg-blue-50" 
                   onClick={() => handleUpdateStatus(user.id, "HOLD")} 
                   visible={user.status !== "HOLD"}
                />
                <ActionButton 
                   icon={XCircle} 
                   label="Reject" 
                   color="text-rose-600 hover:bg-rose-50" 
                   onClick={() => handleUpdateStatus(user.id, "REJECTED")} 
                   visible={user.status !== "REJECTED"}
                />
                <button 
                  onClick={() => setSelectedUser(user)}
                  className="ml-auto p-3 text-stone-400 hover:text-primary transition-colors"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )) : (
            <div className="col-span-full py-20 text-center text-stone-300 font-bold uppercase tracking-[0.2em] text-[10px]">
              No {filter.toLowerCase()} {roleFilter.toLowerCase()} applications found
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedUser && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setSelectedUser(null)} className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[100]" />
            <motion.div initial={{x: "100%"}} animate={{x: 0}} exit={{x: "100%"}} className="fixed right-0 top-0 h-full w-full max-w-xl bg-white z-[101] shadow-2xl p-12 overflow-y-auto" >
              <div className="space-y-12">
                <div className="flex justify-between items-start">
                   <div className="space-y-2">
                     <div className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Full Candidate Profile</div>
                     <h2 className="text-4xl font-serif font-bold italic">{selectedUser.name}</h2>
                   </div>
                   <button onClick={() => setSelectedUser(null)}><XCircle className="w-8 h-8 text-stone-300 hover:text-stone-800" /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <ProfileMetric label="WhatsApp Number" value={selectedUser.whatsapp} icon={Phone} />
                   <ProfileMetric label="Date of Birth" value={new Date(selectedUser.dob).toDateString()} icon={Calendar} />
                   <ProfileMetric label="Exam Mode" value={selectedUser.exam} icon={Target} />
                   <ProfileMetric label="Medium" value={selectedUser.medium} icon={Book} />
                </div>
                <div className="space-y-6 pt-10 border-t border-stone-100">
                   <h3 className="text-xl font-serif font-bold italic">Credential Management</h3>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Assign/Reset Password</label>
                      <input 
                         type="text" 
                         className="w-full p-4 bg-stone-50 border border-stone-200 outline-none focus:border-primary font-mono text-sm"
                         onBlur={(e) => {
                            const newPass = e.target.value;
                            if (newPass) {
                               fetch("/api/admin/users", {
                                  method: "PATCH",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ userId: selectedUser.id, password: newPass }),
                                }).then(r => r.ok && alert("Password updated successfully"));
                            }
                         }}
                      />
                   </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function RegistrationsPage() {
   return (
      <Suspense fallback={<div>Loading Review System...</div>}>
         <RegistrationsContent />
      </Suspense>
   );
}

function InfoItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) { return ( <div className="space-y-1"> <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-1"> <Icon className="w-3 h-3" /> {label} </p> <p className="text-sm font-bold text-stone-700">{value}</p> </div> ); }
function ProfileMetric({ label, value, icon: Icon }: { label: string, value: string, icon: any }) { return ( <div className="space-y-3"> <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40"> <Icon className="w-4 h-4" /> {label} </div> <div className="text-lg font-serif font-bold text-stone-800">{value}</div> </div> ); }
function ActionButton({ icon: Icon, label, color, onClick, visible = true }: any) { if (!visible) return null; return ( <button onClick={onClick} className={`flex items-center gap-2 px-4 py-3 text-[9px] font-bold uppercase tracking-[0.15em] border border-stone-100 transition-all ${color}`} > <Icon className="w-4 h-4" /> {label} </button> ); }
