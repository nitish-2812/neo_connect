'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Users, Search, Shield, UserCheck, UserX } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import api from '@/lib/api';

const roleColors = {
  staff: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  secretariat: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'case-manager': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  admin: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/users');
      setUsers(res.data.users || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/auth/users/${userId}/role`, { role: newRole });
      toast.success('Role updated!');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      await api.put(`/auth/users/${userId}/status`);
      toast.success('User status toggled!');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to toggle status');
    }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2"><Users className="w-6 h-6 text-primary" /> Manage Users</h1>
        <p className="text-muted-foreground text-sm mt-1">View, edit roles, and manage user accounts</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search by name, email, or role..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-background/50" />
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading users...</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((u, i) => (
            <motion.div key={u._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card className="glass-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-sm">{u.name}</h3>
                        <Badge variant="outline" className={`text-[10px] ${roleColors[u.role] || ''}`}>{u.role}</Badge>
                        {!u.isActive && <Badge variant="outline" className="text-[10px] bg-red-500/10 text-red-400 border-red-500/20">Disabled</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{u.email} · {u.department || 'N/A'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select defaultValue={u.role} onValueChange={(val) => handleRoleChange(u._id, val)}>
                        <SelectTrigger className="w-36 h-8 text-xs bg-background/50"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="staff">Staff</SelectItem>
                          <SelectItem value="secretariat">Secretariat</SelectItem>
                          <SelectItem value="case-manager">Case Manager</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button size="sm" variant="outline" onClick={() => handleToggleStatus(u._id)} className={u.isActive ? 'text-red-400 hover:text-red-300' : 'text-emerald-400 hover:text-emerald-300'}>
                        {u.isActive ? <><UserX className="w-3 h-3 mr-1" /> Disable</> : <><UserCheck className="w-3 h-3 mr-1" /> Enable</>}
                      </Button>
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
