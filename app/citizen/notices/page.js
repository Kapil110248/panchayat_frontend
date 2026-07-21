"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Bell, Calendar, MapPin, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";

const notices = [
  {
    id: 1,
    title: "Gram Sabha Meeting - January 2026",
    date: "15 Jan 2026",
    time: "10:30 AM",
    location: "Panchayat Bhawan Ground",
    description: "Annual planning for road construction and water pipeline maintenance. All villagers are requested to attend.",
    category: "Meeting",
    urgent: true
  },
  {
    id: 2,
    title: "Vaccination Drive: Polio & COVID",
    date: "12 Jan 2026",
    time: "09:00 AM - 05:00 PM",
    location: "Community Health Center",
    description: "Special drive for children under 5 and senior citizens. Please bring your Aadhar card and previous records.",
    category: "Health",
    urgent: false
  },
  {
    id: 3,
    title: "New Government Scheme: PM Awas Yojna",
    date: "Available Now",
    location: "Panchayat Office",
    description: "Criteria for 2026 applications have been released. Please check eligibility and submit forms by 30th Jan.",
    category: "Scheme",
    urgent: false
  },
];

export default function NoticeBoard() {
  return (
    <div className="space-y-6 pb-24 md:pb-10 px-2 md:px-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Notice Board</h1>
          <p className="text-slate-500 text-sm md:text-base font-medium">Panchayat ke sabhi updates yahan dekhein</p>
        </div>
      </div>

      <div className="space-y-4">
        {notices.map((notice) => (
          <Card key={notice.id} className={`rounded-[1.5rem] overflow-hidden ${notice.urgent ? "border-l-4 border-l-rose-500 shadow-md" : "shadow-sm border-slate-100"}`}>
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-row gap-4 md:gap-6">
                <div className="flex-none mt-1">
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center ${
                    notice.urgent ? "bg-rose-100 text-rose-600" : "bg-slate-100 text-slate-600"
                  }`}>
                    <Bell className="w-5 h-5 md:w-7 md:h-7" />
                  </div>
                </div>
                <div className="flex-1 space-y-2 md:space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                          notice.category === "Meeting" ? "bg-blue-100 text-blue-700" :
                          notice.category === "Health" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        }`}>
                          {notice.category}
                        </span>
                        {notice.urgent && <span className="text-[9px] md:text-[10px] bg-rose-500 text-white font-black uppercase tracking-widest px-2 py-0.5 rounded-full animate-pulse">Urgent</span>}
                      </div>
                      <h3 className="text-lg md:text-xl font-black text-slate-900 leading-tight">{notice.title}</h3>
                    </div>
                  </div>
                  
                  <p className="text-slate-500 text-sm leading-relaxed max-w-2xl font-medium">{notice.description}</p>
                  
                  <div className="flex flex-wrap gap-y-2 gap-x-4 pt-1">
                    <div className="flex items-center gap-1.5 text-[11px] md:text-sm font-bold text-slate-400">
                      <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      <span>{notice.date} {notice.time && `• ${notice.time}`}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] md:text-sm font-bold text-slate-400">
                      <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      <span className="line-clamp-1">{notice.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
