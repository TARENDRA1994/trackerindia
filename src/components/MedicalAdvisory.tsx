"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  HeartPulse, 
  Stethoscope, 
  Brain, 
  Eye, 
  Moon, 
  Activity,
  Loader2,
  CheckCircle2,
  Calendar,
  ChevronRight
} from "lucide-react";

export default function MedicalAdvisory() {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    sleepQuality: "Good",
    eyeStrain: "Moderate",
    stressLevel: "High",
    headacheFrequency: "Rarely",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/medical", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setSuggestions(data.suggestions);
      setSubmitted(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white border border-border p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-red-600" />
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-red-50 rounded-lg">
              <Stethoscope className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-primary">Health Assessment</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Moon className="w-4 h-4" /> Sleep Quality
              </label>
              <select 
                className="w-full p-3 bg-slate-50 border-b-2 border-border focus:border-red-600 outline-none transition-colors"
                value={formData.sleepQuality}
                onChange={(e) => setFormData({...formData, sleepQuality: e.target.value})}
              >
                <option value="Excellent">Excellent (7-8h restful)</option>
                <option value="Good">Good (6-7h)</option>
                <option value="Poor">Poor (Interrupted / less than 5h)</option>
                <option value="Insomnia">Insomnia (Difficulty falling asleep)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Eye className="w-4 h-4" /> Eye Strain Level
              </label>
              <select 
                className="w-full p-3 bg-slate-50 border-b-2 border-border focus:border-red-600 outline-none transition-colors"
                value={formData.eyeStrain}
                onChange={(e) => setFormData({...formData, eyeStrain: e.target.value})}
              >
                <option value="None">None</option>
                <option value="Mild">Mild (Dry eyes)</option>
                <option value="Moderate">Moderate (Blured vision sometimes)</option>
                <option value="Severe">Severe (Persistent pain)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Brain className="w-4 h-4" /> Stress Level
              </label>
              <select 
                className="w-full p-3 bg-slate-50 border-b-2 border-border focus:border-red-600 outline-none transition-colors"
                value={formData.stressLevel}
                onChange={(e) => setFormData({...formData, stressLevel: e.target.value})}
              >
                <option value="Low">Low (Calm)</option>
                <option value="Moderate">Moderate (Normal pressure)</option>
                <option value="High">High (Anxiety about exam)</option>
                <option value="Burnout">Burnout (Extreme exhaustion)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Activity className="w-4 h-4" /> Headache Frequency
              </label>
              <select 
                className="w-full p-3 bg-slate-50 border-b-2 border-border focus:border-red-600 outline-none transition-colors"
                value={formData.headacheFrequency}
                onChange={(e) => setFormData({...formData, headacheFrequency: e.target.value})}
              >
                <option value="Never">Never</option>
                <option value="Rarely">Rarely (1-2 per month)</option>
                <option value="Often">Often (Weekly)</option>
                <option value="Daily">Daily</option>
              </select>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white p-4 font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Get AI Medical Advice"}
            </button>

            {submitted && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-green-50 border border-green-200 text-green-800 text-sm flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Thank you! Your health data has been securely logged and analyzed.
              </motion.div>
            )}
          </form>
        </div>

        {/* AI Suggestions Section */}
        <div className="space-y-8 flex flex-col">
          <div className="bg-primary text-white p-10 flex-1 relative overflow-hidden">
            <HeartPulse className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 opacity-20" />
            <h3 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
              <Activity className="text-red-400" /> AI Insights
            </h3>
            
            {suggestions ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="prose prose-invert max-w-none text-white/90 leading-relaxed italic">
                  {suggestions.split("\n").map((line, i) => (
                    <p key={i} className="mb-2">• {line.replace(/^[•\d.-]+\s*/, "")}</p>
                  ))}
                </div>
                <div className="p-4 bg-white/10 rounded border border-white/20 text-xs flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span>Recommendations based on your specific study load and health data.</span>
                </div>
              </motion.div>
            ) : (
              <p className="text-white/60 italic">Submit the assessment to receive personalized study-wellness recommendations from the AI Advisor.</p>
            )}
          </div>

          <div className="bg-white border border-border p-8">
            <h4 className="font-bold text-primary mb-4 uppercase tracking-widest text-[10px]">Administrative Support</h4>
            <div className="grid grid-cols-1 gap-3">
              <button className="text-left p-3 text-sm border border-border hover:bg-slate-50 transition-colors flex items-center justify-between group">
                Book a Session with Mentor <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="text-left p-3 text-sm border border-border hover:bg-slate-50 transition-colors flex items-center justify-between group">
                Contact Technical Support <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="text-left p-3 text-sm border border-border hover:bg-slate-50 transition-colors flex items-center justify-between group">
                Consult a Wellness Specialist <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
