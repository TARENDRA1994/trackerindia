import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { Lock, Clock, AlertCircle, Phone, XCircle } from "lucide-react";
import Link from "next/link";

export default async function RestrictedPage() {
  const session = await getServerSession(authOptions);
  const status = (session?.user as any)?.status || "PENDING";
  
  const statusContent = {
    PENDING: {
      title: "Application Under Review",
      description: "Our admin team is currently reviewing your profile. You will receive an email once your account is activated.",
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100"
    },
    HOLD: {
      title: "Account on Hold",
      description: "Your access has been temporarily restricted by the administration. Please reach out to your mentor or the helpdesk.",
      icon: AlertCircle,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100"
    },
    REJECTED: {
      title: "Application Rejected",
      description: "We regret to inform you that your registration could not be approved at this time.",
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-100"
    },
    APPROVED: {
      title: "Something Went Wrong",
      description: "Your account is active, but you reached this page by mistake.",
      icon: Lock,
      color: "text-slate-600",
      bg: "bg-slate-50",
      border: "border-slate-100"
    }
  };

  const content = statusContent[status as keyof typeof statusContent] || statusContent.PENDING;

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-6">
      <div className={`max-w-md w-full p-10 border shadow-2xl bg-white text-center space-y-8`}>
        <div className={`w-20 h-20 mx-auto rounded-full ${content.bg} flex items-center justify-center`}>
          <content.icon className={`w-10 h-10 ${content.color}`} />
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-serif font-bold text-primary">{content.title}</h1>
          <p className="text-stone-600 leading-relaxed font-medium">
            {content.description}
          </p>
        </div>

        <div className="pt-6 space-y-4">
          <Link 
            href="https://wa.me/919999999999" 
            className="flex items-center justify-center gap-3 w-full py-4 bg-[#25D366] text-white font-bold uppercase tracking-widest text-xs shadow-lg hover:shadow-xl transition-all"
          >
            <Phone className="w-4 h-4" /> Connect with Admin
          </Link>
          <Link 
            href="/" 
            className="block text-xs font-bold text-stone-400 uppercase tracking-widest hover:text-primary transition-colors"
          >
            Return to Home
          </Link>
        </div>

        <div className="pt-10 border-t border-stone-100">
           <p className="text-[10px] font-bold text-stone-300 uppercase tracking-[0.2em]">Tracker India Security Protocol</p>
        </div>
      </div>
    </div>
  );
}
