import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Sparkles, Settings2, Image as ImageIcon, 
  DollarSign, Star, ListOrdered, Phone, Settings, Bot, 
  Inbox, LogOut 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import ConnectionBadge from './ConnectionBadge';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import type { LucideProps } from 'lucide-react';

interface NavItem {
  to: string;
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  label: string;
  badge?: number;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const Sidebar: React.FC = () => {
  const logout = useAuthStore(state => state.logout);

  const navigation: NavGroup[] = [
    { label: 'OVERVIEW', items: [
      { to: '/deedoxadmin', icon: LayoutDashboard, label: 'Dashboard' },
    ]},
    { label: 'CONTENT', items: [
      { to: '/deedoxadmin/hero', icon: Sparkles, label: 'Hero Section' },
      { to: '/deedoxadmin/services', icon: Settings2, label: 'Services' },
      { to: '/deedoxadmin/portfolio', icon: ImageIcon, label: 'Portfolio' },
      { to: '/deedoxadmin/pricing', icon: DollarSign, label: 'Pricing Plans' },
      { to: '/deedoxadmin/testimonials', icon: Star, label: 'Testimonials' },
      { to: '/deedoxadmin/process', icon: ListOrdered, label: 'Process Steps' },
    ]},
    { label: 'SETTINGS', items: [
      { to: '/deedoxadmin/contact', icon: Phone, label: 'Contact Info' },
      { to: '/deedoxadmin/settings', icon: Settings, label: 'Site Settings' },
      { to: '/deedoxadmin/ai', icon: Bot, label: 'AI / Chat' },
    ]},
    { label: 'MESSAGES', items: [
      { to: '/deedoxadmin/inbox', icon: Inbox, label: 'Inbox', badge: 0 },
    ]},
  ];

  return (
    <aside className="w-64 bg-[#0D1520] border-r border-white/5 flex flex-col h-full overflow-hidden">
      <div className="p-6">
        <h1 className="text-2xl font-bold font-serif text-white uppercase tracking-tighter">
          Deedox<span className="text-xs align-top relative top-[-4px]">®</span>
        </h1>
        <p className="text-[11px] text-[#6B7A8D] font-medium tracking-[4px] uppercase mt-1">
          Admin Panel
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-8 scrollbar-hide">
        {navigation.map((group) => (
          <div key={group.label} className="space-y-2">
            <h3 className="px-3 text-[10px] font-bold text-[#6B7A8D] tracking-[2px] uppercase">
              {group.label}
            </h3>
            <div className="space-y-1">
              {group.items?.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/deedoxadmin'}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group",
                    isActive 
                      ? "bg-[#00D4FF]/10 text-[#00D4FF] border-l-2 border-[#00D4FF] rounded-l-none" 
                      : "text-[#6B7A8D] hover:bg-white/5 hover:text-white"
                  )}
                >
                  {({ isActive }) => (
                    <>
                      <item.icon className={cn("w-[18px] h-[18px]", isActive ? "text-[#00D4FF]" : "text-[#6B7A8D] group-hover:text-white")} />
                      <span className="text-sm font-medium font-sans">{item.label}</span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="ml-auto bg-[#00D4FF] text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5 space-y-4">
        <ConnectionBadge />
        <button 
          onClick={() => logout()}
          className="flex items-center gap-3 w-full px-4 py-2 text-[#FF5757] hover:bg-[#FF5757]/10 rounded-xl transition-all duration-300 group"
        >
          <LogOut className="w-[18px] h-[18px] group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
