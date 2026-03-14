'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Zap, Target, Lock, BarChart3, ChevronRight, Menu, X, Shield } from 'lucide-react';
import Image from 'next/image';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] } })
};

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      const paths = { 'staff': '/dashboard/staff', 'secretariat': '/dashboard/secretariat', 'case-manager': '/dashboard/case-manager', 'admin': '/dashboard/admin' };
      router.push(paths[user.role] || '/dashboard/staff');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) return <div className="min-h-screen bg-background" />;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden font-sans">
      {/* ============= NAVBAR ============= */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-xl border-b border-border' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded flex items-center justify-center">
                <Image src="/413790699_122106144620152037_7646346380797868274_n-removebg-preview.svg" alt="NeoConnect" width={28} height={28} className="object-contain" />
              </div>
              <span className="text-xl font-bold tracking-tight">NeoConnect</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {[
                { label: 'Features', href: '#features' },
                { label: 'Security', href: '#security' },
                { label: 'Impact', href: '#impact' },
              ].map(item => (
                <a key={item.label} href={item.href} className="text-sm font-medium text-white/60 hover:text-white transition-colors">
                  {item.label}
                </a>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
                Log in
              </Link>
              <Link href="/register">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 shadow-[0_0_20px_rgba(100,100,255,0.2)]">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <Button variant="ghost" size="icon" className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* ============= HERO SECTION ============= */}
      <section className="relative pt-40 pb-20 px-6 sm:px-12 max-w-7xl mx-auto flex flex-col items-center text-center z-10">
        <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={0}>
          <Badge variant="outline" className="mb-8 px-4 py-1.5 rounded-full border-white/10 bg-white/5 text-sm font-medium text-white/80 backdrop-blur-md">
            🚀 Introducing NeoConnect 2.0
          </Badge>
        </motion.div>

        <motion.h1 variants={fadeInUp} initial="hidden" animate="visible" custom={1}
          className="text-5xl sm:text-7xl lg:text-[80px] font-bold tracking-tight leading-[1.05] max-w-5xl"
        >
          Unleash the power of <br className="hidden sm:block" />
          <span className="text-[#8484ff]">transparent feedback</span>
        </motion.h1>

        <motion.p variants={fadeInUp} initial="hidden" animate="visible" custom={2}
          className="mt-8 text-xl text-white/50 max-w-3xl leading-relaxed font-light tracking-wide"
        >
          Say goodbye to outdated complaint boxes. Every employee, regardless of department, can now raise issues, track resolutions, and influence change like never before. Simple. Intuitive. And fully accountable.
        </motion.p>

        <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={3}
          className="mt-12 flex flex-col sm:flex-row items-center gap-4"
        >
          <Link href="/register">
            <Button size="lg" className="h-14 px-8 text-base bg-primary hover:bg-primary/90 text-white rounded-full shadow-[0_0_30px_rgba(100,100,255,0.3)] transition-all hover:scale-105">
              Start for free
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="h-14 px-8 text-base border-white/10 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all">
              Book a demo
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* ============= BENTO BOX FEATURES (Cobalt Style) ============= */}
      <section id="features" className="relative py-20 px-4 sm:px-8 max-w-[1400px] mx-auto z-10 scroll-mt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Main Feature (Span 2) */}
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} custom={0}
            className="md:col-span-2 relative rounded-[32px] bg-card border border-white/5 overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div className="p-10 lg:p-12 relative z-10 flex flex-col h-full justify-between">
              <div className="max-w-md">
                <h3 className="text-3xl font-bold tracking-tight mb-4">Deep Analytics at your fingertips</h3>
                <p className="text-white/50 text-lg leading-relaxed mb-10">
                  All your feedback data, complaints, and organizational hotspots in one place to provide quick answers and make decisions instantly.
                </p>
                <Link href="/register" className="flex items-center gap-2 text-primary font-medium group/link">
                  Get started free <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
              
              {/* Image Asset */}
              <div className="mt-10 lg:absolute lg:right-0 lg:bottom-0 lg:w-[500px] h-[300px] pointer-events-none">
                <Image src="/cubes.png" alt="Data Cubes" fill className="object-contain object-right-bottom mix-blend-screen opacity-90" priority />
              </div>
            </div>
          </motion.div>

          {/* Card 2: Organization-wide Polls */}
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} custom={1}
            className="md:col-span-1 border border-white/5 bg-card rounded-[32px] p-10 lg:p-12 relative overflow-hidden group flex flex-col justify-end"
          >
            {/* Image Asset */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] -mr-20 -mt-20 pointer-events-none opacity-80 mix-blend-screen group-hover:scale-105 transition-transform duration-700">
              <Image src="/sphere.png" alt="Abstract Sphere" fill className="object-contain" />
            </div>
            
            <div className="relative z-10 mt-40">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                <BarChart3 className="w-5 h-5 text-white/80" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight mb-3">Organization-wide Polls</h3>
              <p className="text-white/50 leading-relaxed">
                Create polls, gather votes, and let democracy drive decisions across the entire organization.
              </p>
            </div>
          </motion.div>

          {/* Card 3: Auto-Escalation */}
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} custom={2}
            className="md:col-span-1 border border-white/5 bg-card rounded-[32px] p-10 lg:p-12 group"
          >
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
              <Zap className="w-5 h-5 text-white/80" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight mb-3">7-Day escalation</h3>
            <p className="text-white/50 leading-relaxed">
              If a Case Manager ignores a ticket for 7 days, the system automatically escalates it to upper management.
            </p>
            {/* Fake UI Element */}
            <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-red-500/20">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_red]" />
                <span className="text-sm font-medium">NEO-2026-042 Escalated</span>
              </div>
            </div>
          </motion.div>

          {/* Card 4: Impact Tracking (Span 2) */}
          <motion.div id="impact" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} custom={3}
            className="md:col-span-2 border border-white/5 bg-card rounded-[32px] overflow-hidden flex flex-col md:flex-row group scroll-mt-24"
          >
            <div className="p-10 lg:p-12 md:w-1/2 flex flex-col justify-center">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                <Target className="w-5 h-5 text-white/80" />
              </div>
              <h3 className="text-3xl font-bold tracking-tight mb-4">Track real impact</h3>
              <p className="text-white/50 leading-relaxed">
                Watch feedback transform into policy. The Public Hub displays resolved cases so the entire organization sees progress, not just complaints.
              </p>
            </div>
            
            {/* Fake UI Sidebar/List */}
            <div className="bg-[#111118] p-8 md:w-1/2 border-l border-white/5 flex flex-col gap-4 justify-center relative">
               <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#0A0A0E] to-transparent pointer-events-none z-10" />
               <div className="p-4 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-between">
                 <div>
                   <p className="font-medium text-sm">Policy Update H3</p>
                   <p className="text-xs text-emerald-400 mt-1">Resolution implemented</p>
                 </div>
                 <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400">Resolved</Badge>
               </div>
               <div className="p-4 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-between opacity-50">
                 <div>
                   <p className="font-medium text-sm">Hardware upgrades</p>
                   <p className="text-xs text-emerald-400 mt-1">Approved for Q2</p>
                 </div>
                 <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400">Resolved</Badge>
               </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ============= SECURITY SECTION ============= */}
      <section id="security" className="relative py-24 px-4 sm:px-8 max-w-[1400px] mx-auto z-10 scroll-mt-24">
        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
          className="rounded-[32px] bg-card border border-white/5 overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />
          <div className="p-10 lg:p-16 flex flex-col md:flex-row items-center gap-12 relative z-10">
            
            {/* Left: Content */}
            <div className="md:w-1/2">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-8">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Security-first <br className="hidden sm:block"/>architecture
              </h2>
              <p className="text-white/50 text-lg leading-relaxed mb-8 max-w-lg">
                Every complaint, vote, and case is protected with enterprise-grade security. Anonymous submissions ensure no identity is ever exposed.
              </p>
              <div className="space-y-4">
                {[
                  'Anonymous submissions with zero identity leaks',
                  'Role-based access controls across 4 user levels',
                  'Encrypted data storage and secure API endpoints',
                  'JWT-based authentication with session timeouts',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="text-white/70 text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Visual */}
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-sm">
                {/* Decorative rings */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 rounded-full border border-white/5 animate-pulse" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full border border-primary/10" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center">
                    <Shield className="w-12 h-12 text-primary/60" />
                  </div>
                </div>
                {/* Fake security stats */}
                <div className="relative z-10 space-y-4 pt-52">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/60">Encryption</span>
                      <span className="text-sm font-bold text-emerald-400">AES-256</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/60">Uptime</span>
                      <span className="text-sm font-bold text-emerald-400">99.9%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </section>

      {/* ============= BOTTOM CTA ============= */}
      <section className="py-32 px-6 text-center border-t border-white/5 mt-20">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          Ready to manage your <br className="hidden sm:block"/>organization like a pro?
        </h2>
        <p className="text-white/50 text-xl max-w-2xl mx-auto mb-10">
          The first feedback tool you&apos;ll love. And the last one you&apos;ll ever need.
        </p>
        <Link href="/register">
          <Button size="lg" className="h-14 px-10 text-lg bg-primary hover:bg-primary/90 text-white rounded-full shadow-[0_0_40px_rgba(100,100,255,0.4)]">
            Get Started Now
          </Button>
        </Link>
      </section>

      {/* ============= MOCK FOOTER ============= */}
      <footer className="py-10 px-6 max-w-7xl mx-auto border-t border-white/5 text-sm text-white/40 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>© 2026 NeoConnect Technologies Inc. nitish</p>
        <div className="flex text-white/40 gap-6">
          <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-white transition-colors">Terms</Link>
          <Link href="#" className="hover:text-white transition-colors">Updates</Link>
        </div>
      </footer>
    </div>
  );
}
