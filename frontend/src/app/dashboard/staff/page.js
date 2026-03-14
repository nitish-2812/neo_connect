'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Send, Search, Vote, Clock, CheckCircle2, AlertTriangle, ArrowRight, TrendingUp, Sparkles } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] } })
};

const statusColors = {
  'New': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Assigned': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'In Progress': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Pending': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  'Resolved': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Escalated': 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function StaffDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, escalated: 0 });
  const [recentCases, setRecentCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/cases/my');
        const cases = res.data.cases || [];
        setRecentCases(cases.slice(0, 5));
        setStats({
          total: cases.length,
          pending: cases.filter(c => ['New', 'Assigned', 'In Progress', 'Pending'].includes(c.status)).length,
          resolved: cases.filter(c => c.status === 'Resolved').length,
          escalated: cases.filter(c => c.status === 'Escalated').length,
        });
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetchData();
  }, []);

  const statCards = [
    { title: 'Total Submitted', value: stats.total, icon: FileText, gradient: 'from-blue-500/20 to-primary/20', iconColor: 'text-primary', borderColor: 'border-white/10' },
    { title: 'In Progress', value: stats.pending, icon: Clock, gradient: 'from-amber-500/20 to-orange-500/20', iconColor: 'text-amber-400', borderColor: 'border-white/10' },
    { title: 'Resolved', value: stats.resolved, icon: CheckCircle2, gradient: 'from-emerald-500/20 to-green-500/20', iconColor: 'text-emerald-400', borderColor: 'border-white/10' },
    { title: 'Escalated', value: stats.escalated, icon: AlertTriangle, gradient: 'from-red-500/20 to-rose-500/20', iconColor: 'text-red-400', borderColor: 'border-white/10' },
  ];

  const quickActions = [
    { label: 'Submit Complaint', href: '/dashboard/staff/submit', icon: Send, desc: 'Report a new issue or feedback', gradient: 'from-primary/10 to-blue-500/10', iconColor: 'text-primary' },
    { label: 'Track Complaints', href: '/dashboard/staff/track', icon: Search, desc: 'View status of your submissions', gradient: 'from-white/10 to-white/5', iconColor: 'text-white/80' },
    { label: 'Vote in Polls', href: '/dashboard/staff/polls', icon: Vote, desc: 'Participate in active polls', gradient: 'from-white/10 to-white/5', iconColor: 'text-white/80' },
  ];

  return (
    <div className="space-y-8 text-white">
      {/* Welcome Section */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={0}>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},{' '}
              <span className="text-[#8484ff]">{user?.name?.split(' ')[0]}</span>
            </h1>
            <p className="text-white/50 text-base mt-2 font-light">Here&apos;s an overview of your feedback and complaints</p>
          </div>
          <Link href="/dashboard/staff/submit">
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl h-11 px-6 shadow-[0_0_20px_rgba(100,100,255,0.2)] group">
              <Send className="w-4 h-4 mr-2" />
              New Complaint
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div key={stat.title} variants={fadeInUp} initial="hidden" animate="visible" custom={i + 1}>
            <Card className={`bg-[#0A0A0F] border ${stat.borderColor} overflow-hidden`}>
              <CardContent className="p-5 relative">
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-20`} />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[11px] text-white/50 font-medium uppercase tracking-widest">{stat.title}</p>
                    <div className={`w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center`}>
                      <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
                    </div>
                  </div>
                  <p className="text-3xl font-bold tracking-tight text-white">{loading ? '—' : stat.value}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <TrendingUp className="w-3.5 h-3.5 text-white/40" />
                    <span className="text-xs text-white/40">Updated just now</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <motion.h2 variants={fadeInUp} initial="hidden" animate="visible" custom={5} className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          Quick Actions
        </motion.h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {quickActions.map((action, i) => (
            <motion.div key={action.label} variants={fadeInUp} initial="hidden" animate="visible" custom={5 + i} className="h-full">
              <Link href={action.href}>
                <Card className="bg-[#0A0A0F] border border-white/10 group cursor-pointer h-full overflow-hidden hover:border-primary/50 transition-colors duration-300">
                  <CardContent className="p-5 relative h-full flex flex-col justify-center">
                    <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                    <div className="relative flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-300`}>
                        <action.icon className={`w-5 h-5 ${action.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm text-white group-hover:text-primary transition-colors">{action.label}</h3>
                        <p className="text-xs text-white/50 mt-1 font-light">{action.desc}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/30 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:text-primary transition-all duration-300" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Cases */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={8}>
        <Card className="bg-[#0A0A0F] border border-white/10 overflow-hidden">
          <CardHeader className="pb-4 flex flex-row items-center justify-between border-b border-white/5">
            <CardTitle className="text-base font-semibold tracking-wide text-white">Recent Submissions</CardTitle>
            <Link href="/dashboard/staff/track">
              <Button variant="ghost" size="sm" className="text-xs text-white/50 hover:text-white hover:bg-white/5 group h-8 rounded-lg">
                View All <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-4">
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : recentCases.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mx-auto flex items-center justify-center mb-5">
                  <FileText className="w-8 h-8 text-white/20" />
                </div>
                <p className="text-white/50 text-sm font-light">No complaints submitted yet</p>
                <Link href="/dashboard/staff/submit">
                  <Button variant="outline" size="sm" className="mt-4 group border-white/10 text-white hover:bg-white/5 hover:text-primary">
                    Submit your first <ArrowRight className="w-3 h-3 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {recentCases.map((c) => (
                  <motion.div key={c._id} whileHover={{ x: 4 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-transparent hover:border-white/10 hover:bg-white/[0.07] transition-all duration-200 cursor-pointer group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <code className="text-xs text-[#8484ff] font-mono bg-[#8484ff]/10 px-2 py-0.5 rounded-md border border-[#8484ff]/20">{c.trackingId}</code>
                        <Badge variant="outline" className={`text-[10px] uppercase tracking-wider ${statusColors[c.status] || ''}`}>{c.status}</Badge>
                      </div>
                      <p className="text-sm font-medium tracking-wide truncate mt-2 text-white/90 group-hover:text-white transition-colors">{c.title}</p>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <span className="text-xs text-white/40 font-light whitespace-nowrap">{new Date(c.createdAt).toLocaleDateString()}</span>
                      <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
