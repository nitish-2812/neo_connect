'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Send, Paperclip, Loader2, CheckCircle2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function SubmitComplaint() {
  const [form, setForm] = useState({ title: '', description: '', category: '', severity: 'Medium', department: '', location: '', isAnonymous: false });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => formData.append(key, val));
      files.forEach(f => formData.append('attachments', f));

      const res = await api.post('/cases', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSubmitted(res.data.trackingId);
      toast.success('Complaint submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto mt-8">
        <Card className="glass-card text-center">
          <CardContent className="p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold">Complaint Submitted!</h2>
            <p className="text-muted-foreground text-sm">Your tracking ID is:</p>
            <code className="text-2xl font-bold font-mono text-primary">{submitted}</code>
            <p className="text-xs text-muted-foreground">Save this ID to track your complaint status.</p>
            <div className="flex gap-3 justify-center pt-2">
              <Button onClick={() => { setSubmitted(null); setForm({ title: '', description: '', category: '', severity: 'Medium', department: '', location: '', isAnonymous: false }); setFiles([]); }}>
                Submit Another
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/dashboard/staff/track'}>
                Track Complaints
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const categories = ['Safety', 'Policy', 'Facilities', 'HR', 'Other'];
  const departments = ['IT', 'HR', 'Finance', 'Operations', 'Marketing', 'Engineering', 'Legal', 'Admin'];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Submit a Complaint</h1>
        <p className="text-muted-foreground text-sm mt-1">Report an issue or provide feedback. All submissions are treated confidentially.</p>
      </div>

      <Card className="glass-card">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" placeholder="Brief summary of your complaint" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="bg-background/50" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea id="description" placeholder="Describe the issue in detail..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={4} className="bg-background/50 resize-none" />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={form.category} onValueChange={(val) => setForm({ ...form, category: val })} required>
                  <SelectTrigger className="bg-background/50"><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Severity</Label>
                <Select value={form.severity} onValueChange={(val) => setForm({ ...form, severity: val })}>
                  <SelectTrigger className="bg-background/50"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Department</Label>
                <Select value={form.department} onValueChange={(val) => setForm({ ...form, department: val })}>
                  <SelectTrigger className="bg-background/50"><SelectValue placeholder="Select department" /></SelectTrigger>
                  <SelectContent>{departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="e.g. Building A, Floor 3" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="bg-background/50" />
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label>Attachments</Label>
              <div className="border-2 border-dashed border-border/50 rounded-lg p-4 hover:border-primary/30 transition-colors">
                <input type="file" multiple accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx" onChange={(e) => setFiles(Array.from(e.target.files))} className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer">
                  <Paperclip className="w-6 h-6 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">Click to upload files</span>
                  <span className="text-xs text-muted-foreground/60 mt-0.5">JPG, PNG, PDF, DOC (max 10MB)</span>
                </label>
              </div>
              {files.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {files.map((f, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded-md bg-muted/50 text-muted-foreground">{f.name}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Anonymous Toggle */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/30">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Submit Anonymously</p>
                  <p className="text-xs text-muted-foreground">Your identity will be hidden from case managers</p>
                </div>
              </div>
              <Switch checked={form.isAnonymous} onCheckedChange={(checked) => setForm({ ...form, isAnonymous: checked })} />
            </div>

            <Button type="submit" className="w-full group" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4 mr-2" /> Submit Complaint</>}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
