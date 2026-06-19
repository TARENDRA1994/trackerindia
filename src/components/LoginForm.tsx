"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogIn, Loader2, AlertCircle } from "lucide-react";

export default function LoginForm() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        loginId,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white p-10 border border-border shadow-2xl relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-serif font-bold text-primary mb-2">Aspirant Login</h1>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Tracker India 🇮🇳</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 border border-red-200 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error === "CredentialsSignin" ? "Invalid User ID or Password" : error}</p>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground/80">User ID</label>
          <input
            required
            type="text"
            className="w-full p-3 bg-white border-b-2 border-border focus:border-primary outline-none transition-colors"
            placeholder="TI-XXXXXX"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground/80">Password</label>
          <input
            required
            type="password"
            className="w-full p-3 bg-white border-b-2 border-border focus:border-primary outline-none transition-colors"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-white p-4 font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : <><LogIn className="w-5 h-5" /> Sign In</>}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-dashed border-border text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account? <a href="/register" className="text-primary font-bold hover:underline">Enroll Now</a>
        </p>
      </div>
    </div>
  );
}
