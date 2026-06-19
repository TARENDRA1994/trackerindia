"use client";

import { useState, useEffect } from "react";
import { 
  Users, Calendar, CheckCircle, AlertCircle, 
  Clock, TrendingUp, Star, ChevronRight, 
  ChevronLeft, Loader2, Plus, Trash2, Layout, BookOpen, MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MentorLogForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [students, setStudents] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    oneOnOneDone: false,
    sessionCount: 1,
    sessionDetails: [] as any[],
    batchSessionDone: false,
    batchOverview: "",
    batchMissedReason: "",
    additionalTasks: [] as string[],
    hasIssue: false,
    issueDetail: "",
    workHours: 5,
    dailyProductivity: 80,
    weeklyProductivity: 80,
    topStudents: [] as any[]
  });

  useEffect(() => {
    // Fetch students assigned to this mentor
    fetch("/api/mentor/students")
      .then(res => res.json())
      .then(data => setStudents(data));

    // Check if log is already filed today
    fetch("/api/mentor/log")
      .then(res => res.json())
      .then(logs => {
        if (logs.length > 0) {
          const lastLogDate = new Date(logs[0].timestamp);
          const today = new Date();
          if (lastLogDate.toDateString() === today.toDateString()) {
            setSuccess(true);
          }
        }
      });
  }, []);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const toggleTask = (task: string) => {
    setFormData(prev => ({
      ...prev,
      additionalTasks: prev.additionalTasks.includes(task) 
        ? prev.additionalTasks.filter(t => t !== task)
        : [...prev.additionalTasks, task]
    }));
  };

  const addSession = () => {
    setFormData(prev => ({
      ...prev,
      sessionDetails: [...prev.sessionDetails, { studentId: "", overview: "", prepLevel: 50 }]
    }));
  };

  const updateSession = (index: number, key: string, value: any) => {
    const newSessions = [...formData.sessionDetails];
    newSessions[index] = { ...newSessions[index], [key]: value };
    setFormData(prev => ({ ...prev, sessionDetails: newSessions }));
  };

  const addTopStudent = () => {
    if (formData.topStudents.length >= 5) return;
    setFormData(prev => ({
      ...prev,
      topStudents: [...prev.topStudents, { studentId: "", rating: 8 }]
    }));
  };

  const updateTopStudent = (index: number, key: string, value: any) => {
    const newTop = [...formData.topStudents];
    newTop[index] = { ...newTop[index], [key]: value };
    setFormData(prev => ({ ...prev, topStudents: newTop }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/mentor/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) setSuccess(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto p-12 bg-white border border-stone-200 shadow-2xl text-center space-y-8">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-serif font-bold text-primary">Log Successfully Filed</h2>
          <p className="text-stone-500 uppercase tracking-widest text-[10px] font-bold">Your productivity has been recorded for today</p>
        </div>
        <button onClick={() => window.location.href = "/dashboard"} className="px-8 py-3 bg-primary text-white font-bold uppercase tracking-widest text-xs rounded hover:shadow-xl transition-all">
          Go To Dashboard
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white border border-stone-200 shadow-2xl relative overflow-hidden">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-stone-100">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(step / 7) * 100}%` }}
          className="h-full bg-accent"
        />
      </div>

      <div className="p-8 md:p-16">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
              <SectionHeader number="01" title="1:1 Session Tracking" icon={Users} />
              
              <div className="space-y-6">
                <Question label="Did you conduct any 1:1 sessions today?">
                  <div className="grid grid-cols-2 gap-4">
                    <ChoiceCard selected={formData.oneOnOneDone} onClick={() => setFormData({...formData, oneOnOneDone: true})} label="Yes" />
                    <ChoiceCard selected={!formData.oneOnOneDone} onClick={() => setFormData({...formData, oneOnOneDone: false})} label="No" />
                  </div>
                </Question>

                {formData.oneOnOneDone && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-8 pt-6 border-t border-stone-100">
                    <Question label="How many 1:1 sessions did you conduct?">
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(n => (
                          <button 
                            key={n}
                            onClick={() => {
                              const diff = n - formData.sessionDetails.length;
                              let newDetails = [...formData.sessionDetails];
                              if (diff > 0) {
                                for(let i=0; i<diff; i++) newDetails.push({ studentId: "", overview: "", prepLevel: 50 });
                              } else {
                                newDetails = newDetails.slice(0, n);
                              }
                              setFormData({...formData, sessionCount: n, sessionDetails: newDetails});
                            }}
                            className={`w-12 h-12 flex items-center justify-center font-bold border transition-all ${formData.sessionCount === n ? "bg-primary text-white border-primary" : "bg-white text-stone-400 border-stone-200"}`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </Question>

                    <div className="space-y-6">
                      {formData.sessionDetails.map((session, idx) => (
                        <div key={idx} className="p-6 bg-stone-50 border border-stone-200 space-y-4">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-accent">Session #{idx + 1}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-stone-500 uppercase">Student Name</label>
                              <StudentSearchSelect 
                                value={session.studentId}
                                onChange={(val) => updateSession(idx, "studentId", val)}
                                students={students}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-stone-500 uppercase">Prep Level ({session.prepLevel}%)</label>
                              <input 
                                type="range" 
                                min="0" max="100" 
                                value={session.prepLevel}
                                onChange={(e) => updateSession(idx, "prepLevel", parseInt(e.target.value))}
                                className="w-full accent-accent"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-stone-500 uppercase">Session Overview</label>
                            <textarea 
                              placeholder="Brief description of what was covered..."
                              value={session.overview}
                              onChange={(e) => updateSession(idx, "overview", e.target.value)}
                              className="w-full p-3 bg-white border border-stone-200 text-sm outline-none focus:border-accent min-h-[80px]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
              <NavButtons onNext={handleNext} />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
              <SectionHeader number="02" title="Batch Session Tracking" icon={Layout} />
              
              <div className="space-y-6">
                <Question label="Did you conduct a batch session today?">
                  <div className="grid grid-cols-2 gap-4">
                    <ChoiceCard selected={formData.batchSessionDone} onClick={() => setFormData({...formData, batchSessionDone: true})} label="Yes" />
                    <ChoiceCard selected={!formData.batchSessionDone} onClick={() => setFormData({...formData, batchSessionDone: false})} label="No" />
                  </div>
                </Question>

                {formData.batchSessionDone ? (
                  <Question label="Provide a short session overview">
                    <textarea 
                      placeholder="Topic, duration, student engagement..."
                      value={formData.batchOverview}
                      onChange={(e) => setFormData({...formData, batchOverview: e.target.value})}
                      className="w-full p-4 bg-stone-50 border border-stone-200 outline-none focus:border-accent font-serif italic"
                    />
                  </Question>
                ) : (
                  <Question label="Select reason for no session">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {["No batch scheduled", "Low attendance", "Personal issue", "Other"].map(r => (
                        <button 
                          key={r}
                          onClick={() => setFormData({...formData, batchMissedReason: r})}
                          className={`p-3 text-left text-xs font-bold uppercase tracking-widest border transition-all ${formData.batchMissedReason === r ? "bg-primary text-white border-primary" : "bg-white text-stone-400 border-stone-200 hover:border-stone-400"}`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </Question>
                )}
              </div>
              <NavButtons onBack={handleBack} onNext={handleNext} />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
              <SectionHeader number="03" title="Additional Work Done" icon={BookOpen} />
              
              <Question label="Apart from sessions, what additional tasks did you perform today?">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Current Affairs preparation",
                    "Calls to students",
                    "Lectures",
                    "Answer evaluation",
                    "Test creation"
                  ].map(task => (
                    <button 
                      key={task}
                      onClick={() => toggleTask(task)}
                      className={`p-4 text-left border flex items-center justify-between transition-all ${formData.additionalTasks.includes(task) ? "bg-primary text-white border-primary" : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"}`}
                    >
                      <span className="text-xs font-bold uppercase tracking-widest">{task}</span>
                      {formData.additionalTasks.includes(task) && <CheckCircle className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </Question>

              <div className="pt-10 border-t border-stone-100">
                <SectionHeader number="04" title="Feedback or Issues" icon={MessageSquare} />
                <Question label="Do you want to highlight any feedback or issue?">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <ChoiceCard selected={formData.hasIssue} onClick={() => setFormData({...formData, hasIssue: true})} label="Yes" />
                    <ChoiceCard selected={!formData.hasIssue} onClick={() => setFormData({...formData, hasIssue: false})} label="No" />
                  </div>
                  {formData.hasIssue && (
                    <textarea 
                      placeholder="Explain in detail..."
                      value={formData.issueDetail}
                      onChange={(e) => setFormData({...formData, issueDetail: e.target.value})}
                      className="w-full p-4 bg-stone-50 border border-stone-200 outline-none focus:border-accent font-serif italic"
                    />
                  )}
                </Question>
              </div>

              <NavButtons onBack={handleBack} onNext={handleNext} />
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
              <SectionHeader number="05" title="Work Hours" icon={Clock} />
              
              <Question label="How many hours did you work today? (excluding breaks)">
                <div className="grid grid-cols-5 md:grid-cols-11 gap-2">
                  {Array.from({length: 11}).map((_, i) => (
                    <button 
                      key={i}
                      onClick={() => setFormData({...formData, workHours: i})}
                      className={`h-12 flex items-center justify-center border font-bold transition-all ${formData.workHours === i ? "bg-primary text-white border-primary" : "bg-white text-stone-400 border-stone-200"}`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </Question>

              <div className="pt-10 border-t border-stone-100">
                <SectionHeader number="06" title="Productivity Assessment" icon={TrendingUp} />
                <div className="space-y-8">
                  <Question label={`Rate your productivity today (${formData.dailyProductivity}%)`}>
                    <input type="range" min="0" max="100" value={formData.dailyProductivity} onChange={(e) => setFormData({...formData, dailyProductivity: parseInt(e.target.value)})} className="w-full accent-primary" />
                    <div className="flex justify-between text-[8px] font-bold uppercase text-stone-400 mt-2">
                      <span>Low Effort</span>
                      <span>Peak Productivity</span>
                    </div>
                  </Question>
                  <Question label={`Rate your overall weekly productivity (${formData.weeklyProductivity}%)`}>
                    <input type="range" min="0" max="100" value={formData.weeklyProductivity} onChange={(e) => setFormData({...formData, weeklyProductivity: parseInt(e.target.value)})} className="w-full accent-primary" />
                  </Question>
                </div>
              </div>

              <NavButtons onBack={handleBack} onNext={handleNext} />
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
              <SectionHeader number="07" title="Top Students of the Day" icon={Star} />
              <p className="text-xs text-stone-400 italic">Identify high performers and engagement patterns (Max 5)</p>
              
              <div className="space-y-6">
                {formData.topStudents.map((item, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row gap-6 p-6 bg-stone-50 border border-stone-200 relative group">
                    <button 
                      onClick={() => setFormData({...formData, topStudents: formData.topStudents.filter((_, i) => i !== idx)})}
                      className="absolute -top-2 -right-2 p-1.5 bg-white border border-stone-200 text-rose-500 opacity-0 group-hover:opacity-100 transition-all rounded shadow-sm"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <div className="flex-1 space-y-2">
                      <label className="text-[10px] font-bold text-stone-500 uppercase">Student Name</label>
                      <StudentSearchSelect 
                        value={item.studentId}
                        onChange={(val) => updateTopStudent(idx, "studentId", val)}
                        students={students}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <label className="text-[10px] font-bold text-stone-500 uppercase">Engagement Rating ({item.rating}/10)</label>
                      <input type="range" min="0" max="10" value={item.rating} onChange={(e) => updateTopStudent(idx, "rating", parseInt(e.target.value))} className="w-full accent-accent mt-2" />
                    </div>
                  </div>
                ))}

                {formData.topStudents.length < 5 && (
                  <button 
                    onClick={addTopStudent}
                    className="w-full p-4 border-2 border-dashed border-stone-200 text-stone-400 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:border-accent hover:text-accent transition-all"
                  >
                    <Plus className="w-4 h-4" /> Add Top Performer
                  </button>
                )}
              </div>

              <div className="pt-10 border-t border-stone-100 flex justify-center">
                <button 
                  disabled={loading}
                  onClick={handleSubmit}
                  className="bg-primary text-white px-20 py-5 font-bold uppercase tracking-[0.3em] text-[10px] shadow-2xl hover:-translate-y-1 active:translate-y-0 transition-all flex items-center gap-4 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Seal Final Record <CheckCircle className="w-4 h-4" /></>}
                </button>
              </div>
              
              <div className="flex justify-start">
                <button onClick={handleBack} className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-1 hover:text-primary transition-all">
                   <ChevronLeft className="w-4 h-4" /> Back to stats
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SectionHeader({ number, title, icon: Icon }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-primary text-white flex items-center justify-center font-serif italic text-xl shadow-lg">
        {number}
      </div>
      <div>
        <h3 className="text-2xl font-serif font-bold text-primary italic">{title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <Icon className="w-3 h-3 text-accent" />
          <div className="h-[1px] w-12 bg-stone-200" />
        </div>
      </div>
    </div>
  );
}

function Question({ label, children }: any) {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-bold text-stone-600 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

function ChoiceCard({ selected, onClick, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`p-6 border-2 transition-all flex items-center justify-center gap-3 group ${selected ? "border-primary bg-primary text-white" : "border-stone-100 bg-stone-50 text-stone-400 hover:border-stone-200"}`}
    >
      <span className="text-xs font-bold uppercase tracking-[0.2em]">{label}</span>
      {selected && <CheckCircle className="w-4 h-4" />}
    </button>
  );
}

function NavButtons({ onNext, onBack }: any) {
  return (
    <div className="pt-10 flex justify-between items-center border-t border-stone-100">
      {onBack ? (
        <button onClick={onBack} className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-1 hover:text-primary transition-all">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
      ) : <div />}
      
      {onNext && (
        <button onClick={onNext} className="bg-primary text-white px-10 py-4 font-bold uppercase tracking-[0.2em] text-[10px] flex items-center gap-2 hover:shadow-xl transition-all">
          Save & Proceed <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

function StudentSearchSelect({ value, onChange, students }: { value: string, onChange: (val: string) => void, students: any[] }) {
  const [search, setSearch] = useState("");
  const filteredStudents = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-2 relative">
      {value ? (
        <div className="w-full p-3 bg-white border border-stone-200 text-sm flex justify-between items-center">
          <span>{students.find(s => s.id === value)?.name || "Unknown"}</span>
          <button onClick={() => { onChange(""); setSearch(""); }} className="text-stone-400 hover:text-rose-500">✕</button>
        </div>
      ) : (
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search student..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 bg-white border border-stone-200 text-sm outline-none focus:border-accent"
          />
          {search && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-stone-200 shadow-xl max-h-48 overflow-y-auto">
              {filteredStudents.length > 0 ? (
                filteredStudents.map(s => (
                  <div 
                    key={s.id} 
                    onClick={() => { onChange(s.id); setSearch(""); }}
                    className="p-3 hover:bg-stone-50 cursor-pointer text-sm border-b border-stone-50 last:border-0"
                  >
                    {s.name}
                  </div>
                ))
              ) : (
                <div className="p-3 text-stone-400 text-sm italic">No student found</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
