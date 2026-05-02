import { useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import UserMenu from './UserMenu';

const titles = {
  '/': 'Dashboard',
  '/projects': 'Projects',
  '/tasks': 'Tasks',
};

export default function TopBar() {
  const location = useLocation();
  const title = titles[location.pathname] || 'Project';

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Workspace</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-400 lg:flex">
          <Search size={16} />
          <span>Search tasks, projects...</span>
        </div>
        <UserMenu />
      </div>
    </div>
  );
}
