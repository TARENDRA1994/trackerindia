"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Smile, Frown, Meh, Trophy, Heart, Coffee, 
  ChevronRight, ChevronLeft, Loader2, Save,
  Target, Clock, Zap, Sparkles, BookOpen, PenTool, ClipboardCheck, MessageSquare, AlertCircle, LayoutDashboard, Brain
} from "lucide-react";

const translations: any = {
  English: {
    sections: {
      0: "SECTION 0: Overall Purpose",
      1: "SECTION 1: Emotional & Mental Well-Being",
      2: "SECTION 2: Sleep Cycle",
      3: "SECTION 3: Core Study Activity",
      4: "SECTION 4: Self-Analysis of Quality & Focus",
      5: "SECTION 5: Answer Writing",
      6: "SECTION 6: Test Tracking",
      7: "SECTION 7: Learning & Retention",
      8: "SECTION 8: Planning",
      9: "SECTION 9: Feedback & Support",
    },
    subtitles: {
      0: "Set your focus for tomorrow.",
    },
    questions: {
      Q0: "What is your primary goal for tomorrow?",
      Q1: "How are you feeling today?",
      Q2: "What time did you wake up today?",
      Q3: "How Much time did you sleep?",
      Q4: "Did you study Current Affairs Today?",
      Q5: "Did you analyse or solve PYQ today?",
      Q6: "Which Subjects have you studied today?",
      Q7: "Total Study hours?",
      Q8: "How much of your Planned work is completed as per yesterday's plan?",
      Q9: "Mark Your Focus level as per yourself?",
      Q10: "What was your biggest distraction today?",
      Q11: "How will you reduce this distraction tomorrow?",
      Q12: "Did You Practiced answer writing today?",
      Q12a: "Number of answers written?",
      Q12b: "Did your mentor evaluate them?",
      Q13: "Did you attempt any test today?",
      Q13a: "Test Name?",
      Q13b: "Score?",
      Q13c: "Primary mistakes?",
      Q13d: "Main reason for the mistakes?",
      Q14: "Subjects revised?",
      Q15: "Hardest topic today?",
      Q16: "Self Retention Level (0-100%)",
      Q17: "Overall Understanding level from the Last Revision?",
      Q18: "Do you want to take a challenge for tomorrow?",
      Q18a: "Explain your challenge?",
      Q19: "General feedback for mentor",
      Q19a: "Please explain your feedback",
    },
    options: {
      yes: "Yes",
      no: "No",
      submit: "Submit Daily Reflection",
      previous: "Previous",
      continue: "Continue",
      done: "Reflection Submitted",
      return: "Return to Dashboard",
      diagnosis: "Academic Diagnosis",
      improvements: "Improvement Areas"
    }
  },
  Hindi: {
    sections: {
      0: "अनुभाग 0: समग्र उद्देश्य",
      1: "अनुभाग 1: भावनात्मक और मानसिक भलाई",
      2: "अनुभाग 2: नींद का चक्र",
      3: "अनुभाग 3: मुख्य अध्ययन गतिविधि",
      4: "अनुभाग 4: गुणवत्ता और फोकस का स्व-विश्लेषण",
      5: "अनुभाग 5: उत्तर लेखन",
      6: "अनुभाग 6: टेस्ट ट्रैकिंग",
      7: "अनुभाग 7: सीखना और प्रतिधारण (Retention)",
      8: "अनुभाग 8: योजना बनाना",
      9: "अनुभाग 9: प्रतिक्रिया और समर्थन",
    },
    subtitles: {
      0: "कल के लिए अपना लक्ष्य निर्धारित करें।",
    },
    questions: {
      Q0: "कल के लिए आपका प्राथमिक लक्ष्य क्या है?",
      Q1: "आज आप कैसा महसूस कर रहे हैं?",
      Q2: "आज आप किस समय जागे?",
      Q3: "आपने कितना समय सोया?",
      Q4: "क्या आपने आज करेंट अफेयर्स का अध्ययन किया?",
      Q5: "क्या आपने आज PYQ का विश्लेषण या समाधान किया?",
      Q6: "आज आपने किन विषयों का अध्ययन किया?",
      Q7: "कुल अध्ययन के घंटे?",
      Q8: "कल की योजना के अनुसार आपका कितना काम पूरा हुआ है?",
      Q9: "अपने अनुसार अपने फोकस स्तर को चिह्नित करें?",
      Q10: "आज आपका सबसे बड़ा ध्यान भंग (Distraction) क्या था?",
      Q11: "कल आप इस ध्यान भंग को कैसे कम करेंगे?",
      Q12: "क्या आपने आज उत्तर लेखन का अभ्यास किया?",
      Q12a: "लिखे गए उत्तरों की संख्या?",
      Q12b: "क्या आपके मेंटॉर ने उनका मूल्यांकन किया?",
      Q13: "क्या आपने आज कोई टेस्ट दिया?",
      Q13a: "टेस्ट का नाम?",
      Q13b: "स्कोर?",
      Q13c: "मुख्य गलतियाँ?",
      Q13d: "गलतियों का मुख्य कारण?",
      Q14: "दोहराए गए विषय?",
      Q15: "आज का सबसे कठिन विषय?",
      Q16: "स्वयं प्रतिधारण स्तर (0-100%)",
      Q17: "पिछले रिवीजन से समग्र समझ का स्तर?",
      Q18: "क्या आप कल के लिए कोई चुनौती लेना चाहते हैं?",
      Q18a: "अपनी चुनौती समझाएं?",
      Q19: "मेंटॉर के लिए सामान्य प्रतिक्रिया",
      Q19a: "कृपया अपनी प्रतिक्रिया समझाएं",
    },
    options: {
      yes: "हाँ",
      no: "नहीं",
      submit: "दैनिक प्रतिबिंब जमा करें",
      previous: "पिछला",
      continue: "जारी रखें",
      done: "प्रतिबिंब जमा किया गया",
      return: "डैशबोर्ड पर वापस जाएं",
      diagnosis: "शैक्षणिक निदान",
      improvements: "सुधार के क्षेत्र"
    }
  }
};

const emotions = [
  { name: "Proud", icon: Trophy, color: "text-amber-600" },
  { name: "Happy", icon: Smile, color: "text-green-600" },
  { name: "Motivated", icon: Heart, color: "text-pink-600" },
  { name: "Normal", icon: Meh, color: "text-blue-600" },
  { name: "Sad", icon: Frown, color: "text-slate-600" },
  { name: "Depressed", icon: Coffee, color: "text-purple-600" },
];

const subjectsList = [
  "History", "Polity", "Economy", "Geography", "Science & Tech", 
  "CSAT", "IR", "IS", "Environment", "Governance", "Ethics"
];

const distractionsList = [
  "Phone / Social Media", "Overthinking / Anxiety", "Sleep / Low energy", "Environment", "No clear plan", "Other"
];

export default function DailyLogForm({ medium = "English" }: { medium?: string }) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Auto-scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, submitted]);
  const [aiResult, setAiResult] = useState<{diagnosis: string, improvements: string} | null>(null);
  const [formData, setFormData] = useState({
    primaryGoal: "",
    feeling: "",
    wakeUpTime: "06:00",
    sleepDuration: "6-8",
    currentAffairsDone: false,
    pyqAnalysisDone: false,
    subjectsStudied: [] as string[],
    studyHours: "6-8",
    workCompleted: "50-75%",
    focusLevel: "Moderate",
    biggestDistraction: "",
    reductionPlan: "",
    answerWritingDone: false,
    answersCount: 0,
    reviewedAnswers: false,
    testAttempted: false,
    testName: "",
    testScore: "",
    mistakeType: "",
    mistakeReason: "",
    subjectsRevised: [] as string[],
    hardestTopic: "",
    retentionScore: 70,
    understandingLevel: "Basic",
    takeChallenge: false,
    challengeExplanation: "",
    feedback: "",
    feedbackExplanation: "",
  });

  const totalSteps = 10;
  const t = (key: string, section?: string) => {
    const lang = translations[medium] || translations.English;
    if (section) return lang[section][key] || key;
    return lang.options[key] || key;
  };

  const handleToggle = (field: string, val: string) => {
    setFormData(prev => {
      const list = (prev as any)[field] as string[];
      return {
        ...prev,
        [field]: list.includes(val) ? list.filter(s => s !== val) : [...list, val]
      };
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const data = await res.json();
        setAiResult({
          diagnosis: data.log.aiAnalysis,
          improvements: data.log.aiImprovement
        });
        setSubmitted(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    switch(step) {
      case 0: return formData.primaryGoal.trim() !== "";
      case 1: return formData.feeling !== "";
      case 2: return formData.wakeUpTime !== "";
      case 3: return formData.subjectsStudied.length > 0;
      case 4: return formData.biggestDistraction !== "" && formData.reductionPlan.trim() !== "";
      case 5: return !formData.answerWritingDone || formData.answersCount > 0;
      case 6: return !formData.testAttempted || (formData.testName.trim() !== "" && formData.testScore !== "" && formData.mistakeType !== "" && formData.mistakeReason !== "");
      case 7: return formData.subjectsRevised.length > 0 && formData.hardestTopic.trim() !== "";
      case 8: return !formData.takeChallenge || formData.challengeExplanation.trim() !== "";
      case 9: return formData.feedback !== "" && ((formData.feedback !== "Poor" && formData.feedback !== "Average") || formData.feedbackExplanation.trim() !== "");
      default: return true;
    }
  };

  const renderStep = () => {
    switch(step) {
      case 0: return (
        <div className="space-y-8">
          <SectionHeader title={t("0", "sections")} subtitle={t("0", "subtitles")} />
          <QuestionBlock q="Q0" label={t("Q0", "questions")}>
            <textarea className="w-full p-4 border border-stone-200 outline-none min-h-[150px] font-serif italic text-lg focus:border-primary" value={formData.primaryGoal} onChange={(e) => setFormData({...formData, primaryGoal: e.target.value})} />
          </QuestionBlock>
        </div>
      );
      case 1: return (
        <div className="space-y-8">
          <SectionHeader title={t("1", "sections")} />
          <QuestionBlock q="Q1" label={t("Q1", "questions")}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {emotions.map((e) => (
                <button key={e.name} onClick={() => setFormData({ ...formData, feeling: e.name })} className={`p-6 border flex flex-col items-center gap-3 transition-all ${formData.feeling === e.name ? "bg-primary/5 border-primary shadow-sm" : "border-border hover:border-primary/20"}`}>
                  <e.icon className={`w-8 h-8 ${e.color}`} />
                  <span className="text-xs font-bold uppercase tracking-widest">{e.name}</span>
                </button>
              ))}
            </div>
          </QuestionBlock>
        </div>
      );
      case 2: return (
        <div className="space-y-12">
          <SectionHeader title={t("2", "sections")} />
          <QuestionBlock q="Q2" label={t("Q2", "questions")}>
             <input type="time" className="p-4 border border-stone-200 outline-none text-2xl font-serif font-bold w-full md:w-auto" value={formData.wakeUpTime} onChange={(e) => setFormData({...formData, wakeUpTime: e.target.value})} />
          </QuestionBlock>
          <QuestionBlock q="Q3" label={t("Q3", "questions")}>
             <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {["0–2", "2–4", "4–5", "5–6", "6–8", "8+"].map(opt => (
                  <button key={opt} onClick={() => setFormData({...formData, sleepDuration: opt})} className={`p-4 border text-[10px] font-bold transition-all ${formData.sleepDuration === opt ? "bg-primary text-white border-primary" : "border-border hover:border-primary/20"}`}>
                    {opt}
                  </button>
                ))}
              </div>
          </QuestionBlock>
        </div>
      );
      case 3: return (
        <div className="space-y-12">
          <SectionHeader title={t("3", "sections")} />
          <div className="space-y-10">
             <QuestionBlock q="Q4" label={t("Q4", "questions")}>
                <VerticalToggle active={formData.currentAffairsDone} onClick={(v) => setFormData({...formData, currentAffairsDone: v})} medium={medium} />
             </QuestionBlock>
             <QuestionBlock q="Q5" label={t("Q5", "questions")}>
                <VerticalToggle active={formData.pyqAnalysisDone} onClick={(v) => setFormData({...formData, pyqAnalysisDone: v})} medium={medium} />
             </QuestionBlock>
             <QuestionBlock q="Q6" label={t("Q6", "questions")}>
                <div className="flex flex-wrap gap-2">
                  {subjectsList.map(s => (
                    <button key={s} onClick={() => handleToggle("subjectsStudied", s)} className={`px-4 py-2 text-[10px] font-bold uppercase border transition-all ${formData.subjectsStudied.includes(s) ? "bg-primary text-white border-primary" : "border-border hover:border-primary/20"}`}>
                      {s}
                    </button>
                  ))}
                </div>
             </QuestionBlock>
             <QuestionBlock q="Q7" label={t("Q7", "questions")}>
                <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                  {["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12+"].map(opt => (
                    <button key={opt} onClick={() => setFormData({...formData, studyHours: opt})} className={`p-3 border text-[10px] font-bold transition-all ${formData.studyHours === opt ? "bg-primary text-white border-primary" : "border-border hover:border-primary/20"}`}>
                      {opt}
                    </button>
                  ))}
                </div>
             </QuestionBlock>
          </div>
        </div>
      );
      case 4: return (
        <div className="space-y-12">
          <SectionHeader title={t("4", "sections")} />
          <VerticalSelection q="Q8" label={t("Q8", "questions")} options={["0–25%", "25–50%", "50–75%", "75–100%"]} value={formData.workCompleted} onChange={(v: string) => setFormData({...formData, workCompleted: v})} />
          <VerticalSelection q="Q9" label={t("Q9", "questions")} options={["Very low", "Low", "Moderate", "High", "Deep focus"]} value={formData.focusLevel} onChange={(v: string) => setFormData({...formData, focusLevel: v})} />
          <VerticalSelection q="Q10" label={t("Q10", "questions")} options={distractionsList} value={formData.biggestDistraction} onChange={(v: string) => setFormData({...formData, biggestDistraction: v})} />
          <QuestionBlock q="Q11" label={t("Q11", "questions")}>
              <textarea className="w-full p-4 border border-stone-200 outline-none min-h-[100px] italic" value={formData.reductionPlan} onChange={(e) => setFormData({...formData, reductionPlan: e.target.value})} />
          </QuestionBlock>
        </div>
      );
      case 5: return (
        <div className="space-y-12">
          <SectionHeader title={t("5", "sections")} />
          <QuestionBlock q="Q12" label={t("Q12", "questions")}>
            <VerticalToggle active={formData.answerWritingDone} onClick={(v) => setFormData({...formData, answerWritingDone: v})} medium={medium} />
            {formData.answerWritingDone && (
              <div className="mt-8 space-y-8 pl-8 border-l border-primary/10">
                <QuestionBlock q="Q12a" label={t("Q12a", "questions")}>
                  <input type="number" className="p-4 border border-stone-200 outline-none text-xl font-bold w-32" value={formData.answersCount} onChange={(e) => setFormData({...formData, answersCount: parseInt(e.target.value)})} />
                </QuestionBlock>
                <QuestionBlock q="Q12b" label={t("Q12b", "questions")}>
                   <VerticalToggle active={formData.reviewedAnswers} onClick={(v) => setFormData({...formData, reviewedAnswers: v})} medium={medium} />
                </QuestionBlock>
              </div>
            )}
          </QuestionBlock>
        </div>
      );
      case 6: return (
        <div className="space-y-12">
          <SectionHeader title={t("6", "sections")} />
          <QuestionBlock q="Q13" label={t("Q13", "questions")}>
             <VerticalToggle active={formData.testAttempted} onClick={(v) => setFormData({...formData, testAttempted: v})} medium={medium} />
             {formData.testAttempted && (
               <div className="mt-8 space-y-8 pl-8 border-l border-primary/10">
                  <QuestionBlock q="Q13a" label={t("Q13a", "questions")}>
                     <input className="w-full p-4 border border-stone-200 outline-none italic" placeholder="e.g. Vision IAS PT 12" value={formData.testName} onChange={(e) => setFormData({...formData, testName: e.target.value})} />
                  </QuestionBlock>
                  <QuestionBlock q="Q13b" label={t("Q13b", "questions")}>
                     <input type="number" className="p-4 border border-stone-200 outline-none text-xl font-bold w-32" value={formData.testScore} onChange={(e) => setFormData({...formData, testScore: e.target.value})} />
                  </QuestionBlock>
                  <VerticalSelection q="Q13c" label={t("Q13c", "questions")} options={["Factual Mistakes", "Conceptual Mistakes", "Logical Mistakes", "Silly Mistakes"]} value={formData.mistakeType} onChange={(v: string) => setFormData({...formData, mistakeType: v})} />
                  <VerticalSelection q="Q13d" label={t("Q13d", "questions")} options={["Lack of Revision", "Misinterpretation", "Time Pressure", "All above Reasons"]} value={formData.mistakeReason} onChange={(v: string) => setFormData({...formData, mistakeReason: v})} />
               </div>
             )}
          </QuestionBlock>
        </div>
      );
      case 7: return (
        <div className="space-y-12">
          <SectionHeader title={t("7", "sections")} />
          <QuestionBlock q="Q14" label={t("Q14", "questions")}>
             <div className="flex flex-wrap gap-2">
               {subjectsList.map(s => (
                 <button key={s} onClick={() => handleToggle("subjectsRevised", s)} className={`px-4 py-2 text-[10px] font-bold uppercase border transition-all ${formData.subjectsRevised.includes(s) ? "bg-primary text-white border-primary" : "border-border hover:border-primary/20"}`}>
                   {s}
                 </button>
               ))}
             </div>
          </QuestionBlock>
          <QuestionBlock q="Q15" label={t("Q15", "questions")}>
             <input className="w-full p-4 border border-stone-200 outline-none italic" value={formData.hardestTopic} onChange={(e) => setFormData({...formData, hardestTopic: e.target.value})} />
          </QuestionBlock>
          <QuestionBlock q="Q16" label={t("Q16", "questions")}>
             <input type="range" className="w-full accent-primary" value={formData.retentionScore} onChange={(e) => setFormData({...formData, retentionScore: parseInt(e.target.value)})} />
             <p className="text-right font-bold text-primary">{formData.retentionScore}%</p>
          </QuestionBlock>
          <VerticalSelection q="Q17" label={t("Q17", "questions")} options={["Basic", "Moderate", "High"]} value={formData.understandingLevel} onChange={(v: string) => setFormData({...formData, understandingLevel: v})} />
        </div>
      );
      case 8: return (
        <div className="space-y-12">
          <SectionHeader title={t("8", "sections")} />
          <QuestionBlock q="Q18" label={t("Q18", "questions")}>
             <VerticalToggle active={formData.takeChallenge} onClick={(v) => setFormData({...formData, takeChallenge: v})} medium={medium} />
             {formData.takeChallenge && (
               <div className="mt-8 space-y-8 pl-8 border-l border-primary/10">
                 <QuestionBlock q="Q18a" label={t("Q18a", "questions")}>
                    <textarea className="w-full p-4 border border-stone-200 outline-none italic min-h-[100px]" value={formData.challengeExplanation} onChange={(e) => setFormData({...formData, challengeExplanation: e.target.value})} />
                 </QuestionBlock>
               </div>
             )}
          </QuestionBlock>
        </div>
      );
      case 9: return (
        <div className="space-y-12">
          <SectionHeader title={t("9", "sections")} />
          <VerticalSelection 
            q="Q19" 
            label={t("Q19", "questions")} 
            options={["Excellent", "Good", "Average", "Poor"]} 
            value={formData.feedback} 
            onChange={(v: string) => setFormData({...formData, feedback: v})} 
          />
          {(formData.feedback === "Poor" || formData.feedback === "Average") && (
            <QuestionBlock q="Q19a" label={t("Q19a", "questions")}>
               <textarea className="w-full p-4 border border-stone-200 outline-none mt-4 italic min-h-[100px]" placeholder="Please provide an explanation..." value={formData.feedbackExplanation} onChange={(e) => setFormData({...formData, feedbackExplanation: e.target.value})} />
            </QuestionBlock>
          )}
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white border border-stone-100 shadow-2xl min-h-[800px] flex flex-col relative overflow-hidden">
      <div className="h-1.5 w-full bg-slate-50">
        <motion.div initial={{ width: 0 }} animate={{ width: `${(step / (totalSteps - 1)) * 100}%` }} className="h-full bg-primary" />
      </div>
      <div className="p-10 md:p-16 flex-1">
        <AnimatePresence mode="wait">
          {!submitted ? renderStep() : (
            <div className="flex flex-col items-center justify-center h-full py-10 space-y-10">
               <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center"><Sparkles className="w-10 h-10 text-primary" /></motion.div>
               
               <div className="text-center space-y-2">
                  <h3 className="text-4xl font-serif font-bold text-primary italic">{t("done")}</h3>
                  <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">Immediate AI Mentorship Assessment</p>
               </div>

               {aiResult && (
                 <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="p-8 bg-stone-50 border border-stone-200 space-y-4">
                       <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary flex items-center gap-2"><Brain className="w-4 h-4 text-accent" /> {t("diagnosis")}</h4>
                       <p className="text-sm font-serif italic text-stone-600 leading-relaxed font-medium">"{aiResult.diagnosis}"</p>
                    </motion.div>
                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="p-8 bg-primary text-white space-y-4 shadow-2xl">
                       <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent flex items-center gap-2"><Target className="w-4 h-4" /> {t("improvements")}</h4>
                       <p className="text-sm font-serif italic text-white/90 leading-relaxed font-medium">"{aiResult.improvements}"</p>
                    </motion.div>
                 </div>
               )}

               <button onClick={() => window.location.href = "/dashboard"} className="px-12 py-4 border border-stone-200 text-[10px] font-bold uppercase tracking-widest hover:bg-stone-50 transition-all flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" /> {t("return")}
               </button>
            </div>
          )}
        </AnimatePresence>
      </div>
      {!submitted && (
        <div className="p-10 border-t border-stone-50 flex justify-between bg-stone-50/50">
          <div className="text-[10px] font-bold text-stone-300 uppercase tracking-[0.2em] self-center">Progress: {Math.round((step/totalSteps)*100)}%</div>
          <div className="flex gap-4">
            {step > 0 && <button onClick={() => setStep(step - 1)} className="px-8 py-3 border border-stone-200 text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all"><ChevronLeft className="inline w-4 h-4 mr-2" /> {t("previous")}</button>}
            {step < totalSteps - 1 ? (
              <button onClick={() => setStep(step + 1)} disabled={!isStepValid()} className={`px-12 py-3 text-[10px] font-bold uppercase tracking-widest transition-all ${isStepValid() ? "bg-primary text-white shadow-xl shadow-primary/20 hover:translate-y-[-2px]" : "bg-stone-200 text-stone-400 cursor-not-allowed"}`}>{t("continue")} <ChevronRight className="inline w-4 h-4 ml-2" /></button>
            ) : (
              <button onClick={handleSubmit} disabled={loading || !isStepValid()} className={`px-12 py-3 text-[10px] font-bold uppercase tracking-widest transition-all ${isStepValid() && !loading ? "bg-accent text-accent-foreground shadow-xl shadow-accent/20" : "bg-stone-200 text-stone-400 cursor-not-allowed"}`}>{loading ? <Loader2 className="animate-spin" /> : <><Save className="inline w-4 h-4 mr-2" /> {t("submit")}</>}</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string, subtitle?: string }) { return ( <div className="border-b border-stone-100 pb-8"> <h2 className="text-4xl font-serif font-bold text-primary italic">{title}</h2> {subtitle && <p className="text-stone-400 text-sm mt-3 font-medium uppercase tracking-widest">{subtitle}</p>} </div> ); }

function QuestionBlock({ q, label, children }: any) { return ( <div className="space-y-4"> <div className="space-y-1"> <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/40 block">{q}</label> <h3 className="text-xl font-serif font-bold text-primary italic">{label}</h3> </div> <div className="pt-2">{children}</div> </div> ); }

function VerticalToggle({ active, onClick, medium }: { active: boolean | null, onClick: (v: boolean) => void, medium: string }) { 
  const lang = translations[medium] || translations.English;
  return ( <div className="flex flex-col gap-2 w-full md:w-48"> <button onClick={() => onClick(true)} className={`p-4 border text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${active === true ? "bg-primary text-white border-primary shadow-lg" : "bg-white border-stone-200 text-stone-400 hover:border-primary/40"}`}>{lang.options.yes}</button> <button onClick={() => onClick(false)} className={`p-4 border text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${active === false ? "bg-primary text-white border-primary shadow-lg" : "bg-white border-stone-200 text-stone-400 hover:border-primary/40"}`}>{lang.options.no}</button> </div> ); 
}

function VerticalSelection({ q, label, options, value, onChange }: any) { return ( <QuestionBlock q={q} label={label}> <div className="flex flex-col gap-3"> {options.map((opt: string) => ( <button key={opt} onClick={() => onChange(opt)} className={`w-full p-5 border text-left flex justify-between items-center transition-all ${value === opt ? "bg-slate-50 border-primary border-l-8" : "border-stone-100 hover:border-stone-300"}`}> <span className={`text-xs font-bold uppercase tracking-widest ${value === opt ? "text-primary" : "text-stone-400"}`}>{opt}</span> {value === opt && <div className="w-2 h-2 rounded-full bg-primary" />} </button> ))} </div> </QuestionBlock> ); }
