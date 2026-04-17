import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, Lock, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    
    try {
      // Fetch admin credentials from settings
      const { data, error: fetchError } = await useAuthStore.getState().isAuthenticated 
        ? { data: null, error: null } // Already auth
        : await (await import('@/lib/supabase')).supabase
            .from('deedox_settings')
            .select('admin_username, admin_password')
            .single();

      const validUser = data?.admin_username || 'admin';
      const validPass = data?.admin_password || 'deedox2025';

      if (username === validUser && password === validPass) {
        login(true);
        navigate('/deedoxadmin');
      } else {
        throw new Error('Invalid');
      }
    } catch (err) {
      setError(true);
      setTimeout(() => setError(false), 2000);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050A0E] flex items-center justify-center relative overflow-hidden font-sans">
      {/* 🔮 Aurora Orbs */}
      <motion.div 
        animate={{ 
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#00D4FF]/10 blur-[120px] rounded-full pointer-events-none"
      />
      <motion.div 
        animate={{ 
          x: [0, -40, 0],
          y: [0, -60, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#7B5EA7]/10 blur-[120px] rounded-full pointer-events-none"
      />

      {/* 🛡️ Login Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px] bg-[#111820] border border-white/5 rounded-3xl p-10 relative z-10 shadow-2xl backdrop-blur-sm"
      >
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl font-serif font-black text-white tracking-tighter">
            Deedox<span className="text-base align-top relative top-[-6px]">®</span>
          </h1>
          <p className="text-xs text-[#6B7A8D] font-bold tracking-[6px] uppercase mt-2">
            Admin Panel
          </p>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#6B7A8D] uppercase tracking-widest px-1">
                Admin Username
              </label>
              <Input 
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={cn(
                  "bg-[#1A2332] border-white/10 h-12 rounded-xl focus:ring-[#00D4FF]/20 focus:border-[#00D4FF]/50 transition-all text-white",
                  error && "border-red-500/50 bg-red-500/5"
                )}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#6B7A8D] uppercase tracking-widest px-1">
                Secret Key
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Lock className={cn(
                    "w-4 h-4 transition-colors",
                    error ? "text-red-500" : "text-[#6B7A8D] group-focus-within:text-[#00D4FF]"
                  )} />
                </div>
                <Input 
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn(
                    "pl-12 bg-[#1A2332] border-white/10 h-12 rounded-xl focus:ring-[#00D4FF]/20 focus:border-[#00D4FF]/50 transition-all text-white",
                    error && "border-red-500/50 bg-red-500/5"
                  )}
                />
              </div>
            </div>
            {error && (
              <p className="text-red-500 text-[11px] px-1 animate-pulse font-medium">
                Authentication failed. Invalid credentials.
              </p>
            )}
          </div>

          <Button 
            type="submit"
            disabled={isVerifying}
            className="w-full h-12 bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-black font-serif font-bold text-base rounded-xl transition-all shadow-lg hover:shadow-[#00D4FF]/20 hover:scale-[1.02] disabled:opacity-50"
          >
            {isVerifying ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Enter Panel</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2 text-[#6B7A8D]">
          <Sparkles className="w-3 h-3" />
          <span className="text-[10px] font-medium uppercase tracking-[3px]">Secure Environment</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
