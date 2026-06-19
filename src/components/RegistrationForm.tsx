"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, ChevronRight, Loader2 } from "lucide-react";

const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Puducherry"
];

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    dob: "",
    state: "",
    city: "",
    medium: "English",
    exam: "UPSC",
    targetYear: "2027",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto text-center p-12 bg-white shadow-xl border border-border rounded-lg"
      >
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
        <h2 className="text-3xl font-serif font-bold text-primary mb-4">Registration Received</h2>
        <p className="text-foreground/80 mb-6">
          Thank you for joining <strong>Tracker India</strong>. Your application is now with our administrative team for verification.
        </p>
        <p className="text-sm text-muted-foreground bg-muted p-4 rounded border">
          You will receive a WhatsApp message with your login credentials once approved.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-[#FDFDFD] p-8 md:p-12 shadow-2xl border border-border relative overflow-hidden">
      {/* Decorative Top Bar */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />
      
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-serif font-bold text-primary mb-2">Tracker India 🇮🇳</h1>
        <p className="text-muted-foreground uppercase tracking-widest text-xs font-semibold">Aspirant Enrollment Portal</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 border border-red-200 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground/80">Full Name</label>
            <input
              required
              name="name"
              type="text"
              className="w-full p-3 bg-white border-b-2 border-border focus:border-primary outline-none transition-colors"
              placeholder="e.g. Rahul Sharma"
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground/80">Email ID</label>
            <input
              required
              name="email"
              type="email"
              className="w-full p-3 bg-white border-b-2 border-border focus:border-primary outline-none transition-colors"
              placeholder="rahul@example.com"
              onChange={handleChange}
            />
          </div>

          {/* WhatsApp */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground/80">WhatsApp Number</label>
            <input
              required
              name="whatsapp"
              type="tel"
              className="w-full p-3 bg-white border-b-2 border-border focus:border-primary outline-none transition-colors"
              placeholder="+91 XXXXX XXXXX"
              onChange={handleChange}
            />
          </div>

          {/* DOB */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground/80">Date of Birth</label>
            <input
              required
              name="dob"
              type="date"
              className="w-full p-3 bg-white border-b-2 border-border focus:border-primary outline-none transition-colors"
              onChange={handleChange}
            />
          </div>

          {/* State */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground/80">State</label>
            <select
              required
              name="state"
              className="w-full p-3 bg-white border-b-2 border-border focus:border-primary outline-none transition-colors"
              onChange={handleChange}
            >
              <option value="">Select State</option>
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* City */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground/80">City</label>
            <input
              required
              name="city"
              type="text"
              className="w-full p-3 bg-white border-b-2 border-border focus:border-primary outline-none transition-colors"
              placeholder="Enter City"
              onChange={handleChange}
            />
          </div>

          {/* Medium */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground/80">Medium</label>
            <div className="flex gap-4 p-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="medium" value="English" defaultChecked onChange={handleChange} className="accent-primary" />
                <span className="text-sm">English</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="medium" value="Hindi" onChange={handleChange} className="accent-primary" />
                <span className="text-sm">Hindi</span>
              </label>
            </div>
          </div>

          {/* Exam */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground/80">Target Exam</label>
            <select
              required
              name="exam"
              className="w-full p-3 bg-white border-b-2 border-border focus:border-primary outline-none transition-colors"
              onChange={handleChange}
            >
              <option value="UPSC">UPSC Civil Services</option>
              <option value="State PCS">State PCS</option>
            </select>
          </div>

          {/* Target Year */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground/80">Target Year</label>
            <select
              required
              name="targetYear"
              className="w-full p-3 bg-white border-b-2 border-border focus:border-primary outline-none transition-colors"
              onChange={handleChange}
            >
              {[2027, 2028, 2029, 2030].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        <div className="pt-6">
          <button
            disabled={loading}
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white p-4 font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Complete Enrollment <ChevronRight className="w-5 h-5" /></>}
          </button>
        </div>
      </form>
      
      <p className="text-center text-[10px] text-muted-foreground mt-8 uppercase tracking-tighter">
        Secure Governance Protocol Enforced • Data Privacy Guaranteed
      </p>
    </div>
  );
}
