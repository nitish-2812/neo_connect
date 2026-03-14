'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Vote as VoteIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function StaffPolls() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPolls = async () => {
    try {
      const res = await api.get('/polls');
      setPolls(res.data.polls || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPolls();
  }, []);

  const handleVote = async (pollId, optionIndex) => {
    try {
      await api.post(`/polls/${pollId}/vote`, { selectedOption: optionIndex });
      toast.success('Vote recorded!');
      fetchPolls();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to vote');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Polls</h1>
        <p className="text-muted-foreground text-sm mt-1">Vote on active polls and see results</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading polls...</div>
      ) : polls.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <VoteIcon className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No polls available right now.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {polls.map((poll, i) => {
            const hasVoted = poll.userVote !== null && poll.userVote !== undefined;
            const maxVotes = Math.max(...(poll.voteCounts || [1]), 1);

            return (
              <motion.div key={poll._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="glass-card">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{poll.question}</CardTitle>
                      <div className="flex items-center gap-2">
                        {!poll.isActive && <Badge variant="outline" className="text-[10px] text-red-400">Closed</Badge>}
                        <Badge variant="outline" className="text-[10px]">{poll.totalVotes} vote{poll.totalVotes !== 1 ? 's' : ''}</Badge>
                      </div>
                    </div>
                    {poll.createdBy?.name && <p className="text-xs text-muted-foreground">Created by {poll.createdBy.name}</p>}
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {poll.options.map((option, idx) => {
                      const votes = poll.voteCounts?.[idx] || 0;
                      const percentage = poll.totalVotes > 0 ? Math.round((votes / poll.totalVotes) * 100) : 0;
                      const isSelected = poll.userVote === idx;

                      return (
                        <div key={idx} className="relative">
                          {hasVoted ? (
                            <div className={`relative p-3 rounded-lg border transition-all ${isSelected ? 'border-primary/30 bg-primary/5' : 'border-border/30 bg-muted/20'}`}>
                              <div className="absolute inset-0 rounded-lg bg-primary/5" style={{ width: `${percentage}%`, transition: 'width 0.5s ease' }} />
                              <div className="relative flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {isSelected && <CheckCircle2 className="w-4 h-4 text-primary" />}
                                  <span className="text-sm">{option}</span>
                                </div>
                                <span className="text-xs font-medium text-muted-foreground">{percentage}% ({votes})</span>
                              </div>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              className="w-full justify-start text-sm h-auto py-3 bg-muted/20 hover:bg-primary/10 hover:border-primary/30"
                              onClick={() => handleVote(poll._id, idx)}
                              disabled={!poll.isActive}
                            >
                              {option}
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
