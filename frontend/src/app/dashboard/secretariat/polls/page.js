'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Vote as VoteIcon, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function SecretariatPolls() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [loading, setLoading] = useState(false);

  const addOption = () => setOptions([...options, '']);
  const removeOption = (idx) => setOptions(options.filter((_, i) => i !== idx));
  const updateOption = (idx, val) => { const o = [...options]; o[idx] = val; setOptions(o); };

  const handleCreate = async (e) => {
    e.preventDefault();
    const validOptions = options.filter(o => o.trim());
    if (validOptions.length < 2) return toast.error('At least 2 options required');
    setLoading(true);
    try {
      await api.post('/polls', { question, options: validOptions });
      toast.success('Poll created successfully!');
      setQuestion(''); setOptions(['', '']);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create poll');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create Poll</h1>
        <p className="text-muted-foreground text-sm mt-1">Create polls for staff to vote on</p>
      </div>

      <Card className="glass-card">
        <CardContent className="p-6">
          <form onSubmit={handleCreate} className="space-y-5">
            <div className="space-y-2">
              <Label>Question</Label>
              <Input placeholder="What would you like to ask?" value={question} onChange={(e) => setQuestion(e.target.value)} required className="bg-background/50" />
            </div>
            <div className="space-y-3">
              <Label>Options</Label>
              {options.map((opt, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
                  <Input placeholder={`Option ${idx + 1}`} value={opt} onChange={(e) => updateOption(idx, e.target.value)} className="bg-background/50" />
                  {options.length > 2 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeOption(idx)} className="text-destructive hover:text-destructive/80">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </motion.div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addOption} className="w-full border-dashed">
                <Plus className="w-3 h-3 mr-2" /> Add Option
              </Button>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><VoteIcon className="w-4 h-4 mr-2" /> Create Poll</>}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
