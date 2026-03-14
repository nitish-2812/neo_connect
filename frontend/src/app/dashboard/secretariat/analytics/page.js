'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#34d399', '#60a5fa', '#fbbf24', '#f87171', '#a78bfa', '#fb923c'];

export default function AnalyticsDashboard() {
  const [overview, setOverview] = useState({});
  const [byDept, setByDept] = useState([]);
  const [byCat, setByCat] = useState([]);
  const [byStatus, setByStatus] = useState([]);
  const [hotspots, setHotspots] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [o, d, c, s, h] = await Promise.all([
          api.get('/analytics/overview'),
          api.get('/analytics/department'),
          api.get('/analytics/category'),
          api.get('/analytics/status'),
          api.get('/analytics/hotspots'),
        ]);
        setOverview(o.data.overview || {});
        setByDept(d.data.departments || []);
        setByCat(c.data.categories || []);
        setByStatus(s.data.statuses || []);
        setHotspots(h.data.hotspots || []);
      } catch (e) { console.error(e); }
    };
    fetchAll();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2"><BarChart3 className="w-6 h-6 text-primary" /> Analytics Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Insights into organizational feedback trends</p>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Cases by Department */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Cases by Department</CardTitle></CardHeader>
            <CardContent>
              {byDept.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={byDept}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="department" tick={{ fontSize: 11, fill: '#999' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#999' }} />
                    <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: 12 }} />
                    <Bar dataKey="count" fill="#34d399" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <p className="text-sm text-muted-foreground text-center py-8">No data yet</p>}
            </CardContent>
          </Card>
        </motion.div>

        {/* Cases by Category */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Cases by Category</CardTitle></CardHeader>
            <CardContent>
              {byCat.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={byCat} dataKey="count" nameKey="category" cx="50%" cy="50%" outerRadius={80} label={({ category, count }) => `${category} (${count})`} labelLine={false}>
                      {byCat.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : <p className="text-sm text-muted-foreground text-center py-8">No data yet</p>}
            </CardContent>
          </Card>
        </motion.div>

        {/* Cases by Status */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Cases by Status</CardTitle></CardHeader>
            <CardContent>
              {byStatus.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={byStatus} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#999' }} />
                    <YAxis dataKey="status" type="category" tick={{ fontSize: 11, fill: '#999' }} width={80} />
                    <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: 12 }} />
                    <Bar dataKey="count" fill="#60a5fa" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <p className="text-sm text-muted-foreground text-center py-8">No data yet</p>}
            </CardContent>
          </Card>
        </motion.div>

        {/* Hotspots */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" /> Hotspot Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hotspots.length > 0 ? (
                <div className="space-y-3">
                  {hotspots.map((h, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                      <div>
                        <p className="text-sm font-medium">{h.department}</p>
                        <p className="text-xs text-muted-foreground">{h.category}</p>
                      </div>
                      <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20">{h.count} cases</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No hotspots detected. Departments with 5+ similar issues will appear here.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
