"use client";

import { useState } from "react";
import { MessageSquare, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WhatsAppBroadcastButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleBroadcast = async () => {
    if (!confirm("Are you sure you want to send the daily WhatsApp reminder to all active students?")) {
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/whatsapp/broadcast", {
        method: "POST",
      });
      const data = await res.json();
      
      if (res.ok) {
        alert(data.message);
        router.refresh();
      } else {
        alert(`Error: ${data.error || "Failed to broadcast"}`);
      }
    } catch (error) {
      alert("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleBroadcast}
      disabled={isLoading}
      className="w-full py-4 bg-white/10 border border-white/20 hover:bg-white/20 text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
      {isLoading ? "Broadcasting..." : "Broadcast Daily Reminder (WA)"}
    </button>
  );
}
