'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { FolderOpen, Search, BarChart3, Clock, CheckCircle2, AlertTriangle, FileText, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import api from '@/lib/api';
import Link from 'next/link';

export default function SecretariatDashboard() {
  const [stats, setStats] = useState({ totalCases: 0, newCases: 0, inProgress: 0, resolved: 0, escalated: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/analytics/overview');
        setStats(res.data.overview);
      } catch (e) { console.error(e); }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Cases', value: stats.totalCases, icon: FileText, color: 'text-primary', href: '/dashboard/secretariat/inbox' },
    { title: 'New Cases', value: stats.newCases, icon: FolderOpen, color: 'text-blue-400', href: '/dashboard/secretariat/inbox' },
    { title: 'In Progress', value: stats.inProgress, icon: Clock, color: 'text-amber-400', href: '/dashboard/secretariat/inbox' },
    { title: 'Resolved', value: stats.resolved, icon: CheckCircle2, color: 'text-emerald-400', href: '/dashboard/secretariat/inbox' },
    { title: 'Escalated', value: stats.escalated, icon: AlertTriangle, color: 'text-red-400', href: '/dashboard/secretariat/inbox' },
  ];

  const quickLinks = [
    { label: 'Case Inbox', href: '/dashboard/secretariat/inbox', icon: FolderOpen, desc: 'View and assign cases' },
    { label: 'Analytics', href: '/dashboard/secretariat/analytics', icon: BarChart3, desc: 'View reports & charts' },
    { label: 'Manage Polls', href: '/dashboard/secretariat/polls', icon: Users, desc: 'Create & manage polls' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Secretariat Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage cases, polls, and organizational feedback</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat, i) => {
          const Wrapper = stat.href ? Link : 'div';
          return (
          <motion.div key={stat.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Wrapper {...(stat.href ? { href: stat.href } : {})}>
              <Card className={`glass-card ${stat.href ? 'cursor-pointer hover:border-white/20 transition-colors' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.title}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            </Wrapper>
          </motion.div>
          );
        })}
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {quickLinks.map((item, i) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }}>
            <Link href={item.href}>
              <Card className="glass-card group cursor-pointer h-full">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{item.label}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
