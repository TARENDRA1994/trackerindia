"use client";

import { useState } from "react";
import { Loader2, Trash2, AlertTriangle, X } from "lucide-react";

export default function DeleteUserForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteIdentifier, setDeleteIdentifier] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState({ type: "", text: "" });

  const handleDeleteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deleteIdentifier) return;
    if (!confirm("Are you ABSOLUTELY sure? This will delete the user and ALL related data forever. This action cannot be undone.")) return;
    
    setIsDeleting(true);
    setDeleteMessage({ type: "", text: "" });
    try {
      const res = await fetch(`/api/admin/users/delete?identifier=${encodeURIComponent(deleteIdentifier)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setDeleteMessage({ type: "success", text: data.message });
        setDeleteIdentifier("");
        // Reload after short delay on success
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setDeleteMessage({ type: "error", text: data.error || "Failed to delete" });
      }
    } catch (err) {
      setDeleteMessage({ type: "error", text: "Something went wrong" });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full py-4 bg-rose-600/10 text-rose-600 border border-rose-600/20 hover:bg-rose-600/20 text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
      >
        <Trash2 className="w-4 h-4" /> Danger Zone (Delete)
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white border border-red-200 p-8 rounded-lg max-w-md w-full relative shadow-2xl">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3 text-red-600 mb-6">
              <AlertTriangle className="w-8 h-8" />
              <h2 className="text-2xl font-bold font-serif">Danger Zone</h2>
            </div>
            <p className="text-stone-500 mb-8 text-sm">
              This action is irreversible. Entering a student's email or WhatsApp number will permanently delete their account and all associated data.
            </p>
            
            <form onSubmit={handleDeleteUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-stone-700">Email or WhatsApp Number</label>
                <input 
                  type="text" 
                  value={deleteIdentifier}
                  onChange={(e) => setDeleteIdentifier(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full border border-stone-200 px-4 py-3 rounded-md focus:outline-none focus:border-red-500 text-stone-800"
                  required
                />
              </div>
              
              {deleteMessage.text && (
                <div className={`p-3 rounded text-sm ${deleteMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {deleteMessage.text}
                </div>
              )}

              <button
                type="submit"
                disabled={isDeleting || !deleteIdentifier}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 font-bold uppercase text-[10px] tracking-widest mt-4"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Permanently Delete User
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
