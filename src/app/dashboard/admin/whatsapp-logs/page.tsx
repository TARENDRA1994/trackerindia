import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { MessageSquare, AlertCircle, CheckCircle2, Clock, MessageSquareReply } from "lucide-react";
import Link from "next/link";

export default async function WhatsAppLogsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || (session.user as any).role !== "ADMIN") {
    redirect("/login");
  }

  // Fetch recent logs
  const logs = await prisma.whatsAppMessageLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      user: {
        select: {
          name: true,
          whatsapp: true,
        }
      }
    }
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SENT":
      case "DELIVERED":
      case "READ":
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case "FAILED":
        return <AlertCircle className="w-4 h-4 text-rose-500" />;
      case "REPLIED":
        return <MessageSquareReply className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-amber-500" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "SENT":
      case "DELIVERED":
      case "READ":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "FAILED":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "REPLIED":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <div className="bg-primary text-white pt-10 pb-20 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white/60 text-xs font-bold uppercase tracking-widest">
              <MessageSquare className="w-4 h-4" /> Communications
            </div>
            <h1 className="text-4xl font-serif font-bold italic text-white">WhatsApp Delivery Logs</h1>
            <p className="text-white/70 font-medium">Monitor status of daily reminders and messages.</p>
          </div>
          <div className="flex gap-4">
             <Link href="/dashboard/admin" className="px-6 py-3 font-bold uppercase text-[10px] tracking-widest bg-white/10 hover:bg-white/20 transition-all border border-white/20">
                Back to Dashboard
             </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 -mt-10">
        <div className="bg-white border border-stone-200 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-100 text-stone-500 font-bold uppercase text-[10px] tracking-widest border-b border-stone-200">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">WhatsApp No.</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4">Details/Errors</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {logs.length > 0 ? logs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-stone-800">{log.user.name}</td>
                    <td className="px-6 py-4 text-stone-600 font-medium">{log.user.whatsapp}</td>
                    <td className="px-6 py-4 text-stone-500 text-xs font-medium">{log.messageType}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-[10px] font-bold uppercase tracking-widest ${getStatusClass(log.status)}`}>
                        {getStatusIcon(log.status)}
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-stone-400 text-xs font-medium">
                      {new Date(log.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                    </td>
                    <td className="px-6 py-4 text-rose-500 text-xs font-medium max-w-xs truncate" title={log.errorDetail || ""}>
                      {log.errorDetail || "-"}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-stone-400 font-medium">
                      No message logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
