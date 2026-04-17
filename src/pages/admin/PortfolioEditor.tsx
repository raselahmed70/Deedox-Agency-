import React, { useState, useEffect } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { ImageSelector } from '@/components/admin/ImageSelector';
import { 
  Plus, Search, Filter, Image as ImageIcon, 
  Trash2, Edit3, ExternalLink, RefreshCw, 
  Upload, CheckCircle2, XCircle, Grid, 
  List, MoreVertical, LayoutGrid
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  DropdownMenu, DropdownMenuContent, 
  DropdownMenuItem, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogFooter, DialogDescription
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue
} from '@/components/ui/select';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  link: string;
  description: string;
  created_at: string;
}

const PortfolioEditor: React.FC = () => {
  const { projects, addProject, updateProject, deleteProject, isLoading } = useSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);



  const handleSave = async () => {
    if (!currentProject.title || !currentProject.category || !currentProject.image) {
      toast.error("Title, Category, and Image are required");
      return;
    }

    setIsSaving(true);
    try {
      if (currentProject.id) {
        await updateProject(currentProject.id, {
          title: currentProject.title,
          category: currentProject.category,
          image: currentProject.image,
          link: currentProject.link || '',
          description: currentProject.description || ''
        });
        toast.success("Project updated");
      } else {
        await addProject({
          title: currentProject.title,
          category: currentProject.category,
          image: currentProject.image,
          link: currentProject.link || '',
          description: currentProject.description || ''
        });
        toast.success("New project added to portfolio");
      }
      setModalOpen(false);
    } catch (err) {
      toast.error("Failed to save project");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProject(id);
      toast.success("Project removed");
    } catch (err) {
      toast.error("Failed to delete project");
    }
  };

  const categories = ['All', ...new Set(projects.map(p => p.category))];

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-[#6B7A8D]">
        <RefreshCw className="w-8 h-8 text-[#00D4FF] animate-spin" />
        <p className="font-serif italic text-sm">Curating your masterpieces...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* 🚀 Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#111820] p-8 rounded-3xl border border-white/5 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-48 h-48 bg-[#00D4FF]/5 blur-3xl rounded-full" />
         <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 bg-[#7B5EA7]/10 rounded-2xl flex items-center justify-center border border-[#7B5EA7]/20">
              <ImageIcon className="w-7 h-7 text-[#7B5EA7]" />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-bold text-white tracking-tight">Project Galactica</h2>
              <p className="text-xs text-[#6B7A8D] font-bold uppercase tracking-widest mt-1">
                Displaying {filteredProjects.length} of {projects.length} Masterpieces
              </p>
            </div>
         </div>
         <Button 
           onClick={() => { setCurrentProject({ category: 'Web Design' }); setModalOpen(true); }}
           className="bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-black font-bold h-12 px-8 rounded-2xl relative z-10"
         >
           <Plus className="w-5 h-5 mr-2" />
           Launch New Project
         </Button>
      </div>

      {/* 🔍 Filters & Tools */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7A8D] group-focus-within:text-[#00D4FF] transition-colors" />
            <Input 
              placeholder="Search projects by title or category..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-12 bg-[#111820] border-white/5 h-12 rounded-xl focus:border-[#00D4FF]/30 transition-all"
            />
          </div>
          
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[180px] bg-[#111820] border-white/5 h-12 rounded-xl text-white">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#6B7A8D]" />
                <SelectValue placeholder="Category" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-[#111820] border-white/10 text-white">
              {categories.map(cat => (
                <SelectItem key={cat} value={cat} className="focus:bg-[#1A2332] cursor-pointer">
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 p-1.5 bg-[#111820] rounded-xl border border-white/5">
           <button 
             onClick={() => setViewMode('grid')}
             className={cn("p-2 rounded-lg transition-all", viewMode === 'grid' ? "bg-[#00D4FF] text-black shadow-lg shadow-[#00D4FF]/20" : "text-[#6B7A8D] hover:text-white")}
           >
             <LayoutGrid className="w-4 h-4" />
           </button>
           <button 
             onClick={() => setViewMode('list')}
             className={cn("p-2 rounded-lg transition-all", viewMode === 'list' ? "bg-[#00D4FF] text-black shadow-lg shadow-[#00D4FF]/20" : "text-[#6B7A8D] hover:text-white")}
           >
             <List className="w-4 h-4" />
           </button>
        </div>
      </div>

      {/* 🖼️ Projects Display */}
      <div className={cn(
        "grid gap-6 pb-32",
        viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
      )}>
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, idx) => (
            <motion.div
              layout
              key={project.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              <Card className={cn(
                "bg-[#111820] border-white/5 overflow-hidden group hover:border-[#00D4FF]/30 transition-all duration-500",
                viewMode === 'list' ? "flex flex-row h-32" : ""
              )}>
                <div className={cn(
                  "relative overflow-hidden",
                  viewMode === 'list' ? "w-48" : "aspect-video"
                )}>
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button 
                        variant="secondary" 
                        size="icon" 
                        onClick={() => { setCurrentProject(project); setModalOpen(true); }}
                        className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-[#00D4FF] hover:text-black rounded-full transition-all"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        onClick={() => handleDelete(project.id)}
                        className="bg-[#FF5757]/80 backdrop-blur-md border border-[#FF5757]/20 hover:bg-[#FF5757] rounded-full transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                  </div>
                </div>
                
                <CardContent className={cn("p-6 flex flex-col justify-center", viewMode === 'list' ? "flex-1" : "")}>
                   <div className="flex items-center justify-between mb-2">
                     <Badge variant="outline" className="text-[9px] font-bold text-[#00D4FF] border-[#00D4FF]/30 uppercase tracking-[2px] bg-[#00D4FF]/5">
                        {project.category}
                     </Badge>
                     {project.link && (
                       <a href={project.link} target="_blank" className="text-[#6B7A8D] hover:text-[#00D4FF] transition-colors">
                         <ExternalLink className="w-4 h-4" />
                       </a>
                     )}
                   </div>
                   <h4 className="text-lg font-serif font-bold text-white tracking-tight mb-1">{project.title}</h4>
                   <p className="text-[11px] text-[#6B7A8D] line-clamp-2 leading-relaxed">{project.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredProjects.length === 0 && (
          <div className="col-span-full py-20 text-center bg-[#111820] rounded-[40px] border border-white/5 border-dashed">
            <LayoutGrid className="w-16 h-16 text-white/5 mb-6 mx-auto" />
            <h3 className="text-xl font-serif font-bold text-white mb-2">Universe Empty</h3>
            <p className="text-[#6B7A8D] font-sans text-sm">No projects matching your current filters found.</p>
          </div>
        )}
      </div>

      {/* 🛠 Project Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-[#111820] border-white/10 text-white max-w-2xl rounded-3xl p-8 max-h-[90vh] overflow-y-auto scrollbar-hide">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif font-bold tracking-tight">
              {currentProject.id ? 'Modify Masterpiece' : 'Launch New Creation'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
            <div className="space-y-6">
               <div className="space-y-2">
                  <Label className="text-[#6B7A8D] text-[10px] font-bold uppercase tracking-widest ml-1">Title</Label>
                  <Input 
                    value={currentProject.title || ''} 
                    onChange={e => setCurrentProject({ ...currentProject, title: e.target.value })}
                    placeholder="Project Name"
                    className="bg-[#1A2332] border-white/5 h-12 rounded-xl"
                  />
               </div>

               <div className="space-y-2">
                  <Label className="text-[#6B7A8D] text-[10px] font-bold uppercase tracking-widest ml-1">Category</Label>
                  <Input 
                    value={currentProject.category || ''} 
                    onChange={e => setCurrentProject({ ...currentProject, category: e.target.value })}
                    placeholder="e.g. Branding, UI/UX"
                    className="bg-[#1A2332] border-white/5 h-12 rounded-xl"
                  />
               </div>

               <div className="space-y-2">
                  <Label className="text-[#6B7A8D] text-[10px] font-bold uppercase tracking-widest ml-1">Live URL (Optional)</Label>
                  <Input 
                    value={currentProject.link || ''} 
                    onChange={e => setCurrentProject({ ...currentProject, link: e.target.value })}
                    placeholder="https://client-site.com"
                    className="bg-[#1A2332] border-white/5 h-12 rounded-xl"
                  />
               </div>

               <div className="space-y-2">
                  <Label className="text-[#6B7A8D] text-[10px] font-bold uppercase tracking-widest ml-1">Description</Label>
                  <Textarea 
                    value={currentProject.description || ''} 
                    onChange={e => setCurrentProject({ ...currentProject, description: e.target.value })}
                    placeholder="Tell the story of this project..."
                    rows={4}
                    className="bg-[#1A2332] border-white/5 rounded-2xl resize-none"
                  />
               </div>
            </div>

            <div className="space-y-6">
               <ImageSelector
                 label="Thumbnail Visual"
                 value={currentProject.image}
                 onChange={(url) => setCurrentProject({ ...currentProject, image: url })}
                 folder="portfolio"
                 onClear={() => setCurrentProject({ ...currentProject, image: '' })}
               />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)} className="text-[#6B7A8D] hover:text-white font-bold uppercase text-[10px] tracking-widest">
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-black font-bold px-10 h-12 rounded-xl shadow-lg shadow-[#00D4FF]/20"
            >
              {isSaving ? 'Deploying...' : (currentProject.id ? 'Update Project' : 'Launch Project')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PortfolioEditor;
