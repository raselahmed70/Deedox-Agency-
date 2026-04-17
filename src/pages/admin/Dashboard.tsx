import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, Image as ImageIcon, 
  DollarSign, Star, ExternalLink, RefreshCw, 
  Sparkles, Settings2, Bot, Inbox, ArrowRight 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '@/context/SettingsContext';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { messages, projects, pricing, testimonials, isLoading } = useSettings();
  const [iframeKey, setIframeKey] = useState(0);

  const stats = {
    messages: messages.filter(m => m.status === 'new').length,
    portfolio: projects.length,
    pricing: pricing.filter(p => p.visible).length,
    testimonials: testimonials.filter(t => t.visible).length
  };

  const recentMessages = messages.slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-[#6B7A8D]">
        <RefreshCw className="w-8 h-8 text-[#00D4FF] animate-spin" />
        <p className="font-serif italic text-sm">Synchronizing dashboard intelligence...</p>
      </div>
    );
  }

  const statCards = [
    { label: 'New Messages', value: stats.messages, icon: MessageSquare, color: 'text-[#00D4FF]', bg: 'bg-[#00D4FF]/10', border: 'border-[#00D4FF]/20' },
    { label: 'Portfolio Items', value: stats.portfolio, icon: ImageIcon, color: 'text-[#7B5EA7]', bg: 'bg-[#7B5EA7]/10', border: 'border-[#7B5EA7]/20' },
    { label: 'Active Plans', value: stats.pricing, icon: DollarSign, color: 'text-[#00E5A0]', bg: 'bg-[#00E5A0]/10', border: 'border-[#00E5A0]/20' },
    { label: 'Testimonials', value: stats.testimonials, icon: Star, color: 'text-[#FFB830]', bg: 'bg-[#FFB830]/10', border: 'border-[#FFB830]/20' },
  ];

  return (
    <div className="space-y-10">
      {/* 📊 Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className={cn("overflow-hidden bg-[#111820] border-white/5 group hover:border-white/10 transition-all duration-500", stat.border)}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={cn("p-2.5 rounded-xl", stat.bg)}>
                    <stat.icon className={cn("w-5 h-5", stat.color)} />
                  </div>
                  <Badge variant="outline" className="text-[10px] font-bold border-white/5 opacity-40">LIVE SYNC</Badge>
                </div>
                <h3 className={cn("text-4xl font-serif font-bold mb-1 tracking-tighter", stat.color)}>
                  {stat.value}
                </h3>
                <p className="text-xs text-[#6B7A8D] font-bold uppercase tracking-widest">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* ✉️ Recent Messages Section */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#00D4FF]" />
              Recent Messages
            </h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/inbox')} className="text-xs text-[#00D4FF] hover:text-[#00D4FF] hover:bg-[#00D4FF]/10 font-bold uppercase tracking-widest">
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {recentMessages.length === 0 ? (
              <div className="p-12 text-center bg-[#111820] rounded-2xl border border-white/5 border-dashed">
                <p className="text-[#6B7A8D] font-serif italic italic text-sm">Waiting for new transmissions...</p>
              </div>
            ) : (
              recentMessages.map((msg, idx) => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-5 bg-[#111820] border border-white/5 rounded-2xl flex items-center justify-between hover:bg-[#1A2332] transition-colors group cursor-pointer"
                  onClick={() => navigate('/inbox')}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-serif text-[#00D4FF] font-bold">
                      {msg.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-tight">{msg.name}</h4>
                      <p className="text-[11px] text-[#6B7A8D]">{msg.business_type} · {format(new Date(msg.created_at), 'MMM dd, p')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={cn(
                      "text-[10px] font-bold uppercase",
                      msg.status === 'new' ? "bg-[#00D4FF]/20 text-[#00D4FF] border-[#00D4FF]/30" : "bg-white/5 text-white/40 border-white/5"
                    )}>
                      {msg.status}
                    </Badge>
                    <ArrowRight className="w-4 h-4 text-white/0 group-hover:text-[#00D4FF] group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* 📱 Live Preview Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-[#7B5EA7]" />
              Live Site Preview
            </h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIframeKey(k => k + 1)} 
              className="text-[#6B7A8D] hover:text-white"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="relative aspect-[9/10] bg-[#111820] rounded-3xl border border-white/5 overflow-hidden group">
            <iframe 
              key={iframeKey}
              src="https://deedox.xo.je" 
              className="w-full h-full border-none opacity-80"
              title="Deedox Agency Preview"
              sandbox="allow-scripts allow-same-origin"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111820] via-transparent to-transparent pointer-events-none" />
            <a 
              href="https://deedox.xo.je" 
              target="_blank" 
              className="absolute bottom-6 right-6 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:scale-110 transition-transform shadow-2xl"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* ⚡ Quick Actions */}
      <div className="space-y-6 pt-4">
        <h3 className="text-xs font-bold text-[#6B7A8D] uppercase tracking-[6px] text-center">Quick Access Universe</h3>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {[
            { to: '/admin/hero', label: 'Edit Hero', icon: Sparkles },
            { to: '/admin/portfolio', label: 'Portfolio', icon: ImageIcon },
            { to: '/admin/pricing', label: 'Pricing Plans', icon: DollarSign },
            { to: '/admin/inbox', label: 'View Inbox', icon: Inbox },
            { to: '/admin/ai', label: 'AI Chat Ops', icon: Bot },
          ].map((action) => (
            <button
              key={action.to}
              onClick={() => navigate(action.to)}
              className="px-6 py-4 bg-[#111820] border border-white/5 rounded-2xl flex items-center gap-3 hover:border-[#00D4FF]/50 hover:bg-[#1A2332] transition-all group"
            >
              <action.icon className="w-5 h-5 text-[#6B7A8D] group-hover:text-[#00D4FF] transition-colors" />
              <span className="text-sm font-serif font-bold text-white/60 group-hover:text-white">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
