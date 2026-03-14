'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function SecretariatMinutes() {
  const [form, setForm] = useState({ title: '', description: '', quarter: '' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const quarters = ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025', 'Q1 2026', 'Q2 2026'];

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please select a file');
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      formData.append('file', file);
      await api.post('/documents/minutes', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Meeting minutes uploaded!');
      setForm({ title: '', description: '', quarter: '' }); setFile(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Upload Meeting Minutes</h1>
        <p className="text-muted-foreground text-sm mt-1">Upload meeting documents for the public hub</p>
      </div>
      <Card className="glass-card">
        <CardContent className="p-6">
          <form onSubmit={handleUpload} className="space-y-5">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input placeholder="e.g. Q1 2026 JCC Meeting" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="bg-background/50" />
            </div>
            <div className="space-y-2">
              <Label>Quarter</Label>
              <Select value={form.quarter} onValueChange={(val) => setForm({ ...form, quarter: val })}>
                <SelectTrigger className="bg-background/50"><SelectValue placeholder="Select quarter" /></SelectTrigger>
                <SelectContent>{quarters.map(q => <SelectItem key={q} value={q}>{q}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Brief description..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="bg-background/50 resize-none" />
            </div>
            <div className="space-y-2">
              <Label>File</Label>
              <div className="border-2 border-dashed border-border/50 rounded-lg p-4 hover:border-primary/30 transition-colors">
                <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files[0])} className="hidden" id="minutes-upload" />
                <label htmlFor="minutes-upload" className="flex flex-col items-center cursor-pointer">
                  <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">{file ? file.name : 'Click to upload'}</span>
                </label>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Upload className="w-4 h-4 mr-2" /> Upload Minutes</>}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
