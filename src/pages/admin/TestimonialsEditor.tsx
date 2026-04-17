import React, { useState } from 'react';
import { useSettings, type Testimonial } from '@/context/SettingsContext';
import { ImageSelector } from '@/components/admin/ImageSelector';
import { 
  Star, Plus, Trash2, Edit3, 
  RefreshCw, MessageSquareQuote, Quote
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogFooter 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const TestimonialsEditor: React.FC = () => {
  const { testimonials, updateTestimonial, addTestimonial, deleteTestimonial, isLoading } = useSettings();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<Partial<Testimonial>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!currentTestimonial.name || !currentTestimonial.role || !currentTestimonial.content) {
      toast.error("Please fill in the required fields");
      return;
    }

    setIsSaving(true);
    try {
      const data = {
        name: currentTestimonial.name,
        role: currentTestimonial.role,
        content: currentTestimonial.content,
        avatar: currentTestimonial.avatar || '',
        stars: currentTestimonial.stars || 5,
        visible: currentTestimonial.visible ?? true
      };

      if (currentTestimonial.id) {
        await updateTestimonial(currentTestimonial.id, data);
        toast.success("Testimonial updated");
      } else {
        await addTestimonial(data);
        toast.success("New testimonial added");
      }
      setModalOpen(false);
    } catch (err) {
      toast.error("Failed to save testimonial");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      await deleteTestimonial(id);
      toast.success("Testimonial deleted");
    } catch (err) {
      toast.error("Failed to delete testimonial");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-[#6B7A8D]">
        <RefreshCw className="w-8 h-8 text-[#00D4FF] animate-spin" />
        <p className="font-serif italic text-sm">Gathering social frequency...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700 pb-32">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#111820] p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E5A0]/5 blur-3xl rounded-full" />
         <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 bg-[#00E5A0]/10 rounded-2xl flex items-center justify-center border border-[#00E5A0]/20">
              <MessageSquareQuote className="w-7 h-7 text-[#00E5A0]" />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-bold text-white tracking-tight">Social Convergence</h2>
              <p className="text-xs text-[#6B7A8D] font-bold uppercase tracking-widest mt-1">
                {testimonials.length} Endorsements Transmitted
              </p>
            </div>
         </div>
         <Button 
           onClick={() => { setCurrentTestimonial({ stars: 5, visible: true }); setModalOpen(true); }}
           className="bg-[#00E5A0] hover:bg-[#00E5A0]/90 text-black font-bold h-12 px-8 rounded-2xl relative z-10"
         >
           <Plus className="w-5 h-5 mr-2" />
           Add New Endorsement
         </Button>
      </div>

      {/* Testimonials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {testimonials.map((test, idx) => (
            <motion.div
              layout
              key={test.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="bg-[#111820] border-white/5 hover:border-white/10 transition-all duration-300 h-full relative group">
                <CardContent className="p-8 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                     <div className="flex text-[#FFB830]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={cn("w-3.5 h-3.5 fill-current", i >= test.stars && "text-white/10 fill-none")} />
                        ))}
                     </div>
                     <Badge variant="outline" className={cn(
                       "text-[9px] font-bold",
                       test.visible ? "text-[#00E5A0] border-[#00E5A0]/20 bg-[#00E5A0]/5" : "text-[#FF5757] border-[#FF5757]/20 bg-[#FF5757]/5"
                     )}>
                       {test.visible ? 'SYNCED' : 'OFFLINE'}
                     </Badge>
                  </div>

                  <div className="relative mb-8 flex-1">
                     <Quote className="absolute top-[-10px] left-[-10px] w-8 h-8 text-white/5 pointer-events-none" />
                     <p className="text-sm text-white/60 font-serif leading-relaxed line-clamp-4 relative z-10 italic">"{test.content}"</p>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                     <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 border border-white/10">
                          <AvatarImage src={test.avatar} />
                          <AvatarFallback className="bg-[#1A2332] text-[10px] text-white/40">UX</AvatarFallback>
                        </Avatar>
                        <div>
                           <h4 className="text-sm font-bold text-white truncate">{test.name}</h4>
                           <p className="text-[10px] text-[#6B7A8D] font-medium tracking-wider uppercase">{test.role}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => { setCurrentTestimonial(test); setModalOpen(true); }}
                          className="w-9 h-9 text-[#6B7A8D] hover:text-white"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(test.id)}
                          className="w-9 h-9 text-[#6B7A8D] hover:text-[#FF5757]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                     </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {testimonials.length === 0 && (
          <div className="col-span-full py-20 text-center bg-[#111820] rounded-[40px] border border-white/5 border-dashed">
            <Quote className="w-16 h-16 text-white/5 mb-6 mx-auto" />
            <h3 className="text-xl font-serif font-bold text-white mb-2">No Endorsements Found</h3>
            <p className="text-[#6B7A8D] font-sans text-sm">Add some client testimonials to show proof of work.</p>
          </div>
        )}
      </div>

      {/* Testimonial Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-[#111820] border-white/10 text-white max-w-2xl rounded-3xl p-8 max-h-[90vh] overflow-y-auto scrollbar-hide">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif font-bold tracking-tight">
              {currentTestimonial.id ? 'Refine Endorsement' : 'Initiate Social Proof'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <ImageSelector
                 label="Client Avatar"
                 value={currentTestimonial.avatar}
                 onChange={(url) => setCurrentTestimonial({ ...currentTestimonial, avatar: url })}
                 folder="avatars"
                 onClear={() => setCurrentTestimonial({ ...currentTestimonial, avatar: '' })}
               />
               
               <div className="space-y-4">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold text-[#6B7A8D] uppercase tracking-widest ml-1">Client Name</Label>
                    <Input 
                      value={currentTestimonial.name || ''} 
                      onChange={e => setCurrentTestimonial({ ...currentTestimonial, name: e.target.value })}
                      className="bg-[#1A2332] border-white/5 h-12 rounded-xl"
                      placeholder="e.g. Sarah Johnson"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold text-[#6B7A8D] uppercase tracking-widest ml-1">Role / Company</Label>
                    <Input 
                      value={currentTestimonial.role || ''} 
                      onChange={e => setCurrentTestimonial({ ...currentTestimonial, role: e.target.value })}
                      className="bg-[#1A2332] border-white/5 h-12 rounded-xl"
                      placeholder="e.g. CEO of TechScale"
                    />
                  </div>
               </div>
            </div>

            <div className="space-y-1">
              <Label className="text-[10px] font-bold text-[#6B7A8D] uppercase tracking-widest ml-1">Testimonial Content</Label>
              <Textarea 
                value={currentTestimonial.content || ''} 
                onChange={e => setCurrentTestimonial({ ...currentTestimonial, content: e.target.value })}
                placeholder="What did they say about your work?"
                rows={4}
                className="bg-[#1A2332] border-white/5 rounded-2xl resize-none italic"
              />
            </div>

            <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10">
               <div className="space-y-2">
                  <div className="text-[10px] font-bold text-[#6B7A8D] uppercase tracking-widest">Star Rating</div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button 
                        key={star} 
                        onClick={() => setCurrentTestimonial({ ...currentTestimonial, stars: star })}
                        className="transition-transform active:scale-90"
                      >
                        <Star className={cn(
                          "w-6 h-6",
                          star <= (currentTestimonial.stars || 0) ? "text-[#FFB830] fill-current" : "text-white/10"
                        )} />
                      </button>
                    ))}
                  </div>
               </div>
               <div className="flex flex-col items-end gap-2">
                  <span className="text-[10px] font-bold text-[#6B7A8D] uppercase tracking-widest">Visibility Status</span>
                  <Switch 
                    checked={currentTestimonial.visible ?? true} 
                    onCheckedChange={val => setCurrentTestimonial({ ...currentTestimonial, visible: val })}
                    className="data-[state=checked]:bg-[#00E5A0]"
                  />
               </div>
            </div>
          </div>

          <DialogFooter className="gap-3 mt-4">
            <Button variant="ghost" onClick={() => setModalOpen(false)} className="text-[#6B7A8D] hover:text-white font-bold uppercase text-[10px] tracking-widest">
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="bg-[#00E5A0] hover:bg-[#00E5A0]/90 text-black font-bold h-12 px-10 rounded-xl"
            >
              {isSaving ? 'Saving...' : 'Publish Testimonial'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestimonialsEditor;
