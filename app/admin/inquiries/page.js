"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MessageSquare, CheckCircle, Trash2, Mail, Phone, Clock, AlertTriangle } from "lucide-react";
import { api } from "@/lib/api";

export default function AdminInquiries() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const data = await api.get("/admin/contact-messages", token);
      setMessages(data);
    } catch (e) { 
      console.error(e); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleMarkAsRead = async (id, currentStatus) => {
    if (currentStatus === "read") return;
    try {
      const token = localStorage.getItem("accessToken");
      await api.patch(`/admin/contact-messages/${id}`, { status: "read" }, token);
      setToastMessage("Marked as read");
      setTimeout(() => setToastMessage(""), 3000);
      fetchData();
    } catch (e) { 
      alert(e.message); 
    }
  };

  const handleDelete = (id) => {
    setMessageToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!messageToDelete) return;
    try {
      const token = localStorage.getItem("accessToken");
      await api.delete(`/admin/contact-messages/${messageToDelete}`, token);
      setToastMessage("Message deleted!");
      setTimeout(() => setToastMessage(""), 3000);
      fetchData();
    } catch (e) { 
      alert(e.message); 
    } finally {
      setDeleteModalOpen(false);
      setMessageToDelete(null);
    }
  };

  const unreadCount = messages.filter(m => m.status === "unread").length;
  const totalCount = messages.length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 text-violet-600 rounded-xl text-[10px] font-black uppercase tracking-widest mb-3">
            <MessageSquare className="w-3 h-3" /> Public Inquiries
          </div>
          <h1 className="text-4xl font-black text-slate-900">Contact Messages</h1>
          <p className="text-slate-500 font-medium mt-1">Review and manage messages submitted via the public landing page.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-violet-500/10 rounded-2xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-violet-600" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Messages</p>
              <h3 className="text-2xl font-black text-slate-900">{totalCount}</h3>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Unread</p>
              <h3 className="text-2xl font-black text-slate-900">{unreadCount}</h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Messages List */}
      <Card>
        <CardHeader title="All Messages" subtitle="Recent public inquiries and feedback" />
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 text-left">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sender Details</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Message</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Time</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map(m => (
                  <tr key={m.id} className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${m.status === 'unread' ? 'bg-violet-50/30' : ''}`}>
                    <td className="px-6 py-4">
                      <p className="font-bold text-sm text-slate-900">{m.name}</p>
                      <div className="flex items-center gap-2 mt-1 text-slate-500">
                        <Phone className="w-3 h-3" />
                        <span className="text-xs font-semibold">{m.mobile}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600 max-w-xs truncate" title={m.message}>
                      {m.message}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span className="text-xs font-bold">{new Date(m.submitted_at).toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${m.status === "read" ? "bg-emerald-500/10 text-emerald-700" : "bg-rose-500/10 text-rose-700"}`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {m.status === "unread" && (
                          <Button variant="outline" size="icon" onClick={() => handleMarkAsRead(m.id, m.status)} className="w-8 h-8 rounded-lg text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 border-emerald-200" title="Mark as Read">
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                        <Button variant="outline" size="icon" onClick={() => handleDelete(m.id)} className="w-8 h-8 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-50 border-rose-200" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {messages.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500 font-medium">
                      No contact messages found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modern Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-medium">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            {toastMessage}
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center space-y-4">
              <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Delete Message?</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Are you sure you want to delete this message? This action cannot be undone.
              </p>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-4">
              <Button variant="outline" onClick={() => setDeleteModalOpen(false)} className="flex-1 rounded-xl py-6 font-bold">
                Cancel
              </Button>
              <Button onClick={confirmDelete} className="flex-1 rounded-xl py-6 bg-rose-500 hover:bg-rose-600 text-white font-bold shadow-lg shadow-rose-200">
                Yes, Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
