import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Mail, ShieldCheck } from "lucide-react";
import BroadcastButton from "@/components/WhatsAppBroadcastButton";
import Link from "next/link";

export default async function BroadcastPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || (session.user as any).role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <div className="bg-primary text-white pt-10 pb-20 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white/60 text-xs font-bold uppercase tracking-widest">
              <Mail className="w-4 h-4" /> Communications
            </div>
            <h1 className="text-4xl font-serif font-bold italic text-white">Broadcast Room</h1>
            <p className="text-white/70 font-medium">Send email reminders to students and mentors.</p>
          </div>
          <div className="flex gap-4">
             <Link href="/dashboard/admin" className="px-6 py-3 font-bold uppercase text-[10px] tracking-widest bg-white/10 hover:bg-white/20 transition-all border border-white/20">
                Back to Dashboard
             </Link>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 -mt-10">
        <div className="bg-white border border-stone-200 shadow-xl overflow-hidden p-8">
            <h2 className="text-xl font-serif font-bold text-primary mb-6 flex items-center gap-2">
               <ShieldCheck className="w-5 h-5" /> Launch Broadcast
            </h2>
            <div className="bg-primary p-6 text-white rounded shadow-lg">
                <BroadcastButton />
            </div>
            
            <div className="mt-8 pt-8 border-t border-stone-100">
                <h3 className="text-sm font-bold text-stone-800 uppercase tracking-widest mb-4">How it works</h3>
                <ul className="list-disc pl-5 space-y-2 text-stone-600 text-sm">
                    <li>Emails will be sent via AWS SES using your configured domain.</li>
                    <li>Students will receive a reminder to submit their daily study log.</li>
                    <li>Mentors will receive a reminder to submit their faculty log.</li>
                    <li>Only accounts with the "APPROVED" status will be targeted.</li>
                </ul>
            </div>
        </div>
      </div>
    </div>
  );
}
