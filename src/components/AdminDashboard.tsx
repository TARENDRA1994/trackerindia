"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UserCheck, UserX, Clock, Phone, MapPin, Search, Loader2 } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  state: string;
  city: string;
  exam: string;
  targetYear: number;
  createdAt: any;
}

export default function AdminDashboard({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleAction = async (userId: string, action: "APPROVE" | "REJECT") => {
    setProcessingId(userId);
    try {
      const res = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action }),
      });

      if (res.ok) {
        setUsers(users.filter(u => u.id !== userId));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FDFDFD]">
      {/* Sidebar - Official Look */}
      <aside className="w-64 bg-primary text-white p-6 hidden md:block">
        <h2 className="text-2xl font-serif font-bold mb-10">Admin Panel</h2>
        <nav className="space-y-4">
          <div className="bg-white/10 p-3 flex items-center gap-3 cursor-pointer border-l-4 border-accent">
            <Clock className="w-5 h-5" />
            <span>Pending Approvals</span>
          </div>
          <div className="p-3 flex items-center gap-3 text-white/60 hover:bg-white/5 cursor-pointer">
            <Search className="w-5 h-5" />
            <span>Search Students</span>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="mb-10 flex justify-between items-center bg-white p-6 border border-border">
          <div>
            <h1 className="text-3xl font-serif font-bold text-primary">Pending Registrations</h1>
            <p className="text-muted-foreground text-sm">Verify and approve new aspirants to Tracker India</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-accent">{users.length}</span>
            <p className="text-[10px] uppercase font-bold text-muted-foreground">Waiting Review</p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6">
          {users.length === 0 ? (
            <div className="text-center py-20 bg-muted/30 border border-dashed border-border rounded-lg">
              <UserCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">All pending registrations processed.</p>
            </div>
          ) : (
            users.map((user) => (
              <motion.div
                layout
                key={user.id}
                className="bg-white border border-border p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-lg transition-shadow"
              >
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-foreground">{user.name}</h3>
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(user.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1 font-semibold text-primary"><Phone className="w-3 h-3" /> {user.whatsapp}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {user.city}, {user.state}</span>
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded">{user.exam} {user.targetYear}</span>
                  </div>
                  <p className="text-sm text-foreground/70">{user.email}</p>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                  <button
                    disabled={processingId === user.id}
                    onClick={() => handleAction(user.id, "REJECT")}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    <UserX className="w-4 h-4" /> Reject
                  </button>
                  <button
                    disabled={processingId === user.id}
                    onClick={() => handleAction(user.id, "APPROVE")}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-md"
                  >
                    {processingId === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><UserCheck className="w-4 h-4" /> Approve</>}
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
