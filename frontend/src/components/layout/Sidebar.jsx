import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, ListTodo } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Separator } from '../ui/separator';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/' },
  { label: 'Projects', icon: FolderKanban, to: '/projects' },
  { label: 'Tasks', icon: ListTodo, to: '/tasks' },
];

export default function Sidebar() {
  return (
    <aside className="hidden h-screen w-64 flex-col gap-8 border-r border-white/10 bg-base-800/60 px-6 py-8 backdrop-blur-xl lg:flex">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Pro</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">Task Manager</h2>
        <p className="mt-2 text-sm text-slate-400">Neon productivity suite</p>
      </div>
      <Separator />
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10',
                isActive && 'bg-white/10 text-white shadow-lg'
              )
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <Separator />
      <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
        <p className="font-semibold text-slate-100">Need focus time?</p>
        <p className="mt-2 text-xs">Turn on deep work mode to silence distractions.</p>
      </div>
    </aside>
  );
}
