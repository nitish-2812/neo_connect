'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Loader2, EyeOff, Eye, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';
import phoneMockup from '@/assets/phone_mockup_auth.png';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', department: '', role: 'staff' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, getDashboardPath } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register(form);
      toast.success('Account created successfully!');
      router.push(getDashboardPath(user.role));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background overflow-hidden font-sans relative">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[150px]" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5" />
      </div>

      <div className="w-full max-w-[1200px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-between z-10 gap-16 py-12 lg:py-0">
        
        {/* Left Side - Typography & Graphic */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left mt-12 lg:mt-0">
          <Link href="/" className="flex items-center gap-3 mb-10 lg:mb-16 hover:opacity-80 transition-opacity inline-flex">
            <div className="w-8 h-8 rounded flex items-center justify-center">
              <Image src="/413790699_122106144620152037_7646346380797868274_n-removebg-preview.svg" alt="NeoConnect" width={28} height={28} className="object-contain" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">NeoConnect</span>
          </Link>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
            Join the <br className="hidden lg:block"/>
            <span className="text-primary">movement.</span>
          </h1>
          
          <p className="text-white/50 text-lg leading-relaxed max-w-md font-light mb-12">
            Create an account to submit complaints autonomously, view organizational impacts, and vote on workplace decisions.
          </p>
          
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[400px] lg:h-[400px] opacity-80 mix-blend-screen pointer-events-none hidden lg:block">
            <Image 
              src={phoneMockup}
              alt="Workspace Management App mockup"
              fill
              className="object-contain object-left-bottom"
              priority
            />
          </div>
        </div>

        {/* Right Side - Glass Form */}
        <div className="w-full lg:w-[500px] flex-shrink-0">
          <div className="glass-card rounded-[32px] p-8 sm:p-10 relative overflow-hidden backdrop-blur-xl bg-black/40 border border-white/10 shadow-2xl">
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] rounded-full pointer-events-none" />

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Create Account</h2>
              <p className="text-white/50 text-sm">Already have an account? <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">Sign in</Link></p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/70 ml-1">Full Name</label>
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full h-11 sm:h-12 px-5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/70 ml-1">Email</label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className="w-full h-11 sm:h-12 px-5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-sm font-medium"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/70 ml-1">Password</label>
                <div className="relative group">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 6 chars"
                    minLength={6}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    className="w-full h-11 sm:h-12 pl-5 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-sm font-medium tracking-wide"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors p-1"
                  >
                    {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-1.5 relative">
                <label className="text-xs font-medium text-white/70 ml-1">Role</label>
                <div className="relative">
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full h-11 sm:h-12 pl-5 pr-10 appearance-none bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-sm font-medium cursor-pointer"
                  >
                    <option value="staff" className="text-black">Staff</option>
                    <option value="secretariat" className="text-black">Secretariat</option>
                    <option value="case-manager" className="text-black">Case Manager</option>
                    <option value="admin" className="text-black">Admin</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full h-12 sm:h-14 mt-8 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium text-[15px] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Create Account
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>
          
          <div className="mt-8 text-center text-xs text-white/40">
            <p>© 2026 NeoConnect. Secure internal portal. nitish</p>
          </div>
        </div>

      </div>
    </div>
  );
}
