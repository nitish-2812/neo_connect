'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Clock, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api';

const statusColors = {
  'New': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Assigned': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'In Progress': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Pending': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  'Resolved': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Escalated': 'bg-red-500/10 text-red-400 border-red-500/20',
};

const severityColors = { 'Low': 'text-green-400', 'Medium': 'text-amber-400', 'High': 'text-red-400' };

export default function TrackComplaints() {
  const [cases, setCases] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await api.get('/cases/my');
        setCases(res.data.cases || []);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetchCases();
  }, []);

  const filtered = cases.filter(c =>
    c.trackingId?.toLowerCase().includes(search.toLowerCase()) ||
    c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.status?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Track Your Complaints</h1>
        <p className="text-muted-foreground text-sm mt-1">View the status of all your submitted complaints</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search by tracking ID, title, or status..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-background/50" />
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading your complaints...</div>
      ) : filtered.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No complaints found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((c, i) => (
            <motion.div key={c._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="glass-card">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <code className="text-xs text-primary font-mono bg-primary/5 px-2 py-0.5 rounded">{c.trackingId}</code>
                        <Badge variant="outline" className={`text-[10px] ${statusColors[c.status] || ''}`}>{c.status}</Badge>
                        <Badge variant="outline" className={`text-[10px] ${severityColors[c.severity] || ''}`}>{c.severity}</Badge>
                        {c.category && <Badge variant="outline" className="text-[10px]">{c.category}</Badge>}
                      </div>
                      <h3 className="font-medium text-sm mt-2">{c.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{c.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(c.createdAt).toLocaleDateString()}</span>
                        {c.department && <span>📍 {c.department}</span>}
                        {c.assignedTo && <span>👤 Assigned to: {c.assignedTo.name}</span>}
                      </div>
                      {c.notes && c.notes.length > 0 && (
                        <div className="mt-3 p-2 rounded-md bg-muted/30 border border-border/20">
                          <p className="text-[10px] text-muted-foreground font-medium mb-1">Latest Update:</p>
                          <p className="text-xs">{c.notes[c.notes.length - 1].content}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
