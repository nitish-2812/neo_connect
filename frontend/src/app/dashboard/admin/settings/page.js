'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Lock, Shield, Key, Server, Save, RotateCcw, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import api from '@/lib/api';

const defaults = {
  minPasswordLength: 6,
  saltRounds: 10,
  jwtExpiry: '24h',
  maxLoginAttempts: 5,
  sessionTimeout: 60,
  corsEnabled: true,
  rateLimitEnabled: false,
  rateLimitRequests: 100,
  rateLimitWindow: 15,
  enforceStrongPassword: false,
  twoFactorAuth: false,
};

export default function SecuritySettings() {
  const [config, setConfig] = useState(defaults);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        const s = res.data.settings;
        setConfig({
          minPasswordLength: s.minPasswordLength ?? defaults.minPasswordLength,
          saltRounds: s.saltRounds ?? defaults.saltRounds,
          jwtExpiry: s.jwtExpiry ?? defaults.jwtExpiry,
          maxLoginAttempts: s.maxLoginAttempts ?? defaults.maxLoginAttempts,
          sessionTimeout: s.sessionTimeout ?? defaults.sessionTimeout,
          corsEnabled: s.corsEnabled ?? defaults.corsEnabled,
          rateLimitEnabled: s.rateLimitEnabled ?? defaults.rateLimitEnabled,
          rateLimitRequests: s.rateLimitRequests ?? defaults.rateLimitRequests,
          rateLimitWindow: s.rateLimitWindow ?? defaults.rateLimitWindow,
          enforceStrongPassword: s.enforceStrongPassword ?? defaults.enforceStrongPassword,
          twoFactorAuth: s.twoFactorAuth ?? defaults.twoFactorAuth,
        });
      } catch (e) {
        console.error('Failed to load settings:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleToggle = (key) => {
    setConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/settings', config);
      toast.success('Security settings saved successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setConfig(defaults);
    try {
      await api.put('/settings', defaults);
      toast.info('Settings reset to defaults.');
    } catch (err) {
      toast.error('Failed to reset settings');
    }
  };

  const Toggle = ({ checked, onChange }) => (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-white/10'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2"><Settings className="w-6 h-6 text-primary" /> Security Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">Configure system security policies</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleReset} className="gap-1.5 bg-white/5 border-white/10 hover:bg-white/10">
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5">
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Password Policy */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Lock className="w-4 h-4 text-primary" />
              </div>
              Password Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Minimum Password Length</Label>
                <p className="text-xs text-muted-foreground">Set the minimum number of characters required</p>
              </div>
              <Input
                type="number"
                min={4}
                max={32}
                value={config.minPasswordLength}
                onChange={(e) => handleChange('minPasswordLength', parseInt(e.target.value) || 6)}
                className="w-20 h-9 bg-white/5 border-white/10 text-center text-sm"
              />
            </div>
            <div className="border-t border-white/5" />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Bcrypt Salt Rounds</Label>
                <p className="text-xs text-muted-foreground">Higher = more secure but slower hashing</p>
              </div>
              <Input
                type="number"
                min={4}
                max={16}
                value={config.saltRounds}
                onChange={(e) => handleChange('saltRounds', parseInt(e.target.value) || 10)}
                className="w-20 h-9 bg-white/5 border-white/10 text-center text-sm"
              />
            </div>
            <div className="border-t border-white/5" />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Enforce Strong Passwords</Label>
                <p className="text-xs text-muted-foreground">Require uppercase, lowercase, number & special char</p>
              </div>
              <Toggle checked={config.enforceStrongPassword} onChange={() => handleToggle('enforceStrongPassword')} />
            </div>
            <div className="border-t border-white/5" />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Max Login Attempts</Label>
                <p className="text-xs text-muted-foreground">Lock account after N failed attempts</p>
              </div>
              <Input
                type="number"
                min={1}
                max={20}
                value={config.maxLoginAttempts}
                onChange={(e) => handleChange('maxLoginAttempts', parseInt(e.target.value) || 5)}
                className="w-20 h-9 bg-white/5 border-white/10 text-center text-sm"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* JWT & Sessions */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Key className="w-4 h-4 text-primary" />
              </div>
              Authentication & Sessions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">JWT Token Expiry</Label>
                <p className="text-xs text-muted-foreground">How long tokens remain valid</p>
              </div>
              <select
                value={config.jwtExpiry}
                onChange={(e) => handleChange('jwtExpiry', e.target.value)}
                className="h-9 px-3 bg-white/5 border border-white/10 rounded-md text-sm text-white appearance-none cursor-pointer"
              >
                <option value="1h" className="text-black">1 hour</option>
                <option value="6h" className="text-black">6 hours</option>
                <option value="12h" className="text-black">12 hours</option>
                <option value="24h" className="text-black">24 hours</option>
                <option value="7d" className="text-black">7 days</option>
              </select>
            </div>
            <div className="border-t border-white/5" />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Session Timeout (minutes)</Label>
                <p className="text-xs text-muted-foreground">Auto-logout after inactivity</p>
              </div>
              <Input
                type="number"
                min={5}
                max={480}
                value={config.sessionTimeout}
                onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value) || 60)}
                className="w-20 h-9 bg-white/5 border-white/10 text-center text-sm"
              />
            </div>
            <div className="border-t border-white/5" />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Two-Factor Authentication</Label>
                <p className="text-xs text-muted-foreground">Require 2FA for admin accounts</p>
              </div>
              <Toggle checked={config.twoFactorAuth} onChange={() => handleToggle('twoFactorAuth')} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* API & Network */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Server className="w-4 h-4 text-primary" />
              </div>
              API & Network Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">CORS Protection</Label>
                <p className="text-xs text-muted-foreground">Block cross-origin requests from unknown domains</p>
              </div>
              <Toggle checked={config.corsEnabled} onChange={() => handleToggle('corsEnabled')} />
            </div>
            <div className="border-t border-white/5" />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Rate Limiting</Label>
                <p className="text-xs text-muted-foreground">Prevent API abuse with request throttling</p>
              </div>
              <Toggle checked={config.rateLimitEnabled} onChange={() => handleToggle('rateLimitEnabled')} />
            </div>
            {config.rateLimitEnabled && (
              <>
                <div className="border-t border-white/5" />
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Max Requests</Label>
                    <p className="text-xs text-muted-foreground">Per window per IP</p>
                  </div>
                  <Input
                    type="number"
                    min={10}
                    max={1000}
                    value={config.rateLimitRequests}
                    onChange={(e) => handleChange('rateLimitRequests', parseInt(e.target.value) || 100)}
                    className="w-20 h-9 bg-white/5 border-white/10 text-center text-sm"
                  />
                </div>
                <div className="border-t border-white/5" />
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Rate Window (minutes)</Label>
                    <p className="text-xs text-muted-foreground">Time window for rate limit count</p>
                  </div>
                  <Input
                    type="number"
                    min={1}
                    max={60}
                    value={config.rateLimitWindow}
                    onChange={(e) => handleChange('rateLimitWindow', parseInt(e.target.value) || 15)}
                    className="w-20 h-9 bg-white/5 border-white/10 text-center text-sm"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Role-Based Access Info */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              Role-Based Access Control
              <Badge variant="outline" className="ml-auto bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">Active</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { role: 'Staff', permissions: 'Submit complaints, vote on polls, track own cases', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
                { role: 'Secretariat', permissions: 'View all cases, assign case managers, create polls', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
                { role: 'Case Manager', permissions: 'Manage assigned cases, add responses, close cases', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
                { role: 'Admin', permissions: 'User management, system config, full access', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
              ].map(r => (
                <div key={r.role} className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <Badge variant="outline" className={`${r.color} text-[10px] mb-2`}>{r.role}</Badge>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{r.permissions}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
