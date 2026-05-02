import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function LayoutShell() {
  return (
    <div className="flex min-h-screen bg-hero-gradient">
      <Sidebar />
      <main className="flex flex-1 flex-col gap-10 px-6 py-10 lg:px-12">
        <TopBar />
        <Outlet />
      </main>
    </div>
  );
}
