"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  ArrowRight, 
  CheckCircle2,
  Sparkles,
  Shield,
  Lock,
  Eye,
  EyeOff,
  Building,
  Info,
  Calendar,
  Contact,
  ShieldCheck,
  ShieldAlert,
  ArrowLeft,
  Users
} from "lucide-react";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  
  // Exact same state payload as requested
  const [formData, setFormData] = useState({
    fullName: "",
    fatherName: "",
    email: "",
    mobile: "",
    aadhaarNumber: "",
    address: "",
    village: "Your Village",
    pincode: "",
    dateOfBirth: "",
    gender: "male",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (name === "password" || name === "confirmPassword") {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");

    // Validate Passwords
    if (formData.password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // Map frontend camelCase to backend snake_case
      const payload = {
        full_name: formData.fullName,
        father_name: formData.fatherName,
        date_of_birth: formData.dateOfBirth,
        gender: formData.gender,
        aadhaar_number: formData.aadhaarNumber,
        email: formData.email,
        mobile: formData.mobile,
        address: formData.address,
        village: formData.village,
        pincode: formData.pincode,
        password: formData.password
      };

      await api.post("/auth/register", payload);
      setSubmitted(true);
    } catch (error) {
      console.error("Registration failed:", error);
      setToastMessage(error.message || "Registration failed. Please try again.");
      setTimeout(() => setToastMessage(""), 4000);
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS SCREEN
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
        {/* Decorative Blurs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-md w-full bg-white/80 backdrop-blur-3xl rounded-[2.5rem] p-12 text-center shadow-2xl border border-slate-100 relative z-10">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Request Submitted!</h2>
          <p className="text-slate-600 font-medium mb-8 leading-relaxed">
            Your registration request has been submitted successfully. The administrator will verify your details and approve your account. You will receive a notification via email/SMS upon approval.
          </p>
          <div className="space-y-3">
            <Link href="/">
              <Button className="w-full h-14 rounded-xl font-bold bg-slate-900 hover:bg-slate-800 text-white">
                Back to Home
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="w-full h-14 rounded-xl font-bold border-slate-200 hover:bg-slate-50 text-slate-900">
                Go to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // REGISTRATION FORM
  return (
    <div className="min-h-screen relative bg-slate-50 py-12 px-4 sm:px-6 overflow-hidden">
      {/* Premium Background Blurs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] right-[-10%] w-[50vw] h-[50vw] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-[820px] mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="mb-10 text-center sm:text-left">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors mb-8 group font-semibold text-[14px]">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
             <div>
                <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
                  <div className="bg-slate-900 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
                    <Building className="text-emerald-400 w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Gram Sahayak</h2>
                </div>
                
                <h1 className="text-[36px] font-black text-slate-900 leading-[1.1] mb-4 tracking-tight">
                  Citizen Registration<br className="hidden sm:block"/> Request
                </h1>
                
                <p className="text-[14px] text-slate-500 font-medium max-w-md leading-relaxed mx-auto sm:mx-0">
                  Submit your registration request to access Digital Gram Panchayat services. Your application will be verified by the Panchayat Administrator.
                </p>
             </div>
             
             <div className="flex flex-col gap-3">
               <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-full">
                 <ShieldCheck className="w-4 h-4 text-emerald-600" />
                 <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Government Verified</span>
               </div>
               <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 px-4 py-2 rounded-full">
                 <Lock className="w-4 h-4 text-slate-600" />
                 <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Secure Registration</span>
               </div>
             </div>
          </div>
        </div>

        {/* Premium Form Container */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-12 overflow-hidden relative">
          
          <form onSubmit={handleSubmit} className="space-y-12">
            
            {/* Section 1: Personal Information */}
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-[20px] font-black text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-600" />
                  Personal Information
                </h3>
                <p className="text-[14px] text-slate-500 font-medium mt-1">Please enter your details exactly as they appear on your Aadhaar card.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-[14px] font-bold text-slate-700">Full Name *</label>
                  <div className="relative group">
                    <input
                      type="text"
                      name="fullName"
                      placeholder="e.g. Ramesh Kumar Sharma"
                      className="w-full h-[54px] bg-slate-50 border-2 border-slate-100 px-4 text-[14px] font-medium rounded-xl transition-all focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none hover:border-slate-200"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-[14px] font-bold text-slate-700">Father's Name *</label>
                  <div className="relative group">
                    <input
                      type="text"
                      name="fatherName"
                      placeholder="e.g. Shri Lalit Kumar"
                      className="w-full h-[54px] bg-slate-50 border-2 border-slate-100 px-4 text-[14px] font-medium rounded-xl transition-all focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none hover:border-slate-200"
                      value={formData.fatherName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-[14px] font-bold text-slate-700">Date of Birth *</label>
                  <div className="relative group">
                    <input
                      type="date"
                      name="dateOfBirth"
                      className="w-full h-[54px] bg-slate-50 border-2 border-slate-100 px-4 text-[14px] font-medium rounded-xl transition-all focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none hover:border-slate-200 text-slate-700"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-[14px] font-bold text-slate-700">Gender *</label>
                  <div className="relative group">
                    <select
                      name="gender"
                      className="w-full h-[54px] bg-slate-50 border-2 border-slate-100 px-4 text-[14px] font-medium rounded-xl transition-all focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none hover:border-slate-200 text-slate-700"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 relative md:col-span-2 lg:col-span-1">
                  <label className="text-[14px] font-bold text-slate-700">Aadhaar Number *</label>
                  <div className="relative group">
                    <input
                      type="text"
                      name="aadhaarNumber"
                      placeholder="XXXX-XXXX-XXXX"
                      maxLength="12"
                      className="w-full h-[54px] bg-slate-50 border-2 border-slate-100 px-4 text-[14px] font-medium rounded-xl transition-all focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none hover:border-slate-200 tracking-widest"
                      value={formData.aadhaarNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5 ml-1">Enter your 12-digit Aadhaar Number.</p>
                </div>
              </div>
            </div>

            {/* Section 2: Contact Information */}
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-[20px] font-black text-slate-900 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-emerald-600" />
                  Contact Information
                </h3>
                <p className="text-[14px] text-slate-500 font-medium mt-1">We will use this to send approval updates and OTPs.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-[14px] font-bold text-slate-700">Email Address *</label>
                  <div className="relative group">
                    <input
                      type="email"
                      name="email"
                      placeholder="e.g. ramesh@example.com"
                      className="w-full h-[54px] bg-slate-50 border-2 border-slate-100 px-4 text-[14px] font-medium rounded-xl transition-all focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none hover:border-slate-200"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-[14px] font-bold text-slate-700">Mobile Number *</label>
                  <div className="relative group">
                    <input
                      type="tel"
                      name="mobile"
                      placeholder="e.g. 9876543210"
                      maxLength="10"
                      className="w-full h-[54px] bg-slate-50 border-2 border-slate-100 px-4 text-[14px] font-medium rounded-xl transition-all focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none hover:border-slate-200 tracking-wide"
                      value={formData.mobile}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Address Information */}
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-[20px] font-black text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  Address Information
                </h3>
                <p className="text-[14px] text-slate-500 font-medium mt-1">Provide your complete residential address.</p>
              </div>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5">
                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-[14px] font-bold text-slate-700">Complete Address *</label>
                  <div className="relative group">
                    <textarea
                      name="address"
                      placeholder="e.g. Ward No. 3, Near Hanuman Mandir..."
                      rows="3"
                      className="w-full bg-slate-50 border-2 border-slate-100 px-4 py-4 text-[14px] font-medium rounded-xl transition-all focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none hover:border-slate-200 resize-none"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <div className="flex flex-col gap-1.5 relative">
                    <label className="text-[14px] font-bold text-slate-700">Village/Town *</label>
                    <div className="relative group">
                      <input
                        type="text"
                        name="village"
                        placeholder="e.g. Your Village"
                        className="w-full h-[54px] bg-slate-50 border-2 border-slate-100 px-4 text-[14px] font-medium rounded-xl transition-all focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none hover:border-slate-200"
                        value={formData.village}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 relative">
                    <label className="text-[14px] font-bold text-slate-700">PIN Code *</label>
                    <div className="relative group">
                      <input
                        type="text"
                        name="pincode"
                        placeholder="e.g. 123456"
                        maxLength="6"
                        className="w-full h-[54px] bg-slate-50 border-2 border-slate-100 px-4 text-[14px] font-medium rounded-xl transition-all focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none hover:border-slate-200 tracking-wider"
                        value={formData.pincode}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Account Security */}
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-[20px] font-black text-slate-900 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-emerald-600" />
                  Account Security
                </h3>
                <p className="text-[14px] text-slate-500 font-medium mt-1">Set a strong password to protect your citizen account.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-[14px] font-bold text-slate-700">Password *</label>
                  <div className="relative group">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Minimum 6 characters"
                      minLength="6"
                      className="w-full h-[54px] bg-slate-50 border-2 border-slate-100 pl-4 pr-12 text-[14px] font-medium rounded-xl transition-all focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none hover:border-slate-200"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-[14px] font-bold text-slate-700">Confirm Password *</label>
                  <div className="relative group">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Re-enter your password"
                      minLength="6"
                      className="w-full h-[54px] bg-slate-50 border-2 border-slate-100 pl-4 pr-12 text-[14px] font-medium rounded-xl transition-all focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none hover:border-slate-200"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors focus:outline-none"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {passwordError && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 animate-in slide-in-from-top-2">
                  <p className="text-[13px] font-bold text-rose-700 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" />
                    {passwordError}
                  </p>
                </div>
              )}
            </div>

            {/* Important Notice - Premium Government Information Card */}
            <div className="bg-amber-50/80 border border-amber-200/60 rounded-2xl p-6 mt-10">
              <h4 className="font-black text-amber-900 mb-3 flex items-center gap-2 text-[15px]">
                <Info className="w-5 h-5 text-amber-600" />
                Important Notice
              </h4>
              <ul className="text-[13px] text-amber-800 font-medium space-y-2 list-none pl-1">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  Your registration request will be verified by the Panchayat Administrator.
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  Please provide accurate information matching your Aadhaar details.
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  False information may result in rejection of your request.
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  Approval notifications will be sent after verification.
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full h-[56px] text-[18px] font-bold rounded-xl shadow-lg shadow-emerald-500/20 gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 hover:-translate-y-0.5 transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Submit Registration Request <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                )}
              </Button>
            </div>

            {/* Trust Section */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Lock className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">SSL Encrypted</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Government Verified</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Building className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Secure Data Storage</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Contact className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Administrator Approval Required</span>
              </div>
            </div>

            {/* Login Link */}
            <div className="text-center pt-2">
              <p className="text-[14px] font-medium text-slate-500">
                Already have an account? <Link href="/login" className="text-emerald-600 hover:text-emerald-700 hover:underline font-bold transition-colors">Sign In</Link>
              </p>
            </div>

          </form>
        </div>
      </div>

      {/* Modern Error Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 font-medium text-[14px]">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
}
