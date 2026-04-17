import React, { useState, useEffect } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { 
  Bot, Save, RefreshCw, 
  Sparkles, MessageSquare, 
  Cpu, Zap, Shield, Key,
  Workflow, BrainCircuit, 
  Settings2, Activity, Eye, EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AiConfig {
  id: string;
  assistant_name: string;
  system_prompt: string;
  welcome_message: string;
  model: string;
  api_key: string;
  enabled: boolean;
}

const RECOMMENDED_MODELS = [
  { name: 'OpenRouter Auto (Free)', value: 'openrouter/free' },
  { name: 'Gemini 1.5 Flash (Free)', value: 'google/gemini-flash-1.5-exp:free' },
  { name: 'Mistral 7B (Free)', value: 'mistralai/mistral-7b-instruct:free' },
  { name: 'Gemma 2 9B (Free)', value: 'google/gemma-2-9b-it:free' },
  { name: 'GPT-4o (Paid)', value: 'openai/gpt-4o' },
];

const AiSettings: React.FC = () => {
  const { aiConfig: initialConfig, updateAiConfig, isLoading } = useSettings();
  const [config, setConfig] = useState<Partial<AiConfig>>(initialConfig || {});
  const [saving, setSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    if (initialConfig) setConfig(initialConfig);
  }, [initialConfig]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateAiConfig(config);
      toast.success("AI Neural Matrix Reconfigured");
    } catch (err) {
      toast.error("Neural initialization failure");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-[#6B7A8D]">
        <RefreshCw className="w-8 h-8 text-[#00D4FF] animate-spin" />
        <p className="font-serif italic text-sm">Synchronizing with AI core...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700 pb-32">
       {/* 🚀 Header Area */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#111820] p-8 rounded-[40px] border border-white/5 relative overflow-hidden group">
         <div className="absolute inset-0 bg-gradient-to-r from-[#00D4FF]/5 via-transparent to-[#7B5EA7]/5 pointer-events-none" />
         <div className="relative z-10 flex items-center gap-5">
            <div className="w-16 h-16 bg-[#00D4FF]/10 rounded-3xl flex items-center justify-center border border-[#00D4FF]/20 group-hover:scale-110 transition-transform duration-500">
              <Bot className="w-8 h-8 text-[#00D4FF]" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-black text-white tracking-tighter uppercase tracking-[-1px]">Neural Control</h2>
              <p className="text-xs text-[#6B7A8D] font-bold uppercase tracking-[4px] mt-1">
                Artificial Intelligence Matrix Settings
              </p>
            </div>
         </div>
         <Button 
           onClick={handleSave}
           disabled={saving}
           className="bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-black font-black h-14 px-10 rounded-2xl relative z-10 shadow-xl shadow-[#00D4FF]/10 transition-all active:scale-95"
         >
           {saving ? <RefreshCw className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
           Commit Neural Logic
         </Button>
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 🧠 Core Personality */}
          <div className="lg:col-span-2 space-y-8">
             <Card className="bg-[#111820] border-white/5 p-8 rounded-[40px] space-y-6 relative overflow-hidden">
                <div className="flex items-center gap-3">
                   <BrainCircuit className="w-4 h-4 text-[#00D4FF]" />
                   <h3 className="text-[10px] font-bold text-[#6B7A8D] uppercase tracking-[4px]">Neural Personality</h3>
                </div>

                <div className="space-y-6 relative z-10">
                   <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-[#6B7A8D] uppercase tracking-widest ml-1">Assistant Identifier</Label>
                      <Input 
                        value={config.assistant_name || ''} 
                        onChange={e => setConfig({ ...config, assistant_name: e.target.value })}
                        placeholder="e.g. Deedox AI Elite"
                        className="bg-[#1A2332] border-white/10 h-14 rounded-2xl px-6 text-white font-serif font-bold text-lg focus:border-[#00D4FF]/50 transition-all"
                      />
                   </div>

                   <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-[#6B7A8D] uppercase tracking-widest ml-1 flex items-center justify-between">
                         <span>System Architecture (System Prompt)</span>
                         <Badge variant="outline" className="bg-[#00D4FF]/5 text-[#00D4FF] border-[#00D4FF]/20 text-[8px] tracking-tight">V4.8-STABLE</Badge>
                      </Label>
                      <Textarea 
                        value={config.system_prompt || ''} 
                        onChange={e => setConfig({ ...config, system_prompt: e.target.value })}
                        placeholder="Define the behavior, tone, and knowledge boundaries..."
                        rows={10}
                        className="bg-[#1A2332] border-white/10 rounded-[30px] px-6 py-4 focus:border-[#00D4FF]/50 transition-all font-sans text-sm leading-relaxed text-white/70"
                      />
                   </div>
                </div>
             </Card>

             <Card className="bg-[#111820] border-white/5 p-8 rounded-[40px] space-y-6">
                <div className="flex items-center gap-3">
                   <MessageSquare className="w-4 h-4 text-[#7B5EA7]" />
                   <h3 className="text-[10px] font-bold text-[#6B7A8D] uppercase tracking-[4px]">Initial Handshake</h3>
                </div>
                <div className="space-y-2">
                   <Label className="text-[10px] font-bold text-[#6B7A8D] uppercase tracking-widest ml-1">Welcome Transmission</Label>
                   <Input 
                     value={config.welcome_message || ''} 
                     onChange={e => setConfig({ ...config, welcome_message: e.target.value })}
                     placeholder="Hello! How can Deedox accelerate your vision today?"
                     className="bg-[#1A2332] border-white/10 h-14 rounded-2xl px-6 text-white text-sm focus:border-[#00D4FF]/50 transition-all"
                   />
                </div>
             </Card>
          </div>

          {/* ⚡ API & Hardware Logic */}
          <div className="space-y-8">
             <Card className="bg-[#111820] border-white/5 p-8 rounded-[40px] space-y-6 h-fit">
                <div className="flex items-center gap-3">
                   <Cpu className="w-4 h-4 text-[#00E5A0]" />
                   <h3 className="text-[10px] font-bold text-[#6B7A8D] uppercase tracking-[4px]">Model Engine</h3>
                </div>

                <div className="space-y-6">
                   <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-[#00E5A0]/20 transition-all">
                      <div className="space-y-0.5">
                         <span className="text-[10px] font-bold text-white uppercase tracking-widest">Model Enabled</span>
                         <p className="text-[9px] text-[#6B7A8D] font-medium uppercase tracking-[2px]">Toggle live chat</p>
                      </div>
                      <Switch 
                        checked={config.enabled || false} 
                        onCheckedChange={val => setConfig({ ...config, enabled: val })}
                        className="data-[state=checked]:bg-[#00E5A0]"
                      />
                   </div>

                    <div className="space-y-2">
                       <Label className="text-[10px] font-bold text-[#6B7A8D] uppercase tracking-widest ml-1 flex items-center gap-2">
                         <Workflow className="w-3 h-3" /> Selected Processor
                       </Label>
                       <Select 
                          value={config.model || 'openrouter/free'} 
                          onValueChange={val => setConfig({ ...config, model: val })}
                       >
                          <SelectTrigger className="bg-[#1A2332] border-white/10 h-12 rounded-xl px-4 text-white font-mono text-xs focus:border-[#00E5A0]/50">
                             <SelectValue placeholder="Select Neural Processor" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1A2332] border-white/10 text-white">
                             {RECOMMENDED_MODELS.map(m => (
                                <SelectItem key={m.value} value={m.value} className="focus:bg-[#00E5A0]/20 focus:text-white">
                                   {m.name}
                                </SelectItem>
                             ))}
                             <SelectItem value="custom" className="focus:bg-[#00E5A0]/20 focus:text-white italic">Custom Engine...</SelectItem>
                          </SelectContent>
                       </Select>

                       {config.model === 'custom' && (
                          <Input 
                            placeholder="Enter custom model identifier..."
                            onChange={e => setConfig({ ...config, model: e.target.value })}
                            className="bg-[#1A2332] border-white/10 h-10 rounded-xl px-4 text-white font-mono text-[10px] mt-2"
                          />
                       )}
                    </div>

                   <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-[#6B7A8D] uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Key className="w-3 h-3" /> OpenRouter Shield
                      </Label>
                      <div className="relative group">
                        <Input 
                          type={showApiKey ? "text" : "password"}
                          value={config.api_key || ''} 
                          onChange={e => setConfig({ ...config, api_key: e.target.value })}
                          placeholder="sk-or-v1-..."
                          className="bg-[#1A2332] border-white/10 h-12 rounded-xl px-4 pr-12 text-white font-mono text-xs focus:border-[#00D4FF]/50"
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7A8D] hover:text-[#00D4FF] transition-colors"
                        >
                          {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                   </div>
                </div>
             </Card>

             <Card className="bg-gradient-to-br from-[#111820] to-black border border-white/5 p-8 rounded-[40px] relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-[#00D4FF]/10 to-transparent pointer-events-none" />
                <div className="relative z-10 space-y-4">
                   <div className="flex items-center gap-2 text-[#00D4FF]">
                      <Zap className="w-4 h-4 fill-current animate-pulse" />
                      <span className="text-[9px] font-black uppercase tracking-[4px]">Performance Matrix</span>
                   </div>
                   <div className="flex items-center justify-between py-2 border-b border-white/5">
                      <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Latency</span>
                      <span className="text-[10px] text-white font-mono tracking-tighter">&lt; 140ms</span>
                   </div>
                   <div className="flex items-center justify-between py-2 border-b border-white/5">
                      <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Uptime</span>
                      <span className="text-[10px] text-white font-mono tracking-tighter">99.98%</span>
                   </div>
                   <div className="flex items-center justify-between py-2 border-b border-white/5">
                      <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Model Sync</span>
                      <span className="text-[10px] text-[#00E5A0] font-mono tracking-tighter">Active</span>
                   </div>
                   
                   <Button variant="ghost" className="w-full mt-4 bg-white/5 border border-white/5 rounded-xl text-[10px] font-bold text-white/40 hover:text-white uppercase tracking-widest hover:border-[#00D4FF]/20 group-hover:bg-[#00D4FF]/5">
                      <Activity className="w-3 h-3 mr-2 group-hover:animate-spin" />
                      Trace Neural Path
                   </Button>
                </div>
             </Card>
          </div>
       </div>
    </div>
  );
};

export default AiSettings;
