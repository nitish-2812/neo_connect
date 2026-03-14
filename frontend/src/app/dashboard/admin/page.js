'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Shield, Settings, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import Link from 'next/link';

export default function AdminDashboard() {
  const [userCount, setUserCount] = useState(0);
  const [caseCount, setCaseCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, analyticsRes] = await Promise.all([
          api.get('/auth/users'),
          api.get('/analytics/overview'),
        ]);
        setUserCount(usersRes.data.users?.length || 0);
        setCaseCount(analyticsRes.data.overview?.totalCases || 0);
      } catch (e) { console.error(e); }
    };
    fetchStats();
  }, []);

  const items = [
    { label: 'Total Users', value: userCount, icon: Users, color: 'text-primary', href: '/dashboard/admin/users' },
    { label: 'Total Cases', value: caseCount, icon: FileText, color: 'text-amber-400' },
  ];

  const actions = [
    { label: 'Manage Users', href: '/dashboard/admin/users', icon: Users, desc: 'View, edit roles, activate/deactivate' },
    { label: 'Security Settings', href: '/dashboard/admin/settings', icon: Settings, desc: 'Password policies & system config' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2"><Shield className="w-6 h-6 text-primary" /> Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">System administration and user management</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {items.map((s, i) => {
          const content = (
            <Card className={`glass-card ${s.href ? 'cursor-pointer hover:border-white/20 transition-colors' : ''}`}>
              <CardContent className="p-5 flex items-center justify-between">
                <div><p className="text-xs text-muted-foreground">{s.label}</p><p className="text-3xl font-bold mt-1">{s.value}</p></div>
                <s.icon className={`w-8 h-8 ${s.color}`} />
              </CardContent>
            </Card>
          );
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              {s.href ? <Link href={s.href}>{content}</Link> : content}
            </motion.div>
          );
        })}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {actions.map((a, i) => (
          <motion.div key={a.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
            <Link href={a.href}>
              <Card className="glass-card group cursor-pointer h-full">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <a.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div><h3 className="font-medium">{a.label}</h3><p className="text-xs text-muted-foreground mt-0.5">{a.desc}</p></div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
