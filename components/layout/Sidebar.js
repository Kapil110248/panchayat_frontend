"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Bell, 
  User, 
  Users, 
  ClipboardCheck, 
  Settings, 
  FileSearch,
  BookOpen,
  PieChart,
  LogOut,
  Sparkles,
  UserPlus,
  Tractor
} from "lucide-react";

const getLinks = (role) => {
  const common = [
    { name: "Notices", href: `/${role}/notices`, icon: Bell },
  ];

  const citizenLinks = [
    { name: "Dashboard", href: "/citizen/dashboard", icon: LayoutDashboard },
    { name: "Apply Certificate", href: "/citizen/certificates/apply", icon: FileText },
    { name: "My Certificates", href: "/citizen/certificates/status", icon: FileSearch },
    { name: "Lodge Complaint", href: "/citizen/complaints/new", icon: MessageSquare },
    { name: "My Complaints", href: "/citizen/complaints/status", icon: ClipboardCheck },
    { name: "Government Schemes", href: "/citizen/schemes", icon: BookOpen },
    { name: "My Profile", href: "/citizen/profile", icon: User },
    { name: "Gram Sabha", href: "/citizen/gram-sabha", icon: Users },
    { name: "Development Works", href: "/citizen/development", icon: LayoutDashboard },
    { name: "Water Supply", href: "/citizen/water-supply", icon: ClipboardCheck },
    { name: "Tax Center", href: "/citizen/taxes", icon: FileText },
    { name: "Suggestions Box", href: "/citizen/suggestions", icon: Sparkles },
    { name: "Ration Schedule", href: "/citizen/ration", icon: BookOpen },
    { name: "Health Camps", href: "/citizen/health-camps", icon: ClipboardCheck },
    { name: "Agriculture Center", href: "/citizen/agriculture", icon: BookOpen },
  ];

  const clerkLinks = [
    { name: "Dashboard", href: "/clerk/dashboard", icon: LayoutDashboard },
    { name: "Citizen Records", href: "/clerk/citizens", icon: Users },
    { name: "Certificate Verification", href: "/clerk/verification", icon: ClipboardCheck },
    { name: "Grievances", href: "/clerk/complaints", icon: MessageSquare },
    { name: "Public Inquiries", href: "/admin/inquiries", icon: MessageSquare },
    { name: "Profile Settings", href: "/clerk/profile", icon: User },
    { name: "Gram Sabha", href: "/clerk/gram-sabha", icon: Users },
    { name: "Development Works", href: "/clerk/development", icon: LayoutDashboard },
    { name: "Water Supply", href: "/clerk/water-supply", icon: ClipboardCheck },
    { name: "Tax Center", href: "/clerk/taxes", icon: FileText },
    { name: "Village Directory", href: "/clerk/directory", icon: Users },
    { name: "Assets Ledger", href: "/clerk/assets", icon: FileSearch },
    { name: "Staff Attendance", href: "/clerk/attendance", icon: ClipboardCheck },
    { name: "Ration Schedule", href: "/clerk/ration", icon: BookOpen },
    { name: "Agriculture Entry", href: "/admin/agriculture", icon: Tractor },
  ];

  const adminLinks = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Registration Requests", href: "/admin/registration-requests", icon: UserPlus },
    { name: "Clerk Management", href: "/admin/clerks", icon: Users },
    { name: "Final Approvals", href: "/admin/approvals", icon: ClipboardCheck },
    { name: "Complaints Monitor", href: "/admin/complaints", icon: MessageSquare },
    { name: "Public Inquiries", href: "/admin/inquiries", icon: MessageSquare },
    { name: "Scheme Entry", href: "/admin/schemes", icon: BookOpen },
    { name: "Broadcast Notices", href: "/admin/notices", icon: Bell },
    { name: "System Reports", href: "/admin/reports", icon: PieChart },
    { name: "Portal Settings", href: "/admin/settings", icon: Settings },
    { name: "My Admin Profile", href: "/admin/profile", icon: User },
    { name: "Gram Sabha", href: "/admin/gram-sabha", icon: Users },
    { name: "Development Works", href: "/admin/development", icon: LayoutDashboard },
    { name: "Water Supply", href: "/admin/water-supply", icon: ClipboardCheck },
    { name: "Tax Center", href: "/admin/taxes", icon: FileText },
    { name: "Village Directory", href: "/admin/directory", icon: Users },
    { name: "Suggestions Box", href: "/admin/suggestions", icon: Sparkles },
    { name: "Health Camps", href: "/admin/health-camps", icon: ClipboardCheck },
    { name: "Assets Ledger", href: "/admin/assets", icon: FileSearch },
    { name: "Staff Attendance", href: "/admin/attendance", icon: ClipboardCheck },
    { name: "Agriculture Entry", href: "/admin/agriculture", icon: Tractor },
  ];

  const allLinks = role === "admin" ? [...adminLinks, ...common] : 
                   role === "clerk" ? [...clerkLinks, ...common] : 
                   [...citizenLinks, ...common];
  
  return allLinks.filter((link, index, self) => 
    index === self.findIndex((t) => t.href === link.href)
  );
};

export function Sidebar({ role = "citizen", onClose }) {
  const pathname = usePathname();
  const [permissions, setPermissions] = useState([]);
  const [userName, setUserName] = useState("Citizen");
  const [villageName, setVillageName] = useState("Your Village");
  const [userAvatar, setUserAvatar] = useState(null);

  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      const name = localStorage.getItem("userName");
      const avatar = localStorage.getItem("userAvatar");
      
      if (name) setUserName(name);
      if (avatar) setUserAvatar(avatar);
      
      if (userStr) {
        const userObj = JSON.parse(userStr);
        if (userObj.permissions) {
          setPermissions(userObj.permissions);
        }
        if (userObj.full_name && !name) setUserName(userObj.full_name);
        if (userObj.village) setVillageName(userObj.village);
        if (userObj.avatar_url && !avatar) setUserAvatar(userObj.avatar_url);
      }
    } catch (e) {
      console.error(e);
    }

    const handleAvatarUpdate = () => {
      setUserAvatar(localStorage.getItem("userAvatar"));
    };

    window.addEventListener("avatarUpdated", handleAvatarUpdate);
    return () => window.removeEventListener("avatarUpdated", handleAvatarUpdate);
  }, []);

  const rawLinks = getLinks(role);
  
  // Filter for RBAC (Clerks only)
  const links = rawLinks.filter(link => {
    if (role !== "clerk") return true;
    if (link.name === "Dashboard" || link.name === "Profile Settings" || link.name === "Notices") return true;
    if (!permissions) return false;
    return permissions.includes(link.name);
  });

  return (
    <div className="w-72 glass border-r border-slate-200/50 h-[100dvh] flex flex-col z-50">
      <div className="p-6 md:p-8 shrink-0 pb-0">
        <div className={`items-center gap-3 mb-10 select-none ${role === 'citizen' ? 'hidden lg:flex' : 'flex'}`}>
          <div className="relative">
            <div className="bg-primary w-11 h-11 rounded-2xl rotate-6 absolute inset-0 blur-lg opacity-40 animate-pulse pointer-events-none" />
            <div className="bg-gradient-to-br from-primary to-emerald-700 w-11 h-11 rounded-2xl flex items-center justify-center relative shadow-lg">
              <Sparkles className="text-white w-6 h-6" />
            </div>
          </div>
          <span className="font-black text-2xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">GP-Digital</span>
        </div>

        {role === 'citizen' && (
          <div className="lg:hidden flex items-center gap-4 mb-8 mt-4 p-4 bg-slate-50/80 backdrop-blur-md rounded-[2rem] border border-slate-100/80 shadow-sm">
             <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center border border-primary/20 shrink-0 shadow-inner overflow-hidden">
                {userAvatar ? (
                  <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-primary" />
                )}
             </div>
             <div>
                <p className="text-sm font-black text-slate-900 leading-tight">{userName}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1.5">
                   {villageName.toLowerCase().includes('panchayat') || villageName.toLowerCase().includes('panchyat') || villageName.toLowerCase().includes('village') ? villageName : `${villageName} Village`}
                </p>
             </div>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto space-y-1.5 px-6 md:px-8 mt-6 pr-4 scrollbar-none relative z-10 pb-6 md:pb-0">
        {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => onClose?.()}
                className={cn(
                  "flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 group relative cursor-pointer active:scale-95",
                  isActive
                    ? "bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02] z-10"
                    : "text-slate-500 hover:bg-white/50 hover:text-primary"
                )}
              >
                <Icon className={cn("w-5 h-5 transition-transform duration-300 group-hover:scale-110 shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-primary")} />
                <span className="truncate">{link.name}</span>
                {isActive && (
                  <div className="absolute left-0 w-1.5 h-6 bg-white rounded-full -ml-0.5" />
                )}
              </Link>
            );
          })}
        </nav>

      <div className="shrink-0 mt-auto p-6 space-y-4 relative z-10">
        <Link
          href="/logout"
          className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all duration-300 group active:scale-95 cursor-pointer"
        >
          <div className="p-2 rounded-xl group-hover:bg-rose-100 transition-colors shrink-0">
            <LogOut className="w-4 h-4" />
          </div>
          <span>Sign Out</span>
        </Link>
      </div>
    </div>
  );
}
