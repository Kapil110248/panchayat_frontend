"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { 
  Lock, 
  Mail, 
  Shield, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  X, 
  ShieldCheck, 
  Cloud, 
  Users, 
  FileText,
  User as UserIcon,
  FileCheck,
  Building,
  CheckCircle2,
  Globe,
  Landmark,
  Briefcase
} from "lucide-react";
import { api } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("citizen");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });
  const router = useRouter();

  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "error" }), 3500);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToast({ show: false, message: "", type: "error" });
    
    // Attempt login sequentially as all roles to maintain backend logic without UI
    const rolesToTry = ["admin", "clerk", "citizen"];
    let loginSuccess = false;

    for (const r of rolesToTry) {
      try {
        const response = await api.post("/auth/login", {
          email,
          password,
          role: r
        });

        // Store user info and token
        localStorage.setItem("accessToken", response.access_token);
        localStorage.setItem("userRole", response.role);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userName", response.user.name);
        localStorage.setItem("userId", response.user.id);
        if (response.user.avatar_url) localStorage.setItem("userAvatar", response.user.avatar_url);
        
        if (response.role === "citizen") {
          window.location.href = "/citizen/dashboard";
        } else {
          localStorage.setItem("user", JSON.stringify(response.user));
          if (response.role === "admin") window.location.href = "/admin/dashboard";
          else if (response.role === "clerk") window.location.href = "/clerk/dashboard";
        }
        
        loginSuccess = true;
        break; // Exit loop on success
      } catch (error) {
        // Continue to the next role
      }
    }

    if (!loginSuccess) {
      showToast("Invalid credentials or account not approved.");
      setLoading(false);
    }
  };

  return (
    <div className="md:h-screen min-h-screen w-full flex items-center justify-center bg-slate-50 overflow-hidden relative">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-[60] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 transition-all animate-in slide-in-from-top-4 fade-in ${toast.type === "success" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"}`}>
           {toast.type === "success" ? <ShieldCheck className="w-5 h-5" /> : <X className="w-5 h-5" />}
           <p className="font-bold text-sm">{toast.message}</p>
        </div>
      )}

      {/* Subtle Premium Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-emerald-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Main Container - 100vh layout */}
      <div className="w-full h-full md:h-[100vh] flex flex-col md:flex-row relative z-10 bg-white md:bg-transparent">
        
        {/* Left Side: 45% Branding */}
        <div className="hidden md:flex md:w-[45%] bg-slate-900 text-white flex-col justify-between p-10 relative overflow-hidden h-full">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/50 via-slate-900 to-slate-900 z-0" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full mb-6">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-50">Secure Government Portal</span>
            </div>
            
            <h1 className="text-[40px] font-black leading-[1.1] mb-4 tracking-tight">
              Smart Digital<br />
              Governance for<br />
              <span className="text-emerald-400">Every Village</span>
            </h1>
            
            <p className="text-[14px] text-slate-300 leading-relaxed max-w-sm font-medium">
              Empowering citizens through secure digital services, transparent administration, and online certificate management.
            </p>
          </div>

          {/* Minimal Vector Illustration (Government Theme) */}
          <div className="relative z-10 flex-1 flex flex-col justify-center items-center my-4 opacity-90">
             <div className="relative w-full max-w-[280px] aspect-square flex items-center justify-center">
                {/* Central Hub */}
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-3xl border border-emerald-500/30 flex items-center justify-center backdrop-blur-md z-20 shadow-2xl shadow-emerald-500/20">
                   <Landmark className="w-10 h-10 text-emerald-400" />
                </div>
                {/* Orbiting Elements */}
                <div className="absolute top-[10%] left-[20%] w-12 h-12 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center backdrop-blur-sm shadow-xl">
                   <Users className="w-5 h-5 text-blue-300" />
                </div>
                <div className="absolute top-[15%] right-[15%] w-12 h-12 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center backdrop-blur-sm shadow-xl">
                   <FileText className="w-5 h-5 text-amber-300" />
                </div>
                <div className="absolute bottom-[20%] left-[15%] w-12 h-12 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center backdrop-blur-sm shadow-xl">
                   <Shield className="w-5 h-5 text-emerald-300" />
                </div>
                <div className="absolute bottom-[10%] right-[25%] w-12 h-12 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center backdrop-blur-sm shadow-xl">
                   <Globe className="w-5 h-5 text-cyan-300" />
                </div>
                {/* Connecting Lines (CSS magic) */}
                <svg className="absolute inset-0 w-full h-full z-10 opacity-30" viewBox="0 0 200 200">
                  <path d="M100,100 L60,40 M100,100 L160,50 M100,100 L50,150 M100,100 L140,170" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-white" />
                </svg>
             </div>
          </div>

          {/* Compact Statistics Grid */}
          <div className="relative z-10 grid grid-cols-2 gap-y-4 gap-x-6 border-t border-white/10 pt-6 mt-auto">
             <div>
                <p className="text-xl font-black text-white">1100+</p>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Registered Citizens</p>
             </div>
             <div>
                <p className="text-xl font-black text-white">15+</p>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Govt Services</p>
             </div>
             <div>
                <p className="text-xl font-black text-white">98%</p>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Complaint Resolution</p>
             </div>
             <div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <p className="text-xl font-black text-emerald-400">24×7</p>
                </div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Digital Services</p>
             </div>
          </div>
        </div>

        {/* Right Side: 55% Login Form Area */}
        <div className="w-full md:w-[55%] h-full flex flex-col justify-between md:justify-center px-6 sm:px-12 md:px-16 xl:px-24 bg-white/60 backdrop-blur-3xl relative overflow-y-auto md:overflow-y-hidden pt-10 pb-[env(safe-area-inset-bottom)] md:py-0">
          
          <div className="w-full max-w-[440px] mx-auto md:py-8 my-auto flex flex-col justify-center">
            <div className="mb-8 md:mb-6 text-center sm:text-left">
              <h2 className="text-[32px] font-black text-slate-900 mb-2 md:mb-2 tracking-tight">Secure Login</h2>
              <p className="text-[15px] md:text-[14px] text-slate-500 font-medium">Access your Digital Gram Panchayat Dashboard.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6 md:space-y-6">
              
              {/* Input Fields */}
              <div className="space-y-5 md:space-y-4">
                <div className="flex flex-col gap-1.5 md:gap-1.5 relative">
                   <label className="text-[15px] md:text-[14px] font-bold text-slate-700">Email Address / Mobile</label>
                   <div className="relative group">
                      <input
                        type="text"
                        placeholder="you@example.com"
                        className="w-full h-[56px] md:h-[52px] bg-white border-2 border-slate-200 px-4 md:px-4 text-[16px] md:text-[14px] font-medium rounded-xl transition-all focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none hover:border-slate-300"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                   </div>
                </div>

                <div className="flex flex-col gap-1.5 md:gap-1.5 relative">
                   <label className="text-[15px] md:text-[14px] font-bold text-slate-700">Password</label>
                   <div className="relative group">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full h-[56px] md:h-[52px] bg-white border-2 border-slate-200 pl-4 md:pl-4 pr-10 text-[16px] md:text-[14px] font-medium rounded-xl transition-all focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none hover:border-slate-300"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none w-10 h-10 flex items-center justify-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5 md:w-4 md:h-4" /> : <Eye className="w-5 h-5 md:w-4 md:h-4" />}
                      </button>
                   </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-[56px] md:h-[54px] text-[18px] font-bold rounded-xl shadow-xl shadow-emerald-500/20 md:shadow-lg gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 hover:-translate-y-0.5 transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
                  <div className="w-6 h-6 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Access Dashboard <ArrowRight className="w-5 h-5 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" /></>
                )}
              </Button>

              {/* Trust Indicators Row (Desktop Only) */}
              <div className="hidden md:flex items-center justify-between pt-2">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Lock className="w-3 h-3" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">SSL Encrypted</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <ShieldCheck className="w-3 h-3" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Govt Verified</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <UserIcon className="w-3 h-3" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Role Access</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <CheckCircle2 className="w-3 h-3" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Secure Auth</span>
                </div>
              </div>
            </form>

            <div className="hidden md:block mt-8 text-center">
              <p className="text-[13px] font-medium text-slate-500">
                New Citizen? <Link href="/register" className="text-emerald-600 hover:text-emerald-700 hover:underline font-bold transition-colors">Submit Registration Request</Link>
              </p>
            </div>
          </div>

          {/* Mobile Footer / Desktop Footer */}
          <div className="w-full mt-12 md:mt-0 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:pb-0 md:absolute md:bottom-6 md:left-0 md:right-0 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-3 text-[13px] md:text-[12px] font-medium text-slate-400">
             
             {/* Mobile-only trust badges (Section 1) */}
             <div className="flex md:hidden flex-wrap justify-center gap-2.5 w-full max-w-[340px] mx-auto">
                <span className="bg-slate-100/80 border border-slate-200 px-3.5 py-2 rounded-full text-[11px] font-bold text-slate-600 flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-slate-400"/> SSL Encrypted</span>
                <span className="bg-slate-100/80 border border-slate-200 px-3.5 py-2 rounded-full text-[11px] font-bold text-slate-600 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-slate-400"/> Govt Verified</span>
                <span className="bg-slate-100/80 border border-slate-200 px-3.5 py-2 rounded-full text-[11px] font-bold text-slate-600 flex items-center gap-1.5"><UserIcon className="w-3.5 h-3.5 text-slate-400"/> Role Access</span>
                <span className="bg-slate-100/80 border border-slate-200 px-3.5 py-2 rounded-full text-[11px] font-bold text-slate-600 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-slate-400"/> Secure Auth</span>
             </div>

             {/* Links (Section 2) */}
             <div className="flex items-center justify-center flex-wrap gap-5 md:gap-4 w-full md:w-auto">
                <Link href="#" className="hover:text-emerald-600 transition-colors">Privacy Policy</Link>
                <Link href="#" className="hover:text-emerald-600 transition-colors">Terms of Service</Link>
                <Link href="#" className="hover:text-emerald-600 transition-colors">Help Center</Link>
             </div>

             {/* Register Link Mobile (Section 3) */}
             <div className="flex md:hidden flex-col items-center gap-1.5 w-full border-t border-slate-200/60 pt-8 pb-4">
                <p className="text-slate-500 text-[14px]">Already a new citizen?</p>
                <Link href="/register" className="text-[16px] text-emerald-600 hover:text-emerald-700 font-black transition-colors">Submit Registration Request</Link>
             </div>

             <p className="hidden md:block">© 2026 Digital Gram Panchayat Portal</p>
          </div>
          
        </div>
      </div>
    </div>
  );
}
