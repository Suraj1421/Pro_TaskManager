import { UserCircle2, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';

export default function UserMenu() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100">
          <UserCircle2 size={18} />
          <span className="hidden sm:inline">{user?.name || 'User'}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="px-3 py-2 text-xs text-slate-400">
          <p className="font-semibold text-slate-200">{user?.name}</p>
          <p>{user?.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            logout();
            navigate('/login');
          }}
        >
          <LogOut size={14} className="mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
