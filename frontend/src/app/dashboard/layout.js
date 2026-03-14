'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Shield, Home, FileText, Send, Search, BarChart3, Vote, FolderOpen,
  Users, Settings, LogOut, Menu, X, ChevronRight, Globe, Upload, Bell, Sparkles
} from 'lucide-react';
import Image from 'next/image';

const roleNavItems = {
  staff: [
    { label: 'Dashboard', href: '/dashboard/staff', icon: Home },
    { label: 'Submit Complaint', href: '/dashboard/staff/submit', icon: Send },
    { label: 'Track Complaints', href: '/dashboard/staff/track', icon: Search },
    { label: 'Polls', href: '/dashboard/staff/polls', icon: Vote },
    { label: 'Public Hub', href: '/dashboard/staff/hub', icon: Globe },
  ],
  secretariat: [
    { label: 'Dashboard', href: '/dashboard/secretariat', icon: Home },
    { label: 'Case Inbox', href: '/dashboard/secretariat/inbox', icon: FolderOpen },
    { label: 'Create Poll', href: '/dashboard/secretariat/polls', icon: Vote },
    { label: 'Meeting Minutes', href: '/dashboard/secretariat/minutes', icon: Upload },
    { label: 'Analytics', href: '/dashboard/secretariat/analytics', icon: BarChart3 },
    { label: 'Public Hub', href: '/dashboard/staff/hub', icon: Globe },
  ],
  'case-manager': [
    { label: 'My Cases', href: '/dashboard/case-manager', icon: FolderOpen },
    { label: 'Public Hub', href: '/dashboard/staff/hub', icon: Globe },
  ],
  admin: [
    { label: 'Dashboard', href: '/dashboard/admin', icon: Home },
    { label: 'Manage Users', href: '/dashboard/admin/users', icon: Users },
    { label: 'Security', href: '/dashboard/admin/settings', icon: Settings },
    { label: 'Public Hub', href: '/dashboard/staff/hub', icon: Globe },
  ],
};

const roleTitles = {
  staff: 'Staff Portal',
  secretariat: 'Management Portal',
  'case-manager': 'Case Manager',
  admin: 'Admin Portal',
};

const roleBadgeColors = {
  staff: 'bg-white/5 text-white/70 border-white/10',
  secretariat: 'bg-primary/10 text-primary border-primary/20',
  'case-manager': 'bg-white/5 text-white/70 border-white/10',
  admin: 'bg-white/5 text-white/70 border-white/10',
};

export default function DashboardLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" />
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
        </div>
      </div>
    );
  }

  const navItems = roleNavItems[user.role] || roleNavItems.staff;
  const initials = user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ============= SIDEBAR ============= */}
      <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-[260px] flex flex-col transition-transform duration-300 ease-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        bg-card border-r border-white/10`}
      >
        {/* Glow at top of sidebar */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-primary/10 blur-[80px] pointer-events-none" />

        {/* Logo */}
        <div className="relative p-6 flex items-center gap-4 border-b border-white/5">
          <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
            <Image src="/413790699_122106144620152037_7646346380797868274_n-removebg-preview.svg" alt="NeoConnect" width={28} height={28} className="object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-base tracking-tight text-white">NeoConnect</h2>
            <p className="text-[11px] text-white/50 tracking-wide uppercase truncate mt-0.5">{roleTitles[user.role]}</p>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden flex-shrink-0 text-white hover:bg-white/10" onClick={() => setSidebarOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="relative flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}>
                <motion.div
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
                    active
                      ? 'bg-primary/10 text-white border border-primary/20 shadow-[0_0_15px_rgba(100,100,255,0.05)]'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full shadow-[0_0_10px_theme(colors.primary.DEFAULT)]"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <item.icon className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${active ? 'text-primary' : 'group-hover:text-white/90'}`} />
                  <span className="flex-1 tracking-wide">{item.label}</span>
                  {active && <ChevronRight className="w-4 h-4 opacity-50 text-primary" />}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="relative p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
            <Avatar className="w-9 h-9 border border-white/20">
              <AvatarFallback className="bg-black text-white text-xs font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate text-white">{user.name}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <Badge variant="outline" className={`text-[9px] px-1.5 py-0 h-4 border-white/10 uppercase tracking-wider ${roleBadgeColors[user.role] || ''}`}>
                  {user.role.replace('-', ' ')}
                </Badge>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start text-white/50 hover:text-white hover:bg-white/5 mt-3 h-10 rounded-lg" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* ============= MAIN CONTENT ============= */}
      <main className="flex-1 min-h-screen flex flex-col relative">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-card/80 backdrop-blur-xl border-b border-white/5 flex items-center px-4 lg:px-8 gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-white/10" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>

          {/* Breadcrumb-style title */}
          <div className="flex-1 flex items-center gap-2">
            <span className="text-xs text-white/40 hidden sm:flex items-center gap-2 font-medium tracking-wide">
              {pathname.split('/').filter(Boolean).map((p, i, arr) => (
                <span key={p} className="flex items-center gap-2">
                  {i > 0 && <span className="opacity-40">/</span>}
                  <span className={i === arr.length - 1 ? 'text-white' : ''}>{p.charAt(0).toUpperCase() + p.slice(1).replace('-', ' ')}</span>
                </span>
              ))}
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user.department && (
              <Badge variant="outline" className="text-[10px] hidden sm:flex bg-white/5 border-white/10 text-white/60 tracking-wider">
                {user.department}
              </Badge>
            )}
            <Avatar className="w-8 h-8 border border-white/20 cursor-pointer hover:border-primary/50 hover:shadow-[0_0_10px_rgba(100,100,255,0.2)] transition-all">
              <AvatarFallback className="bg-black text-white text-[10px] font-bold">{initials}</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 p-4 lg:p-8 w-full max-w-[1400px] mx-auto">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
