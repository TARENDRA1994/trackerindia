import MentorCreationForm from "@/components/MentorCreationForm";
import { ShieldAlert } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function NewMentorPage() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN" || session.user?.email !== "tarendra.gadhewal2024@gmail.com") {
    redirect("/login?role=ADMIN");
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <div className="bg-white border-b border-stone-200 py-16 mb-12">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
           <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                 <ShieldAlert className="w-5 h-5 text-accent" />
                 <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Administrative Protocol</span>
              </div>
              <h1 className="text-5xl font-serif font-bold text-primary italic">User Provisioning</h1>
           </div>
        </div>
      </div>

      <div className="px-6">
        <MentorCreationForm />
      </div>
    </div>
  );
}
