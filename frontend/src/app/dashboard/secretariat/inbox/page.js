'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, UserPlus, Clock, Filter } from 'lucide-react';
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

export default function SecretariatInbox() {
  const [cases, setCases] = useState([]);
  const [caseManagers, setCaseManagers] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [assignDialog, setAssignDialog] = useState({ open: false, caseId: null });
  const [selectedManager, setSelectedManager] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [casesRes, usersRes] = await Promise.all([
        api.get('/cases'),
        api.get('/auth/users'),
      ]);
      setCases(casesRes.data.cases || []);
      setCaseManagers((usersRes.data.users || []).filter(u => u.role === 'case-manager'));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const handleAssign = async () => {
    if (!selectedManager) return toast.error('Select a case manager');
    try {
      await api.put(`/cases/${assignDialog.caseId}/assign`, { assignedTo: selectedManager });
      toast.success('Case assigned successfully!');
      setAssignDialog({ open: false, caseId: null });
      setSelectedManager('');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign');
    }
  };

  const filtered = cases.filter(c => {
    const matchesSearch = c.trackingId?.toLowerCase().includes(search.toLowerCase()) || c.title?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Case Inbox</h1>
        <p className="text-muted-foreground text-sm mt-1">View all complaints and assign case managers</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by ID or title..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-background/50" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 bg-background/50"><Filter className="w-3 h-3 mr-2" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {['New', 'Assigned', 'In Progress', 'Pending', 'Resolved', 'Escalated'].map(s => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading cases...</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c, i) => (
            <motion.div key={c._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card className="glass-card">
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
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{c.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground">
                        <span><Clock className="w-3 h-3 inline mr-1" />{new Date(c.createdAt).toLocaleDateString()}</span>
                        <span>📍 {c.department || 'N/A'}</span>
                        <span>👤 {c.isAnonymous ? 'Anonymous' : c.submittedBy?.name}</span>
                        {c.assignedTo && <span>🔧 {c.assignedTo.name}</span>}
                      </div>
                    </div>
                    {c.status === 'New' && (
                      <Button size="sm" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10" onClick={() => setAssignDialog({ open: true, caseId: c._id })}>
                        <UserPlus className="w-3 h-3 mr-1" /> Assign
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">No cases found.</p>}
        </div>
      )}

      {/* Assign Dialog */}
      <Dialog open={assignDialog.open} onOpenChange={(open) => setAssignDialog({ ...assignDialog, open })}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle>Assign Case Manager</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <Select value={selectedManager} onValueChange={setSelectedManager}>
              <SelectTrigger className="bg-background/50"><SelectValue placeholder="Select a case manager" /></SelectTrigger>
              <SelectContent>
                {caseManagers.map(cm => (
                  <SelectItem key={cm._id} value={cm._id}>{cm.name} ({cm.department || 'N/A'})</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {caseManagers.length === 0 && <p className="text-xs text-muted-foreground">No case managers registered yet. Register a user with the &quot;Case Manager&quot; role first.</p>}
            <Button onClick={handleAssign} className="w-full" disabled={!selectedManager}>Assign</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
