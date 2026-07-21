"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, FileText, Bell, User } from "lucide-react";

export default function CitizenLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-slate-50 relative">
      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] lg:hidden transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileMenuOpen(false)}
      />
      
      {/* Sidebar - hidden on mobile unless open */}
      <div className={`print:hidden fixed inset-y-0 left-0 z-[70] lg:static transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <Sidebar role="citizen" onClose={() => setMobileMenuOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col w-full lg:w-auto print:block">
        <div className="print:hidden">
          <Navbar role="citizen" onMenuClick={() => setMobileMenuOpen(true)} />
        </div>
        <main className="p-4 pb-28 md:p-6 w-full max-w-[100vw] overflow-x-hidden print:p-0">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/50 rounded-t-[1.5rem] shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom)]">
         <div className="flex items-center justify-around h-[68px] px-2">
            <Link href="/citizen/dashboard" className={`flex flex-col items-center justify-center gap-1 w-14 h-14 rounded-xl transition-all ${pathname === '/citizen/dashboard' ? 'bg-primary/10 text-primary font-black' : 'text-slate-400 font-bold'}`}>
               <LayoutGrid className={`w-[18px] h-[18px] ${pathname === '/citizen/dashboard' ? 'fill-primary/20 text-primary' : ''}`} />
               <span className="text-[9px] tracking-tight">Home</span>
            </Link>
            <Link href="/citizen/certificates/apply" className={`flex flex-col items-center justify-center gap-1 w-14 h-14 rounded-xl transition-all ${pathname?.includes('/certificates') ? 'bg-blue-500/10 text-blue-600 font-black' : 'text-slate-400 font-bold'}`}>
               <FileText className={`w-[18px] h-[18px] ${pathname?.includes('/certificates') ? 'fill-blue-500/20 text-blue-600' : ''}`} />
               <span className="text-[9px] tracking-tight">Services</span>
            </Link>
            <Link href="/citizen/notices" className={`flex flex-col items-center justify-center gap-1 w-14 h-14 rounded-xl transition-all ${pathname?.includes('/notices') ? 'bg-amber-500/10 text-amber-600 font-black' : 'text-slate-400 font-bold'}`}>
               <Bell className={`w-[18px] h-[18px] ${pathname?.includes('/notices') ? 'fill-amber-500/20 text-amber-600' : ''}`} />
               <span className="text-[9px] tracking-tight">Alerts</span>
            </Link>
            <Link href="/citizen/profile" className={`flex flex-col items-center justify-center gap-1 w-14 h-14 rounded-xl transition-all ${pathname?.includes('/profile') ? 'bg-indigo-500/10 text-indigo-600 font-black' : 'text-slate-400 font-bold'}`}>
               <User className={`w-[18px] h-[18px] ${pathname?.includes('/profile') ? 'fill-indigo-500/20 text-indigo-600' : ''}`} />
               <span className="text-[9px] tracking-tight">Profile</span>
            </Link>
         </div>
      </div>
    </div>
  );
}
