"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Calendar, BookOpen, Clock, Camera, Save, Loader2, ChevronLeft, AlertCircle, Send, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [newMobile, setNewMobile] = useState("");
  const [requestReason, setRequestReason] = useState("");
  const [formData, setFormData] = useState({ name: "", whatsapp: "", image: "", email: "" });
  const router = useRouter();

  useEffect(() => {
    fetch("/api/profile")
      .then(res => res.json())
      .then(d => {
        setUser(d);
        setFormData({ 
          name: d.name, 
          whatsapp: d.whatsapp || "", 
          image: d.image || "",
          email: d.email || ""
        });
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    if (!formData.whatsapp || !formData.email) {
       alert("WhatsApp number and Email are mandatory.");
       return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) alert("Profile updated successfully!");
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleRequestChange = async () => {
     if (!newMobile || !requestReason) {
        alert("Please provide the new mobile number and a reason.");
        return;
     }

     setRequesting(true);
     try {
        const res = await fetch("/api/profile/request-mobile", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ newMobile, reason: requestReason }),
        });
        if (res.ok) {
           alert("Change request sent to administration.");
           setShowRequestModal(false);
           setNewMobile("");
           setRequestReason("");
        } else {
           const err = await res.json();
           alert(err.message || "Failed to send request.");
        }
     } catch (e) {
        console.error(e);
     } finally {
        setRequesting(false);
     }
  };

  if (loading) return <div className="p-20 text-center animate-pulse italic font-serif">Retreiving identity record...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <div className="flex items-center gap-4 mb-2 justify-between">
         <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-stone-100 transition-all border border-transparent hover:border-stone-200">
               <ChevronLeft className="w-5 h-5 text-stone-400" />
            </button>
            <div>
               <h1 className="text-4xl font-serif font-bold text-primary italic">Citizen Identity</h1>
               <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-stone-400">Manage your official credentials</p>
            </div>
         </div>
         <button
            onClick={() => router.push("/dashboard/profile/report")}
            className="bg-[#1E3A8A] text-white px-6 py-3 font-bold uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20 hover:translate-y-[-2px] transition-all flex items-center gap-3"
         >
            <FileText className="w-4 h-4" /> Generate APR Report
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-stone-200 p-10 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
             <div className="flex flex-col items-center">
                <div className="relative group cursor-pointer w-32 h-32 mb-6">
                   {formData.image ? (
                      <img src={formData.image} alt="Profile" className="w-full h-full object-cover border-4 border-stone-100 shadow-inner" />
                   ) : (
                      <div className="w-full h-full bg-stone-100 flex items-center justify-center border-4 border-white shadow-inner">
                         <User className="w-12 h-12 text-stone-300" />
                      </div>
                   )}
                   <label className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer">
                      <Camera className="w-6 h-6 text-white" />
                      <input 
                         type="file" className="hidden" 
                         onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                               const reader = new FileReader();
                               reader.onloadend = () => setFormData({...formData, image: reader.result as string});
                               reader.readAsDataURL(file);
                            }
                         }} 
                      />
                   </label>
                </div>
                <h2 className="text-2xl font-serif font-bold text-primary">{user.name}</h2>
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 bg-stone-50 px-4 py-1 mt-2 border border-stone-100">
                   {user.role}
                </span>
                <p className="text-[10px] font-mono text-stone-300 mt-4 uppercase tracking-tighter">Login ID: {user.loginId || "PENDING"}</p>
             </div>
             
             <div className="mt-10 pt-8 border-t border-stone-50 space-y-4">
                <InfoRow icon={Mail} label="Official Email" val={formData.email} />
                <InfoRow icon={Phone} label="Contact" val={formData.whatsapp} />
             </div>
          </div>
        </div>

        {/* Edit Section */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white border border-stone-200 p-12 shadow-2xl space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-1">Display Name <span className="text-red-500">*</span></label>
                    <input 
                       className="w-full p-4 bg-stone-50 border-b-2 border-stone-100 focus:border-primary outline-none transition-all font-serif italic text-lg"
                       value={formData.name}
                       onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-1">Official Email <span className="text-red-500">*</span></label>
                    <input 
                       className="w-full p-4 bg-stone-50 border-b-2 border-stone-100 focus:border-primary outline-none transition-all font-serif italic text-lg"
                       value={formData.email}
                       onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-1">WhatsApp Connectivity <span className="text-red-500">*</span></label>
                    <input 
                       className="w-full p-4 bg-stone-50 border-b-2 border-stone-100 focus:border-primary outline-none transition-all font-serif italic text-lg"
                       value={formData.whatsapp}
                       onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                    />
                 </div>
                 <div className="space-y-3">
                    <div className="flex justify-between items-center">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Mobile Number (Locked)</label>
                       <button 
                         onClick={() => setShowRequestModal(true)}
                         className="text-[9px] font-bold text-accent uppercase tracking-widest underline underline-offset-4 decoration-accent/30 hover:decoration-accent transition-all"
                       >
                         Request Change
                       </button>
                    </div>
                    <div className="w-full p-4 bg-stone-50 border-b-2 border-stone-100 font-serif italic text-lg text-stone-400 cursor-not-allowed">
                       {user.loginId}
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-10 border-t border-stone-50 opacity-60">
                 <StaticBox icon={MapPin} label="Jurisdiction" val={`${user.city}, ${user.state}`} />
                 <StaticBox icon={Calendar} label="Birth Record" val={new Date(user.dob).toLocaleDateString()} />
                 <StaticBox icon={BookOpen} label="Academic Medium" val={user.medium} />
                 <StaticBox icon={Clock} label="Target Period" val={`${user.exam} ${user.targetYear}`} />
              </div>

              <div className="pt-10 flex justify-end">
                 <button 
                    disabled={saving}
                    onClick={handleSave}
                    className="bg-primary text-white px-12 py-4 font-bold uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20 hover:translate-y-[-2px] transition-all flex items-center gap-3 disabled:opacity-50"
                 >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save Variations</>}
                 </button>
              </div>
           </div>
           <p className="text-[9px] text-stone-400 uppercase tracking-widest text-center italic">
              Legacy fields are locked. Submit structural identity modification request for mobile number updates.
           </p>
        </div>
      </div>

      {/* Request Modal */}
      {showRequestModal && (
         <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-white border border-stone-200 w-full max-w-md p-10 shadow-2xl relative animate-in zoom-in duration-300">
               <div className="absolute top-0 left-0 w-full h-1 bg-accent" />
               <h2 className="text-2xl font-serif font-bold text-primary italic mb-2">Request Mobile Update</h2>
               <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-8">Formal submission to administration</p>
               
               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[9px] font-bold uppercase tracking-widest text-stone-400">New Mobile Number</label>
                     <input 
                        className="w-full p-4 bg-stone-50 border-b-2 border-stone-100 focus:border-accent outline-none transition-all font-serif italic"
                        placeholder="Enter 10-digit number"
                        value={newMobile}
                        onChange={(e) => setNewMobile(e.target.value)}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Reason for Request</label>
                     <textarea 
                        className="w-full p-4 bg-stone-50 border-b-2 border-stone-100 focus:border-accent outline-none transition-all font-serif italic min-h-[100px]"
                        placeholder="Explain why the update is required..."
                        value={requestReason}
                        onChange={(e) => setRequestReason(e.target.value)}
                     />
                  </div>
               </div>

               <div className="flex gap-4 mt-10">
                  <button 
                    onClick={() => setShowRequestModal(false)}
                    className="flex-1 px-4 py-4 border border-stone-200 text-[10px] font-bold uppercase tracking-widest hover:bg-stone-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    disabled={requesting}
                    onClick={handleRequestChange}
                    className="flex-1 px-4 py-4 bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-accent/20 hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2"
                  >
                    {requesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Send Request</>}
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}

function InfoRow({ icon: Icon, label, val }: any) {
   return (
      <div className="flex items-center gap-3">
         <Icon className="w-4 h-4 text-stone-300" />
         <div>
            <p className="text-[8px] font-bold uppercase tracking-widest text-stone-400">{label}</p>
            <p className="text-xs font-medium text-stone-600">{val || "Not set"}</p>
         </div>
      </div>
   );
}

function StaticBox({ icon: Icon, label, val }: any) {
   return (
      <div className="space-y-1">
         <Icon className="w-4 h-4 text-stone-300 mb-1" />
         <p className="text-[8px] font-bold uppercase tracking-widest text-stone-400">{label}</p>
         <p className="text-xs font-bold text-stone-600">{val}</p>
      </div>
   );
}
