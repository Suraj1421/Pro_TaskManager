import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import LayoutShell from './components/layout/LayoutShell';
import ProtectedRoute from './components/shared/ProtectedRoute';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Tasks from './pages/Tasks';
import { useAuthStore } from './store/authStore';
import { useProjectStore } from './store/projectStore';

function App() {
  const { init, isAuthenticated } = useAuthStore();
  const { loadProjects } = useProjectStore();

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (isAuthenticated) {
      loadProjects();
    }
  }, [isAuthenticated, loadProjects]);

  return (
    <>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<LayoutShell />}>
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:projectId" element={<ProjectDetail />} />
            <Route path="tasks" element={<Tasks />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
