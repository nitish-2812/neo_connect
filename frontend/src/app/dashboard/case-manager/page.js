'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { FolderOpen, Clock, MessageSquare, CheckCircle2, AlertTriangle, Loader2, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import api from '@/lib/api';

const statusColors = {
  'New': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Assigned': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'In Progress': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Pending': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  'Resolved': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Escalated': 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function CaseManagerDashboard() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState(null);
  const [noteContent, setNoteContent] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [resolution, setResolution] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const res = await api.get('/cases/assigned');
      setCases(res.data.cases || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleUpdateStatus = async (caseId) => {
    if (!newStatus) return toast.error('Select a status');
    setSubmitting(true);
    try {
      await api.put(`/cases/${caseId}/status`, { status: newStatus, resolution });
      toast.success('Status updated!');
      setNewStatus(''); setResolution('');
      fetchCases();
      setSelectedCase(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddNote = async (caseId) => {
    if (!noteContent.trim()) return toast.error('Enter a note');
    setSubmitting(true);
    try {
      await api.post(`/cases/${caseId}/notes`, { content: noteContent });
      toast.success('Note added!');
      setNoteContent('');
      fetchCases();
      // Refresh selected case
      const res = await api.get(`/cases/${caseId}`);
      setSelectedCase(res.data.case);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add note');
    } finally {
      setSubmitting(false);
    }
  };

  const stats = {
    total: cases.length,
    active: cases.filter(c => ['Assigned', 'In Progress'].includes(c.status)).length,
    pending: cases.filter(c => c.status === 'Pending').length,
    resolved: cases.filter(c => c.status === 'Resolved').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Case Manager Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your assigned cases</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Assigned', value: stats.total, icon: FolderOpen, color: 'text-primary' },
          { label: 'Active', value: stats.active, icon: Clock, color: 'text-amber-400' },
          { label: 'Pending', value: stats.pending, icon: AlertTriangle, color: 'text-orange-400' },
          { label: 'Resolved', value: stats.resolved, icon: CheckCircle2, color: 'text-emerald-400' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="glass-card">
              <CardContent className="p-4 flex items-center justify-between">
                <div><p className="text-xs text-muted-foreground">{s.label}</p><p className="text-2xl font-bold mt-1">{s.value}</p></div>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Cases */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading cases...</div>
      ) : cases.length === 0 ? (
        <Card className="glass-card"><CardContent className="p-12 text-center"><FolderOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" /><p className="text-muted-foreground">No cases assigned to you yet.</p></CardContent></Card>
      ) : (
        <div className="space-y-3">
          {cases.map((c, i) => (
            <motion.div key={c._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card className="glass-card cursor-pointer" onClick={() => { setSelectedCase(c); setNewStatus(c.status); }}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <code className="text-xs text-primary font-mono bg-primary/5 px-2 py-0.5 rounded">{c.trackingId}</code>
                        <Badge variant="outline" className={`text-[10px] ${statusColors[c.status] || ''}`}>{c.status}</Badge>
                        <Badge variant="outline" className="text-[10px]">{c.severity}</Badge>
                        <Badge variant="outline" className="text-[10px]">{c.category}</Badge>
                      </div>
                      <h3 className="font-medium text-sm mt-2">{c.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{c.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground">
                        <span><Clock className="w-3 h-3 inline mr-1" />{new Date(c.createdAt).toLocaleDateString()}</span>
                        <span>👤 {c.submittedBy?.name || 'Anonymous'}</span>
                        <span>📍 {c.department || 'N/A'}</span>
                        {c.notes?.length > 0 && <span><MessageSquare className="w-3 h-3 inline mr-1" />{c.notes.length} note(s)</span>}
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Case Detail Dialog */}
      <Dialog open={!!selectedCase} onOpenChange={(open) => { if (!open) setSelectedCase(null); }}>
        <DialogContent className="glass-card max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedCase && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <code className="text-sm text-primary font-mono">{selectedCase.trackingId}</code>
                  <Badge variant="outline" className={`text-[10px] ${statusColors[selectedCase.status] || ''}`}>{selectedCase.status}</Badge>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div>
                  <h3 className="font-medium">{selectedCase.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{selectedCase.description}</p>
                  <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                    <span>Category: {selectedCase.category}</span>
                    <span>Severity: {selectedCase.severity}</span>
                    <span>Dept: {selectedCase.department}</span>
                  </div>
                </div>

                {/* Update Status */}
                <div className="p-4 rounded-lg bg-muted/30 border border-border/20 space-y-3">
                  <Label className="text-sm font-medium">Update Status</Label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger className="bg-background/50"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['In Progress', 'Pending', 'Resolved'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {newStatus === 'Resolved' && (
                    <Textarea placeholder="Resolution notes..." value={resolution} onChange={(e) => setResolution(e.target.value)} className="bg-background/50 resize-none" rows={2} />
                  )}
                  <Button onClick={() => handleUpdateStatus(selectedCase._id)} disabled={submitting} size="sm">
                    {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Update Status'}
                  </Button>
                </div>

                {/* Add Note */}
                <div className="p-4 rounded-lg bg-muted/30 border border-border/20 space-y-3">
                  <Label className="text-sm font-medium">Add Note</Label>
                  <Textarea placeholder="Write a note..." value={noteContent} onChange={(e) => setNoteContent(e.target.value)} className="bg-background/50 resize-none" rows={3} />
                  <Button onClick={() => handleAddNote(selectedCase._id)} disabled={submitting} size="sm" variant="outline">
                    {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <><MessageSquare className="w-3 h-3 mr-1" /> Add Note</>}
                  </Button>
                </div>

                {/* Notes Timeline */}
                {selectedCase.notes?.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Notes Timeline</Label>
                    {selectedCase.notes.map((note, i) => (
                      <div key={i} className="p-3 rounded-lg bg-muted/20 border border-border/10">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">{note.author?.name || 'Unknown'}</span>
                          <span>·</span>
                          <span>{new Date(note.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-sm mt-1">{note.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
