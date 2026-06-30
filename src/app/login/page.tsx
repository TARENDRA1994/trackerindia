import LoginForm from "@/components/LoginForm";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-center font-bold text-stone-500">Loading Portal...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
