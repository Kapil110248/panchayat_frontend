"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { 
  FileText, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  TrendingUp,
  LayoutGrid,
  Search,
  BookOpen
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function CitizenDashboard() {
  const [userName, setUserName] = useState("Citizen");
  const [villageName, setVillageName] = useState("Your Village");
  const [greeting, setGreeting] = useState("Welcome");
  const [statsData, setStatsData] = useState({
    applied: 0,
    active: 0,
    approved: 0,
    pending: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [latestNotice, setLatestNotice] = useState(null);
  const [villageStats, setVillageStats] = useState({ digitization: 0, utilization: 0 });
  const [loading, setLoading] = useState(true);

  const handleDownloadHistory = () => {
    if (recentActivities.length === 0) {
      alert("No recent activities to download.");
      return;
    }
    
    const doc = new jsPDF();
    
    // Add Header
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text(`Gram Panchayat ${villageName}`, 105, 20, null, null, "center");
    
    doc.setFontSize(14);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text("Citizen Dashboard - Application History", 105, 30, null, null, "center");
    
    // Add Details
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text(`Citizen Name: ${userName}`, 14, 45);
    doc.text(`Date Generated: ${new Date().toLocaleDateString('en-GB')}`, 14, 52);
    
    const tableColumn = ["Application / Title", "Category", "Current Status", "Submitted Date"];
    const tableRows = [];
    
    recentActivities.forEach(act => {
      const formattedStatus = act.status.replace(/_/g, ' ');
      const actData = [
        act.title,
        act.type,
        formattedStatus,
        act.time
      ];
      tableRows.push(actData);
    });
    
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 60,
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42], textColor: 255 }, // slate-900 header
      alternateRowStyles: { fillColor: [248, 250, 252] }, // slate-50
      styles: { fontSize: 10, cellPadding: 4 }
    });
    
    doc.save(`${villageName.replace(/\s+/g, '_')}_History_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const name = localStorage.getItem("userName");
        if (name) {
          setUserName(name.split(" ")[0]);
        }
        
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good Morning");
        else if (hour < 17) setGreeting("Good Afternoon");
        else setGreeting("Good Evening");
        
        const data = await api.get("/citizen/dashboard/stats", token);
        setStatsData(data.stats);
        if (data.villageName) setVillageName(data.villageName);
        setRecentActivities(data.recentActivities);
        setLatestNotice(data.latestNotice);
        if (data.villageStats) {
           setVillageStats(data.villageStats);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const stats = [
    { label: "Applied", value: statsData.applied, icon: FileText, color: "text-blue-600", bg: "bg-blue-500/10", border: "border-blue-500/20", glow: "shadow-blue-500/20" },
    { label: "Active", value: statsData.active, icon: MessageSquare, color: "text-rose-600", bg: "bg-rose-500/10", border: "border-rose-500/20", glow: "shadow-rose-500/20" },
    { label: "Approved", value: statsData.approved, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-500/10", border: "border-emerald-500/20", glow: "shadow-emerald-500/20" },
    { label: "Pending", value: statsData.pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-500/10", border: "border-amber-500/20", glow: "shadow-amber-500/20" },
  ];

  return (
    <div className="space-y-4 md:space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-1 md:gap-6 relative z-10">
        <div>
          <div className="hidden md:inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest mb-3 border border-primary/20 backdrop-blur-md">
             <LayoutGrid className="w-3 h-3" /> Citizen Dashboard
          </div>
          <h1 className="text-2xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight flex items-center gap-1.5 flex-wrap">{greeting} 👋 <span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">{userName}!</span></h1>
          <p className="text-slate-500 font-medium text-[12px] md:text-lg mt-0.5 md:mt-2">Welcome to your digital village portal.</p>
        </div>
        <div className="flex gap-3 mt-1 md:mt-0">
           <Button onClick={handleDownloadHistory} variant="secondary" className="hidden sm:flex bg-white border border-slate-200 hover:border-primary text-slate-600 shadow-sm rounded-2xl h-12 px-6 font-bold hover:text-primary transition-all">Download History</Button>
        </div>
      </div>

      {/* Mobile Quick Actions (Horizontal Scroll) */}
      <div className="md:hidden flex overflow-x-auto gap-4 pb-2 -mx-4 px-4 snap-x hide-scrollbar">
         <Link href="/citizen/certificates/apply" className="snap-start shrink-0 flex flex-col items-center gap-1.5 w-[72px]">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm"><FileText className="w-5 h-5"/></div>
            <span className="text-[10px] font-bold text-slate-600 leading-tight text-center">Apply<br/>Cert</span>
         </Link>
         <Link href="/citizen/complaints/new" className="snap-start shrink-0 flex flex-col items-center gap-1.5 w-[72px]">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shadow-sm"><MessageSquare className="w-5 h-5"/></div>
            <span className="text-[10px] font-bold text-slate-600 leading-tight text-center">Lodge<br/>Complaint</span>
         </Link>
         <Link href="/citizen/schemes" className="snap-start shrink-0 flex flex-col items-center gap-1.5 w-[72px]">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shadow-sm"><BookOpen className="w-5 h-5"/></div>
            <span className="text-[10px] font-bold text-slate-600 leading-tight text-center">Govt<br/>Schemes</span>
         </Link>
         <Link href="/citizen/dashboard" className="snap-start shrink-0 flex flex-col items-center gap-1.5 w-[72px]">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-sm"><Search className="w-5 h-5"/></div>
            <span className="text-[10px] font-bold text-slate-600 leading-tight text-center">Track<br/>Status</span>
         </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 relative z-10">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white/90 backdrop-blur-xl border border-white shadow-sm md:shadow-xl shadow-slate-200/50 md:shadow-slate-200/50 rounded-2xl md:rounded-[2rem] p-3 flex items-center gap-3 md:block md:p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
             <div className="absolute top-0 right-0 w-20 h-20 md:w-32 md:h-32 bg-gradient-to-br from-slate-50 to-slate-100 rounded-bl-full -z-10 opacity-50" />
             
             <div className="flex justify-between items-start md:mb-6 shrink-0">
               <div className={`${stat.bg} ${stat.color} ${stat.border} border w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm md:shadow-lg ${stat.glow}`}>
                  <stat.icon className="w-5 h-5 md:w-6 md:h-6" />
               </div>
               <div className="hidden md:flex w-8 h-8 rounded-full bg-slate-50 items-center justify-center text-slate-300 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
               </div>
             </div>
             <div>
                <h3 className="text-xl md:text-4xl font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors leading-none mb-0.5 md:mb-0">{loading ? "-" : stat.value}</h3>
                <p className="text-[9px] md:text-sm font-bold text-slate-400 uppercase tracking-widest md:mt-1">{stat.label}</p>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
        <div className="xl:col-span-2 space-y-6 md:space-y-8">
          {/* Quick Actions Card */}
          <Card className="border-none shadow-none bg-transparent hidden md:block">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-2 h-8 bg-primary rounded-full" />
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">What do you need?</h2>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Link href="/citizen/certificates/apply" className="group relative bg-white p-8 rounded-[2.5rem] premium-card">
                  <div className="bg-blue-500/10 text-blue-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <FileText className="w-7 h-7" />
                  </div>
                  <h4 className="text-xl font-black text-slate-900 mb-2">Apply for Certificate</h4>
                  <p className="text-sm text-slate-400 font-medium">Income, Birth, or Residence documents for your family.</p>
                  <div className="mt-6 flex items-center text-primary font-bold text-sm gap-1 group-hover:gap-2 transition-all">
                     Start Application <ArrowUpRight className="w-4 h-4" />
                  </div>
                </Link>
                
                <Link href="/citizen/complaints/new" className="group relative bg-white p-8 rounded-[2.5rem] premium-card">
                  <div className="bg-rose-500/10 text-rose-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-rose-600 group-hover:text-white transition-all">
                    <MessageSquare className="w-7 h-7" />
                  </div>
                  <h4 className="text-xl font-black text-slate-900 mb-2">Lodge a Complaint</h4>
                  <p className="text-sm text-slate-400 font-medium">Issue with water, roads or electricity? Report it now.</p>
                  <div className="mt-6 flex items-center text-primary font-bold text-sm gap-1 group-hover:gap-2 transition-all">
                     Lodge Complaint <ArrowUpRight className="w-4 h-4" />
                  </div>
                </Link>
             </div>
          </Card>

          {/* Activity List */}
          <Card className="rounded-[1.5rem] md:rounded-[2.5rem] border-white shadow-md md:shadow-xl shadow-slate-200/50 bg-white/90 backdrop-blur-xl mb-24 md:mb-0">
            <div className="p-6 pb-2 md:p-8 md:pb-4 flex justify-between items-center">
              <div>
                <h2 className="text-[18px] md:text-xl font-black text-slate-900 tracking-tight mb-1">Application Timeline</h2>
                <p className="text-[13px] md:text-sm font-medium text-slate-500 hidden md:block">Keep track of your latest requests and their progress</p>
              </div>
              <Link href="/citizen/certificates" className="text-sm font-bold text-primary md:hidden">View All</Link>
            </div>
            <CardContent className="p-3 pt-0 md:p-4 md:pt-0">
              <div className="space-y-2">
                {loading ? (
                   <div className="p-8 text-center text-slate-400 font-bold">Loading activities...</div>
                ) : recentActivities.length === 0 ? (
                   <div className="p-6 md:p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 border-dashed flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm border border-slate-100 text-slate-300"><FileText className="w-5 h-5"/></div>
                      <p className="text-slate-600 font-bold mb-1 text-[15px]">No Applications Yet</p>
                      <p className="text-slate-400 text-[13px] mb-4">Apply for your first certificate</p>
                      <Link href="/citizen/certificates/apply">
                        <Button className="h-10 rounded-xl px-6 bg-primary text-white font-bold shadow-md shadow-primary/20">Apply Now</Button>
                      </Link>
                   </div>
                ) : recentActivities.map((activity, i) => (
                  <div key={i} className="p-3 md:p-4 flex items-center justify-between hover:bg-primary/5 rounded-xl md:rounded-2xl transition-all group cursor-pointer border border-transparent hover:border-primary/10">
                    <div className="flex items-center gap-3 md:gap-4 w-full">
                      <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-primary group-hover:shadow-lg shadow-primary/20 transition-all">
                        {activity.type === "Certificate" ? <FileText className="w-5 h-5 md:w-5 md:h-5" /> : <MessageSquare className="w-5 h-5 md:w-5 md:h-5" />}
                      </div>
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="text-[14px] md:text-sm font-black text-slate-900 group-hover:text-primary transition-colors truncate">{activity.title}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 md:mt-1">{activity.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3 shrink-0">
                       <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest px-2 py-1 md:px-3 md:py-1.5 rounded-lg border ${
                         activity.status === "Approved" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                         activity.status === "Pending" ? "bg-amber-50 text-amber-600 border-amber-100" :
                         "bg-blue-50 text-blue-600 border-blue-100"
                       }`}>
                         {activity.status}
                       </span>
                       <div className="hidden md:flex w-8 h-8 rounded-full items-center justify-center bg-white border border-slate-100 text-slate-300 group-hover:border-primary/20 group-hover:text-primary group-hover:bg-primary/5 transition-all">
                          <ArrowRight className="w-4 h-4" />
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Important Notice Board */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl shadow-slate-900/20 relative overflow-hidden border border-slate-800">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -z-0 mix-blend-lighten pointer-events-none" />
             <div className="relative z-10">
                <div className="bg-white/10 backdrop-blur-md w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-white/10 shadow-inner">
                  <AlertCircle className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-black mb-3 tracking-tight">Notice Board</h3>
                <p className="text-slate-300 text-sm font-medium leading-relaxed mb-8">
                  {loading ? "Loading latest notices..." : latestNotice ? latestNotice.title : "No recent notices from the Gram Panchayat."}
                </p>
                <Link href="/citizen/notices" className="block">
                  <Button className="bg-white text-slate-900 hover:bg-slate-50 shadow-xl shadow-white/10 rounded-xl w-full h-12 font-bold text-sm transition-all hover:scale-[1.02]">
                    View Full Notice
                  </Button>
                </Link>
             </div>
          </div>

          {/* Progress Tracking (Mini) */}
          <Card>
             <CardHeader title="Village Stats" subtitle="Our village progress this month" />
             <CardContent className="space-y-6">
                <div className="space-y-2">
                   <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                      <span className="text-slate-400">Total Digitization</span>
                      <span className="text-primary font-black">{loading ? "-" : `${villageStats.digitization}%`}</span>
                   </div>
                   <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full transition-all duration-1000 ease-out" style={{ width: `${villageStats.digitization}%` }} />
                   </div>
                </div>
                
                <div className="space-y-2">
                   <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                      <span className="text-slate-400">Scheme Utilization</span>
                      <span className="text-blue-500 font-black">{loading ? "-" : `${villageStats.utilization}%`}</span>
                   </div>
                   <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full transition-all duration-1000 ease-out" style={{ width: `${villageStats.utilization}%` }} />
                   </div>
                </div>

                <div className="pt-4 border-t border-slate-50">
                   <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                      <div>
                         <p className="text-xs font-black text-emerald-700 leading-none">Healthy Village</p>
                         <p className="text-[10px] text-emerald-600/70 font-bold mt-1 uppercase tracking-tight">Grade A Sustainability</p>
                      </div>
                   </div>
                </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
