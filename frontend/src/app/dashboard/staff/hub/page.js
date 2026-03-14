'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, FileText, TrendingUp, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api';

export default function PublicHub() {
  const [resolvedCases, setResolvedCases] = useState([]);
  const [polls, setPolls] = useState([]);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [casesRes, pollsRes, docsRes] = await Promise.all([
          api.get('/cases/resolved'),
          api.get('/polls'),
          api.get('/documents/minutes'),
        ]);
        setResolvedCases(casesRes.data.cases || []);
        setPolls((pollsRes.data.polls || []).filter(p => !p.isActive || p.totalVotes > 0));
        setDocuments(docsRes.data.documents || []);
      } catch (e) { console.error(e); }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Globe className="w-6 h-6 text-primary" /> Public Hub
        </h1>
        <p className="text-muted-foreground text-sm mt-1">See how your feedback leads to real change</p>
      </div>

      {/* Quarterly Digest */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2"><BookOpen className="w-4 h-4 text-primary" /> Quarterly Digest</CardTitle>
          </CardHeader>
          <CardContent>
            {resolvedCases.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No resolved cases to display yet.</p>
            ) : (
              <div className="space-y-3">
                {resolvedCases.slice(0, 5).map(c => (
                  <div key={c._id} className="p-3 rounded-lg bg-muted/30 border border-border/20">
                    <div className="flex items-center gap-2">
                      <code className="text-xs text-primary font-mono">{c.trackingId}</code>
                      <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Resolved</Badge>
                    </div>
                    <h4 className="text-sm font-medium mt-1">{c.title}</h4>
                    {c.resolution && <p className="text-xs text-muted-foreground mt-1">Resolution: {c.resolution}</p>}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Impact Tracking */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" /> Impact Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/30">
                    <th className="text-left py-2 text-xs text-muted-foreground font-medium">What Was Raised</th>
                    <th className="text-left py-2 text-xs text-muted-foreground font-medium">Action Taken</th>
                    <th className="text-left py-2 text-xs text-muted-foreground font-medium">What Changed</th>
                  </tr>
                </thead>
                <tbody>
                  {resolvedCases.slice(0, 5).map(c => (
                    <tr key={c._id} className="border-b border-border/10">
                      <td className="py-2 text-xs">{c.title}</td>
                      <td className="py-2 text-xs text-muted-foreground">{c.category} review</td>
                      <td className="py-2 text-xs text-emerald-400">{c.resolution || 'Issue resolved'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Minutes Archive */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2"><FileText className="w-4 h-4 text-primary" /> Minutes Archive</CardTitle>
          </CardHeader>
          <CardContent>
            {documents.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No meeting minutes uploaded yet.</p>
            ) : (
              <div className="space-y-2">
                {documents.map(doc => (
                  <div key={doc._id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div>
                      <h4 className="text-sm font-medium">{doc.title}</h4>
                      <p className="text-xs text-muted-foreground">{doc.quarter} · Uploaded by {doc.uploadedBy?.name}</p>
                    </div>
                    <a href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/uploads/${doc.filePath}`} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">Download</a>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
