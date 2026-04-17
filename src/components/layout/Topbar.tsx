import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ExternalLink, User } from 'lucide-react';
import { 
  DropdownMenu, DropdownMenuContent, 
  DropdownMenuItem, DropdownMenuLabel, 
  DropdownMenuSeparator, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/store/authStore';

const Topbar: React.FC = () => {
  const location = useLocation();
  const logout = useAuthStore(state => state.logout);
  
  const getPageTitle = (path: string) => {
    const parts = path.split('/').filter(Boolean);
    if (parts.length === 0) return 'Dashboard';
    const main = parts[0];
    return main.charAt(0).toUpperCase() + main.slice(1);
  };

  return (
    <header className="h-16 border-b border-white/5 bg-[#0D1820]/80 backdrop-blur-md flex items-center justify-between px-8 relative z-50">
      <div>
        <h2 className="text-xl font-serif font-semibold text-white tracking-tight">
          {getPageTitle(location.pathname)}
        </h2>
        <p className="text-[11px] text-[#6B7A8D] uppercase tracking-widest mt-0.5">
          Admin / <span className="text-white/40">{getPageTitle(location.pathname)}</span>
        </p>
      </div>

      <div className="flex items-center gap-6">
        <a 
          href="https://deedox.xo.je" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-[#1A2332] border border-white/5 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:border-[#00D4FF]/30 transition-all duration-300"
        >
          <span>View Live Site</span>
          <ExternalLink className="w-4 h-4" />
        </a>

        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <div className="w-10 h-10 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/20 flex items-center justify-center text-[#00D4FF] font-serif font-bold hover:scale-105 transition-transform cursor-pointer">
              D
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#111820] border-white/5 text-white shadow-2xl">
            <DropdownMenuLabel className="font-serif text-[#6B7A8D] font-normal">admin@deedox.agency</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem className="focus:bg-white/5 focus:text-[#00D4FF] cursor-pointer gap-2 py-2.5">
              <User className="w-4 h-4" />
              <span>Admin Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem 
              onClick={() => logout()}
              className="focus:bg-[#FF5757]/10 text-[#FF5757] focus:text-[#FF5757] cursor-pointer gap-2 py-2.5 font-medium"
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Topbar;
