import React, { useState } from 'react';
import { useSettings, type PricingPlan } from '@/context/SettingsContext';
import { 
  DollarSign, Plus, Trash2, Edit3, 
  Check, X, RefreshCw, 
  Eye, EyeOff, GripVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogFooter 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const PricingEditor: React.FC = () => {
  const { pricing: plans, updatePricingPlan, addPricingPlan, deletePricingPlan, isLoading } = useSettings();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<Partial<PricingPlan>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [featureInput, setFeatureInput] = useState('');

  const handleSave = async () => {
    if (!currentPlan.name || !currentPlan.price) {
      toast.error("Name and Price are required");
      return;
    }

    setIsSaving(true);
    try {
      const data = {
        name: currentPlan.name,
        price: currentPlan.price,
        description: currentPlan.description || '',
        features: currentPlan.features || [],
        cta_text: currentPlan.cta_text || '',
        cta_url: currentPlan.cta_url || '',
        popular: currentPlan.popular || false,
        visible: currentPlan.visible ?? true,
        display_order: currentPlan.display_order ?? plans.length,
        is_custom: currentPlan.is_custom || false,
        questions: currentPlan.questions || []
      };

      if (currentPlan.id) {
        await updatePricingPlan(currentPlan.id, data);
        toast.success("Plan updated");
      } else {
        await addPricingPlan(data);
        toast.success("New pricing plan added");
      }
      setModalOpen(false);
    } catch (err) {
      toast.error("Failed to save plan");
    } finally {
      setIsSaving(false);
    }
  };

  const addFeature = () => {
    if (!featureInput.trim()) return;
    setCurrentPlan({
      ...currentPlan,
      features: [...(currentPlan.features || []), featureInput.trim()]
    });
    setFeatureInput('');
  };

  const removeFeature = (index: number) => {
    const next = [...(currentPlan.features || [])];
    next.splice(index, 1);
    setCurrentPlan({ ...currentPlan, features: next });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-[#6B7A8D]">
        <RefreshCw className="w-8 h-8 text-[#00D4FF] animate-spin" />
        <p className="font-serif italic text-sm">Quantizing value propositions...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700 pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#111820] p-10 rounded-3xl border border-white/5 relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-64 h-64 bg-[#00E5A0]/5 blur-3xl rounded-full" />
         <div className="relative z-10 flex items-center gap-6">
            <div className="w-16 h-16 bg-[#00E5A0]/10 rounded-2xl flex items-center justify-center border border-[#00E5A0]/20">
              <DollarSign className="w-8 h-8 text-[#00E5A0]" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-white tracking-tight">Monetary Architecture</h2>
              <p className="text-xs text-[#6B7A8D] font-bold uppercase tracking-widest mt-1">Manage Pricing Plans & Service Packages</p>
            </div>
         </div>
         <Button 
           onClick={() => { setCurrentPlan({ features: [], visible: true, popular: false }); setModalOpen(true); }}
           className="bg-[#00E5A0] hover:bg-[#00E5A0]/90 text-black font-bold h-12 px-8 rounded-2xl relative z-10"
         >
           <Plus className="w-5 h-5 mr-2" />
           Add New Plan
         </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {plans.map((plan, idx) => (
            <motion.div
              layout
              key={plan.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.05 }}
              className="relative"
            >
              <Card className={cn(
                "bg-[#111820] border-white/5 h-full transition-all duration-500 hover:border-white/20 group relative overflow-hidden",
                plan.popular && "ring-2 ring-[#00E5A0]/30 shadow-[0_0_40px_rgba(0,229,160,0.1)]"
              )}>
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-[#00E5A0] text-black text-[9px] font-bold px-4 py-1 rounded-bl-xl z-20">
                    POPULAR
                  </div>
                )}
                
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <Badge variant="outline" className={cn(
                      "text-[9px] font-bold",
                      plan.visible ? "text-[#00E5A0] border-[#00E5A0]/20 bg-[#00E5A0]/5" : "text-[#FF5757] border-[#FF5757]/20 bg-[#FF5757]/5"
                    )}>
                      {plan.visible ? 'ACTIVE' : 'INACTIVE'}
                    </Badge>
                  </div>

                  <h3 className="text-2xl font-serif font-black text-white mb-2">{plan.name}</h3>
                  <div className="text-3xl font-serif font-bold text-[#00E5A0] mb-4">
                    {plan.price}
                  </div>
                  <p className="text-xs text-[#6B7A8D] mb-8 leading-relaxed line-clamp-2 italic">
                    {plan.description || "No description provided."}
                  </p>

                  <div className="space-y-3 mb-10 flex-1">
                    {plan.features.slice(0, 4).map((f, i) => (
                      <div key={i} className="flex items-center gap-3 text-[11px] text-white/50">
                        <Check className="w-3 h-3 text-[#00E5A0]" />
                        {f}
                      </div>
                    ))}
                    {plan.features.length > 4 && (
                      <p className="text-[10px] text-[#00E5A0]/60 font-medium pl-6">+{plan.features.length - 4} more features</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => { setCurrentPlan(plan); setModalOpen(true); }}
                      className="text-xs text-[#6B7A8D] hover:text-white"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Refine
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deletePricingPlan(plan.id)}
                      className="text-xs text-[#6B7A8D] hover:text-[#FF5757]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-[#111820] border-white/10 text-white max-w-3xl rounded-[40px] p-10 max-h-[90vh] overflow-y-auto scrollbar-hide">
          <DialogHeader>
            <DialogTitle className="text-3xl font-serif font-bold tracking-tight">
              {currentPlan.id ? 'Refine Pricing Strategy' : 'Create Package Model'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-[#6B7A8D] uppercase tracking-widest ml-1">Plan Name</Label>
                <Input 
                  value={currentPlan.name || ''} 
                  onChange={e => setCurrentPlan({ ...currentPlan, name: e.target.value })}
                  className="bg-[#1A2332] border-white/5 h-12 rounded-xl"
                  placeholder="e.g. Cinematic Core"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-[#6B7A8D] uppercase tracking-widest ml-1">Price Tag</Label>
                <Input 
                  value={currentPlan.price || ''} 
                  onChange={e => setCurrentPlan({ ...currentPlan, price: e.target.value })}
                  className="bg-[#1A2332] border-white/5 h-12 rounded-xl text-[#00E5A0] font-bold"
                  placeholder="e.g. $999 / Project"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-[#6B7A8D] uppercase tracking-widest ml-1">Plan Description</Label>
                <Textarea 
                  value={currentPlan.description || ''} 
                  onChange={e => setCurrentPlan({ ...currentPlan, description: e.target.value })}
                  className="bg-[#1A2332] border-white/5 rounded-2xl resize-none italic"
                  rows={2}
                  placeholder="Briefly describe the value..."
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-white">Popular Choice</p>
                  <p className="text-[9px] text-[#6B7A8D]">Highlight this plan with a glow</p>
                </div>
                <Switch 
                  checked={currentPlan.popular || false} 
                  onCheckedChange={val => setCurrentPlan({ ...currentPlan, popular: val })}
                  className="data-[state=checked]:bg-[#00E5A0]"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-[10px] font-bold text-[#6B7A8D] uppercase tracking-widest ml-1">Features Ecosystem</Label>
                <div className="flex gap-2">
                  <Input 
                    value={featureInput}
                    onChange={e => setFeatureInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && addFeature()}
                    className="bg-[#1A2332] border-white/5 h-10 rounded-xl text-xs"
                    placeholder="Add a capability..."
                  />
                  <Button size="icon" onClick={addFeature} className="bg-[#1A2332] hover:bg-white/10 shrink-0 h-10 w-10">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2 max-h-[180px] overflow-y-auto pr-2">
                  <AnimatePresence>
                    {(currentPlan.features || []).map((f, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        key={i} 
                        className="flex items-center justify-between p-2.5 bg-white/5 rounded-lg border border-white/5 text-[10px]"
                      >
                        <span className="truncate pr-4">{f}</span>
                        <button onClick={() => removeFeature(i)} className="text-[#FF5757] hover:scale-125 transition-transform">
                          <X className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-3 pt-6 border-t border-white/5">
            <Button variant="ghost" onClick={() => setModalOpen(false)} className="text-[#6B7A8D] hover:text-white font-bold uppercase text-[10px] tracking-widest">
              Retract
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="bg-[#00E5A0] hover:bg-[#00E5A0]/90 text-black font-bold h-12 px-10 rounded-2xl"
            >
              {isSaving ? 'Encrypting...' : 'Save Package'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PricingEditor;
