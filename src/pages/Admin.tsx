import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings, type PortfolioProject } from '../context/SettingsContext';
import { 
    Eye, RefreshCw, LayoutDashboard, 
    Image as ImageIcon, ArrowLeft, Plus, Trash2, 
    Edit3, Save, X, Palette, Sparkles, ChevronDown, 
    Tag
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Admin: React.FC = () => {
    const { 
        bgOpacity1, bgOpacity2, bgOpacity3, bgOpacity4, 
        projects, heroVideo, bgImage1, bgImage2, bgImage3, bgImage4,
        setBgOpacity1, setBgOpacity2, setBgOpacity3, setBgOpacity4,
        setHeroVideo, setBgImage1, setBgImage2, setBgImage3, setBgImage4,
        addProject, updateProject, deleteProject, resetSettings, isLoading 
    } = useSettings();

    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Omit<PortfolioProject, 'id'>>({
        title: '',
        description: '',
        image: '',
        link: '',
        category: 'Development'
    });

    const controls = [
        { id: 'bg1', label: "Background 1 (The Vision)", sub: "Why Choose Us", value: bgOpacity1, setter: setBgOpacity1 },
        { id: 'bg2', label: "Background 2 (The Surfer)", sub: "Services & Portfolio", value: bgOpacity2, setter: setBgOpacity2 },
        { id: 'bg3', label: "Background 3 (The Perspective)", sub: "Pricing & Testimonials", value: bgOpacity3, setter: setBgOpacity3 },
        { id: 'bg4', label: "Background 4 (Command Center)", sub: "Contact & Footer", value: bgOpacity4, setter: setBgOpacity4 },
    ];

    const handleAdd = () => {
        if (!formData.title) return;
        addProject(formData);
        setIsAdding(false);
        setFormData({ title: '', description: '', image: '', link: '', category: 'Development' });
    };

    const handleUpdate = (id: string) => {
        updateProject(id, formData);
        setEditingId(null);
        setFormData({ title: '', description: '', image: '', link: '', category: 'Development' });
    };

    const startEdit = (project: PortfolioProject) => {
        setFormData({
            title: project.title,
            description: project.description,
            image: project.image,
            link: project.link,
            category: project.category
        });
        setEditingId(project.id);
    };

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-white/10">
            <AnimatePresence>
                {isLoading && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center gap-6"
                    >
                        <div className="relative w-24 h-24">
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border-2 border-white/5 border-t-white rounded-full"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Sparkles className="h-8 w-8 text-white/40" />
                            </div>
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-serif tracking-widest uppercase">Connecting</h3>
                            <p className="text-xs text-white/20 uppercase tracking-[4px]">Universe Syncing...</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Premium Navigation Header */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full" />
            </div>

            {/* Admin Header */}
            <div className="max-w-6xl mx-auto mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
                <div className="space-y-4">
                    <Link to="/" className="inline-flex items-center gap-2 text-white/30 hover:text-white transition-all text-[10px] font-bold uppercase tracking-[4px] group">
                        <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
                        Back to Site
                    </Link>
                    <h1 className="text-6xl md:text-8xl font-serif tracking-tighter leading-none">
                        Control <em className="not-italic text-white/20 italic">Center</em>
                    </h1>
                    <div className="flex items-center gap-4 text-white/40 font-sans text-sm tracking-wide">
                        <span>Management System v2.0</span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span>Connected to Local Node</span>
                    </div>
                </div>
                
                <div className="flex gap-4">
                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={resetSettings}
                        className="h-12 px-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-3 text-[10px] font-bold uppercase tracking-[2px]"
                    >
                        <RefreshCw className="h-3 w-3" />
                        Factorize Reset
                    </motion.button>
                </div>
            </div>

            {/* Section Shortcuts */}
            <div className="max-w-6xl mx-auto mb-16 flex flex-wrap gap-3 relative z-10">
                <button onClick={() => scrollToSection('cinematic')} className="px-6 py-2.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-[2px] hover:bg-white/10 transition-all">Visuals</button>
                <button onClick={() => scrollToSection('portfolio-mgt')} className="px-6 py-2.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-[2px] hover:bg-white/10 transition-all">Projects</button>
                <button className="px-6 py-2.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-[2px] opacity-30 cursor-not-allowed">Analytics</button>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
                {/* Left Column: Visibility Controls */}
                <div className="lg:col-span-5" id="cinematic">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="liquid-glass p-8 md:p-12 rounded-[48px] border border-white/10 shadow-2xl relative overflow-hidden h-fit"
                    >
                        <div className="flex items-center gap-4 mb-12">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
                                <Eye className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-serif">Cinematic Intensity</h2>
                                <p className="text-white/30 text-[10px] uppercase tracking-widest font-bold mt-1">Global Background Visibility</p>
                            </div>
                        </div>

                        <div className="space-y-12">
                            {controls.map((control) => (
                                <div key={control.id} className="space-y-6">
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1">
                                            <h3 className="text-[12px] font-bold uppercase tracking-[2.5px]">{control.label}</h3>
                                            <p className="text-white/20 text-[10px] uppercase tracking-[1px]">{control.sub}</p>
                                        </div>
                                        <span className="text-2xl font-serif text-white/80">{control.value}%</span>
                                    </div>
                                    <div className="relative h-1 w-full bg-white/10 rounded-full group cursor-pointer">
                                        <input 
                                            type="range" 
                                            min="0" 
                                            max="100" 
                                            value={control.value}
                                            onChange={(e) => control.setter(Number(e.target.value))}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <motion.div 
                                            className="absolute inset-y-0 left-0 bg-white rounded-full transition-colors shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                                            style={{ width: `${control.value}%` }}
                                        />
                                        {/* Tick Marks */}
                                        <div className="absolute inset-0 flex justify-between px-1 pointer-events-none">
                                            {[0, 25, 50, 75, 100].map(p => (
                                                <div key={p} className="h-full w-[1px] bg-white/20" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Visual Help Tip */}
                        <div className="mt-16 p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10 flex items-start gap-4">
                            <Sparkles className="h-5 w-5 text-blue-400 shrink-0" />
                            <p className="text-[11px] text-white/50 leading-relaxed font-sans">
                                Changes are saved automatically and reflected in the "Storytelling" layers of the main site. High values (80%+) create a raw cinematic feel, while lower values (20%-) provide a cleaner, focused experience.
                            </p>
                        </div>
                    </motion.div>

                    {/* Visual Assets Management */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="liquid-glass p-8 md:p-12 rounded-[48px] border border-white/10 shadow-2xl relative overflow-hidden h-fit mt-12"
                    >
                        <div className="flex items-center gap-4 mb-12">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
                                <ImageIcon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-serif">Visual Assets</h2>
                                <p className="text-white/30 text-[10px] uppercase tracking-widest font-bold mt-1">Hero Video & Background Images</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {/* Hero Video */}
                            <div className="space-y-4">
                                <label className="text-[10px] uppercase tracking-[4px] text-white/30 font-bold ml-1">Hero Video URL</label>
                                <div className="relative group">
                                    <input 
                                        type="text" 
                                        value={heroVideo}
                                        onChange={(e) => setHeroVideo(e.target.value)}
                                        placeholder="Enter mp4 URL..."
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 outline-none focus:border-white/20 focus:bg-white/10 transition-all text-xs font-mono opacity-80"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500 animate-pulse opacity-0 group-focus-within:opacity-100 transition-opacity" />
                                </div>
                            </div>

                            {/* BG Image 1 */}
                            <div className="space-y-4">
                                <label className="text-[10px] uppercase tracking-[4px] text-white/30 font-bold ml-1">Background 1 (Why Choose Us)</label>
                                <input 
                                    type="text" 
                                    value={bgImage1}
                                    onChange={(e) => setBgImage1(e.target.value)}
                                    placeholder="Enter image URL..."
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 outline-none focus:border-white/20 focus:bg-white/10 transition-all text-xs font-mono opacity-80"
                                />
                            </div>

                            {/* BG Image 2 */}
                            <div className="space-y-4">
                                <label className="text-[10px] uppercase tracking-[4px] text-white/30 font-bold ml-1">Background 2 (Our Services)</label>
                                <input 
                                    type="text" 
                                    value={bgImage2}
                                    onChange={(e) => setBgImage2(e.target.value)}
                                    placeholder="Enter image URL..."
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 outline-none focus:border-white/20 focus:bg-white/10 transition-all text-xs font-mono opacity-80"
                                />
                            </div>

                            {/* BG Image 3 */}
                            <div className="space-y-4">
                                <label className="text-[10px] uppercase tracking-[4px] text-white/30 font-bold ml-1">Background 3 (Stats Section)</label>
                                <input 
                                    type="text" 
                                    value={bgImage3}
                                    onChange={(e) => setBgImage3(e.target.value)}
                                    placeholder="Enter image URL..."
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 outline-none focus:border-white/20 focus:bg-white/10 transition-all text-xs font-mono opacity-80"
                                />
                            </div>

                            {/* BG Image 4 */}
                            <div className="space-y-4">
                                <label className="text-[10px] uppercase tracking-[4px] text-white/30 font-bold ml-1">Background 4 (Footer Section)</label>
                                <input 
                                    type="text" 
                                    value={bgImage4}
                                    onChange={(e) => setBgImage4(e.target.value)}
                                    placeholder="Enter image URL..."
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 outline-none focus:border-white/20 focus:bg-white/10 transition-all text-xs font-mono opacity-80"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Column: Portfolio Management */}
                <div className="lg:col-span-7" id="portfolio-mgt">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="liquid-glass p-8 md:p-12 rounded-[48px] border border-white/10 shadow-2xl h-fit min-h-[600px]"
                    >
                        <div className="flex items-center justify-between mb-12">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
                                    <LayoutDashboard className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-serif">Signature Projects</h2>
                                    <p className="text-white/30 text-[10px] uppercase tracking-widest font-bold mt-1">Portfolio Ecosystem Management</p>
                                </div>
                            </div>
                            
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    setFormData({ title: '', description: '', image: '', link: '', category: 'Development' });
                                    setIsAdding(true);
                                }}
                                className="h-12 px-6 rounded-full bg-white text-black text-[10px] font-bold uppercase tracking-[2px] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all flex items-center gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                New Project
                            </motion.button>
                        </div>

                        <div className="space-y-6">
                            <AnimatePresence mode="popLayout" initial={false}>
                                {projects.length === 0 ? (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="py-20 text-center border-2 border-dashed border-white/5 rounded-[32px]"
                                    >
                                        <p className="text-white/20 text-sm italic font-serif">No projects currently orchestrated...</p>
                                    </motion.div>
                                ) : (
                                    projects.map((project) => (
                                        <motion.div 
                                            key={project.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.98 }}
                                            className="group p-6 md:p-8 rounded-[32px] bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.07] transition-all relative overflow-hidden"
                                        >
                                            <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
                                                <div className="flex flex-col sm:flex-row items-center gap-6 flex-1 min-w-0 w-full text-center sm:text-left">
                                                    <div className="w-20 h-20 rounded-2xl overflow-hidden ring-1 ring-white/10 bg-black/40 shrink-0 shadow-lg">
                                                        <img src={project.image} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                                    </div>
                                                    <div className="min-w-0 space-y-1">
                                                        <h3 className="font-serif text-xl md:text-2xl text-white group-hover:text-blue-400 transition-colors truncate">{project.title}</h3>
                                                        <p className="text-white/40 text-[12px] truncate uppercase tracking-widest font-sans">{project.description}</p>
                                                        <div className="flex items-center gap-2 justify-center sm:justify-start">
                                                            <Tag className="h-3 w-3 text-white/20" />
                                                            <span className="text-[10px] text-white/20 uppercase font-bold tracking-widest">{project.category}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-3 shrink-0">
                                                    <button 
                                                        onClick={() => startEdit(project)}
                                                        className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                                                        title="Edit Project Identity"
                                                    >
                                                        <Edit3 className="h-5 w-5" />
                                                    </button>
                                                    <button 
                                                        onClick={() => deleteProject(project.id)}
                                                        className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all border border-white/5"
                                                        title="Remove Project Permanently"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Form Modal: Orchestrator */}
            <AnimatePresence>
                {(isAdding || editingId) && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#000000]/95 backdrop-blur-2xl"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 40 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 40 }}
                            className="w-full max-w-2xl p-8 md:p-16 rounded-[64px] bg-[#080808] border border-white/10 shadow-[0_0_100px_rgba(255,255,255,0.03)] space-y-12 overflow-y-auto max-h-[90vh]"
                        >
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <h2 className="text-4xl md:text-5xl font-serif">{editingId ? 'Refine' : 'Add'} Project</h2>
                                    <p className="text-white/30 text-xs uppercase tracking-[3px] font-bold">Project Configuration Module</p>
                                </div>
                                <button 
                                    onClick={() => { setIsAdding(false); setEditingId(null); }}
                                    className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all border border-white/10"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-[4px] text-white/30 font-bold ml-1">Brand Name / Title</label>
                                    <input 
                                        type="text" 
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        placeholder="Ex. VANTAGE AI"
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 px-8 outline-none focus:border-white/20 focus:bg-white/10 transition-all text-lg font-serif"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-[4px] text-white/30 font-bold ml-1">Cinematic Tagline</label>
                                    <input 
                                        type="text" 
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        placeholder="Ex. Beyond Digital Frontiers"
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 px-8 outline-none focus:border-white/20 focus:bg-white/10 transition-all text-sm tracking-wide"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-[4px] text-white/30 font-bold ml-1">Visual Asset Endpoint (Image)</label>
                                    <input 
                                        type="text" 
                                        value={formData.image}
                                        onChange={(e) => setFormData({...formData, image: e.target.value})}
                                        placeholder="Unsplash URL, CDN, or Local Path"
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 px-8 outline-none focus:border-white/20 focus:bg-white/10 transition-all text-xs font-mono opacity-80"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] uppercase tracking-[4px] text-white/30 font-bold ml-1">Deployment URL</label>
                                        <input 
                                            type="text" 
                                            value={formData.link}
                                            onChange={(e) => setFormData({...formData, link: e.target.value})}
                                            placeholder="https://deedox.vision/..."
                                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 px-8 outline-none focus:border-white/20 focus:bg-white/10 transition-all text-xs font-mono opacity-80"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] uppercase tracking-[4px] text-white/30 font-bold ml-1 flex items-center gap-2">
                                            <Palette className="h-3.5 w-3.5 text-blue-400" />
                                            Category
                                        </label>
                                        <div className="relative">
                                            <select 
                                                value={formData.category}
                                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 px-8 outline-none focus:border-white/20 focus:bg-white/10 transition-all appearance-none text-[11px] font-bold uppercase tracking-[2px]"
                                            >
                                                <option value="Development" className="bg-[#0c0c0c]">Development</option>
                                                <option value="Design" className="bg-[#0c0c0c]">Design</option>
                                                <option value="AI Solutions" className="bg-[#0c0c0c]">AI Solutions</option>
                                                <option value="Marketing" className="bg-[#0c0c0c]">Marketing</option>
                                            </select>
                                            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 pt-6">
                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => editingId ? handleUpdate(editingId) : handleAdd()}
                                    className="w-full h-20 rounded-[32px] bg-white text-black font-bold uppercase tracking-[6px] text-sm flex items-center justify-center gap-4 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all shadow-xl"
                                >
                                    <Save className="h-5 w-5" />
                                    {editingId ? 'Refine Project' : 'Initiate Project'}
                                </motion.button>
                                <button 
                                    onClick={() => { setIsAdding(false); setEditingId(null); }}
                                    className="w-full py-4 text-[10px] uppercase tracking-[4px] text-white/20 hover:text-white transition-colors font-bold"
                                >
                                    Cancel Orchestration
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Status Footer */}
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 py-16 border-t border-white/5 relative z-10">
                <div className="flex flex-wrap justify-center gap-12">
                    <div className="flex items-center gap-3 text-[10px] uppercase font-bold tracking-[3px] text-white/20 group">
                        <LayoutDashboard className="h-4 w-4 group-hover:text-blue-400 transition-colors" />
                        Admin Core v2.4
                    </div>
                    <div className="flex items-center gap-3 text-[10px] uppercase font-bold tracking-[3px] text-white/20 group">
                        <ImageIcon className="h-4 w-4 group-hover:text-purple-400 transition-colors" />
                        Media Engine Online
                    </div>
                    <div className="flex items-center gap-3 text-[10px] uppercase font-bold tracking-[3px] text-emerald-500/40 group">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Sync Active
                    </div>
                </div>
                <div className="text-[10px] uppercase font-bold tracking-[4px] text-white/10">
                    Deedox Agency Global
                </div>
            </div>
        </div>
    );
};

export default Admin;
