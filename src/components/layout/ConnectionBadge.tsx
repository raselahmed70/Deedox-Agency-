import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { RefreshCw } from 'lucide-react';

const ConnectionBadge: React.FC = () => {
  const [status, setStatus] = useState<'testing' | 'connected' | 'error'>('testing');

  const checkConnection = async () => {
    setStatus('testing');
    try {
      // Small query to test connection
      const { error } = await supabase.from('deedox_settings').select('site_title').limit(1);
      if (error) throw error;
      setStatus('connected');
    } catch (err) {
      console.error('Supabase connection error:', err);
      setStatus('error');
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="flex items-center justify-between px-3 py-2 bg-white/5 rounded-xl border border-white/5">
      <div className="flex items-center gap-2">
        <div className={cn(
          "w-2 h-2 rounded-full",
          status === 'testing' && "bg-yellow-500 animate-pulse",
          status === 'connected' && "bg-emerald-500",
          status === 'error' && "bg-red-500"
        )} />
        <span className="text-[10px] font-bold text-[#6B7A8D] uppercase tracking-wider">
          {status === 'testing' && 'Checking...'}
          {status === 'connected' && 'Real-time active'}
          {status === 'error' && 'Connection Error'}
        </span>
      </div>
      
      {status === 'error' && (
        <button 
          onClick={checkConnection}
          className="p-1 hover:bg-white/10 rounded-md transition-colors text-[#6B7A8D] hover:text-[#00D4FF]"
        >
          <RefreshCw className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};

export default ConnectionBadge;
