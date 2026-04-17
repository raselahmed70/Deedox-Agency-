import React, { useState } from 'react';
import { 
  Inbox as InboxIcon, Search, Filter, 
  Trash2, Mail, MailOpen, Clock, 
  User, Building2, MessageSquare, 
  RefreshCw, CheckCircle2, ChevronRight,
  MoreVertical, Archive, ArrowLeft,
  Calendar, Phone, Globe, Quote
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  DropdownMenu, DropdownMenuContent, 
  DropdownMenuItem, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useSettings, type Message } from '@/context/SettingsContext';



const Inbox: React.FC = () => {
  const { messages, updateMessageStatus, deleteMessage, isLoading } = useSettings();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'archived'>('all');

  const handleStatusUpdate = async (id: string, status: Message['status']) => {
    try {
      await updateMessageStatus(id, status);
      toast.info(`Signal status updated to ${status.toUpperCase()}`);
    } catch (err) {
      toast.error("Status adjustment failure");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMessage(id);
      toast.success("Signal purged from archives");
      if (selectedMessage?.id === id) setSelectedMessage(null);
    } catch (err) {
      toast.error("Purge aborted");
    }
  };

  const filteredMessages = messages.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         m.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'new' && m.status === 'new') ||
                         (filterStatus === 'archived' && m.status === 'archived');
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-[#6B7A8D]">
        <RefreshCw className="w-8 h-8 text-[#00D4FF] animate-spin" />
        <p className="font-serif italic text-sm">Decrypting incoming transmissions...</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col lg:flex-row gap-6 animate-in fade-in duration-700">
      
      {/* 📬 Message List Sidebar */}
      <div className={cn(
        "flex-1 lg:flex-[0.4] bg-[#111820] border border-white/5 rounded-[40px] flex flex-col overflow-hidden transition-all duration-500",
        selectedMessage && "hidden lg:flex"
      )}>
        <div className="p-6 border-b border-white/5 space-y-4">
           <div className="flex items-center justify-between">
              <h2 className="text-xl font-serif font-black text-white flex items-center gap-3">
                 <InboxIcon className="w-5 h-5 text-[#00D4FF]" />
                 Inbox 
                 <Badge variant="outline" className="ml-2 bg-[#00D4FF]/10 text-[#00D4FF] border-[#00D4FF]/20 text-[10px] font-bold">
                    {messages.filter(m => m.status === 'new').length} NEW
                 </Badge>
              </h2>
              <div className="flex items-center gap-1">
                 <button 
                   onClick={() => setFilterStatus('all')}
                   className={cn("px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all", filterStatus === 'all' ? "bg-white/10 text-white" : "text-[#6B7A8D] hover:text-white")}
                 >All</button>
                 <button 
                    onClick={() => setFilterStatus('new')}
                    className={cn("px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all", filterStatus === 'new' ? "bg-white/10 text-white" : "text-[#6B7A8D] hover:text-white")}
                 >New</button>
              </div>
           </div>

           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7A8D] group-focus-within:text-[#00D4FF] transition-colors" />
              <Input 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search signals..."
                className="bg-[#1A2332] border-white/5 h-12 rounded-2xl pl-12 text-xs focus:border-[#00D4FF]/30"
              />
           </div>
        </div>

        <ScrollArea className="flex-1">
           <div className="divide-y divide-white/5">
              {filteredMessages.map((msg) => (
                <div 
                  key={msg.id}
                  onClick={() => {
                    setSelectedMessage(msg);
                    if (msg.status === 'new') handleStatusUpdate(msg.id, 'read');
                  }}
                  className={cn(
                    "p-6 cursor-pointer transition-all hover:bg-white/5 border-l-4",
                    selectedMessage?.id === msg.id ? "bg-white/5 border-[#00D4FF]" : "border-transparent",
                    msg.status === 'new' && "bg-[#00D4FF]/5"
                  )}
                >
                   <div className="flex items-center justify-between mb-2">
                       <span className="text-[10px] text-[#6B7A8D] font-bold tracking-widest uppercase">{format(new Date(msg.created_at), 'MMM dd, HH:mm')}</span>
                       {msg.status === 'new' && <div className="w-2 h-2 bg-[#00D4FF] rounded-full animate-pulse shadow-[0_0_10px_#00D4FF]" />}
                   </div>
                   <h4 className="text-sm font-bold text-white mb-1 truncate">{msg.name}</h4>
                   <p className="text-[11px] text-[#6B7A8D] font-medium uppercase tracking-[2px] mb-2">{msg.business_type}</p>
                   <p className="text-xs text-white/40 line-clamp-1 italic">"{msg.message}"</p>
                </div>
              ))}
              {filteredMessages.length === 0 && (
                <div className="p-12 text-center space-y-4">
                   <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto text-[#6B7A8D]">
                      <InboxIcon className="w-6 h-6" />
                   </div>
                   <p className="text-xs text-[#6B7A8D] font-serif italic">The void remains quiet...</p>
                </div>
              )}
           </div>
        </ScrollArea>
      </div>

      {/* 🛡️ Message Detail View */}
      <div className={cn(
        "flex-1 bg-[#111820] border border-white/5 rounded-[40px] flex flex-col overflow-hidden transition-all duration-500 relative",
        !selectedMessage && "hidden lg:flex"
      )}>
        <AnimatePresence mode="wait">
           {selectedMessage ? (
             <motion.div 
               key={selectedMessage.id}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="flex flex-col h-full"
             >
                {/* Detail Header */}
                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-transparent via-white/5 to-transparent">
                   <div className="flex items-center gap-6">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setSelectedMessage(null)}
                        className="lg:hidden w-10 h-10 rounded-xl hover:bg-white/5"
                      >
                         <ArrowLeft className="w-5 h-5" />
                      </Button>
                      <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center font-serif text-3xl font-black text-[#00D4FF]">
                        {selectedMessage.name.charAt(0)}
                      </div>
                      <div>
                        <h2 className="text-2xl font-serif font-black text-white tracking-tight">{selectedMessage.name}</h2>
                        <p className="text-xs text-[#6B7A8D] font-bold uppercase tracking-[4px] mt-1">{selectedMessage.business_type}</p>
                      </div>
                   </div>

                   <div className="flex items-center gap-3">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleStatusUpdate(selectedMessage.id, selectedMessage.status === 'archived' ? 'read' : 'archived')}
                        className={cn("w-11 h-11 rounded-xl border-white/5 transition-colors", selectedMessage.status === 'archived' ? "text-[#FFB830] bg-[#FFB830]/10" : "text-[#6B7A8D] hover:text-white")}
                      >
                         <Archive className="w-5 h-5" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleDelete(selectedMessage.id)}
                        className="w-11 h-11 rounded-xl border-white/5 text-[#6B7A8D] hover:text-[#FF5757] hover:bg-[#FF5757]/10 transition-all"
                      >
                         <Trash2 className="w-5 h-5" />
                      </Button>
                   </div>
                </div>

                <ScrollArea className="flex-1 p-8">
                   <div className="max-w-2xl mx-auto space-y-12 pb-20">
                      
                      {/* Interaction Meta */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <Card className="bg-white/5 border-white/5 p-4 rounded-2xl flex items-center gap-4 group hover:border-[#00D4FF]/20 transition-all">
                            <div className="p-2 bg-white/5 rounded-lg text-[#00D4FF]"><Mail className="w-4 h-4" /></div>
                            <div className="min-w-0 flex-1">
                               <p className="text-[8px] font-bold text-[#6B7A8D] uppercase tracking-widest">Digital Nexus</p>
                               <p className="text-xs text-white truncate">{selectedMessage.email}</p>
                            </div>
                         </Card>
                         <Card className="bg-white/5 border-white/5 p-4 rounded-2xl flex items-center gap-4 group hover:border-[#00D4FF]/20 transition-all">
                            <div className="p-2 bg-white/5 rounded-lg text-[#00D4FF]"><Phone className="w-4 h-4" /></div>
                            <div className="min-w-0 flex-1">
                               <p className="text-[8px] font-bold text-[#6B7A8D] uppercase tracking-widest">Direct Frequency</p>
                               <p className="text-xs text-white truncate">{selectedMessage.phone || 'N/A'}</p>
                            </div>
                         </Card>
                         <Card className="bg-white/5 border-white/5 p-4 rounded-2xl flex items-center gap-4 group hover:border-[#00D4FF]/20 transition-all">
                            <div className="p-2 bg-white/5 rounded-lg text-[#00D4FF]"><Calendar className="w-4 h-4" /></div>
                            <div className="min-w-0 flex-1">
                               <p className="text-[8px] font-bold text-[#6B7A8D] uppercase tracking-widest">Transmission Time</p>
                               <p className="text-xs text-white truncate">{format(new Date(selectedMessage.created_at), 'PPPP · p')}</p>
                            </div>
                         </Card>
                         <Card className="bg-white/5 border-white/5 p-4 rounded-2xl flex items-center gap-4 group hover:border-[#00D4FF]/20 transition-all">
                            <div className="p-2 bg-white/5 rounded-lg text-[#00D4FF]"><Globe className="w-4 h-4" /></div>
                            <div className="min-w-0 flex-1">
                               <p className="text-[8px] font-bold text-[#6B7A8D] uppercase tracking-widest">Origin Node</p>
                               <p className="text-xs text-white truncate">Public Landing Interface</p>
                            </div>
                         </Card>
                      </div>

                      {/* The Message Body */}
                      <div className="space-y-6">
                         <div className="flex items-center gap-3 text-[#6B7A8D]">
                            <MessageSquare className="w-5 h-5" />
                            <span className="text-xs font-bold uppercase tracking-[4px]">Decrypted Message Content</span>
                         </div>
                         <div className="bg-[#1A2332] border border-white/10 rounded-[40px] p-10 relative overflow-hidden group">
                             <Quote className="absolute top-8 right-8 w-24 h-24 text-white/5 pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
                             <p className="text-lg font-serif italic text-white/90 leading-relaxed relative z-10 whitespace-pre-wrap">
                                {selectedMessage.message}
                             </p>
                         </div>
                      </div>

                      <div className="flex items-center justify-center pt-8">
                         <Button className="bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-black font-black h-12 px-10 rounded-2xl shadow-xl shadow-[#00D4FF]/20 group">
                            <span>Respond to Lead</span>
                            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                         </Button>
                      </div>
                   </div>
                </ScrollArea>
             </motion.div>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-center p-12 overflow-hidden">
                <div className="relative mb-8">
                   <div className="absolute inset-0 bg-[#00D4FF]/20 blur-[60px] rounded-full animate-pulse" />
                   <div className="w-24 h-24 bg-[#111820] border border-white/10 rounded-[40px] flex items-center justify-center relative z-10">
                      <InboxIcon className="w-10 h-10 text-white/20" />
                   </div>
                </div>
                <h3 className="text-2xl font-serif font-black text-white mb-2 tracking-tight">No Signal Selected</h3>
                <p className="text-[11px] text-[#6B7A8D] font-bold uppercase tracking-[6px]">Select a transmission to decrypt its contents</p>
                
                {/* Visual Flair */}
                <div className="absolute bottom-10 left-0 right-0 flex items-center justify-center gap-2 opacity-20 pointer-events-none">
                   {[...Array(20)].map((_, i) => (
                     <div key={i} className="w-0.5 bg-[#00D4FF] rounded-full" style={{ height: `${Math.random() * 40 + 10}px`, opacity: Math.random() }} />
                   ))}
                </div>
             </div>
           )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Inbox;
