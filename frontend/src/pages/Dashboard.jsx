import { ClipboardList, Flame, FolderKanban } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/shared/PageHeader';
import StatCard from '../components/shared/StatCard';
import ProjectCard from '../components/shared/ProjectCard';
import EmptyState from '../components/shared/EmptyState';
import { useProjectStore } from '../store/projectStore';
import { useAuthStore } from '../store/authStore';

export default function Dashboard() {
  const navigate = useNavigate();
  const { projects, getProjectRole } = useProjectStore();
  const { user } = useAuthStore();

  const activeProjects = projects.filter((project) => project.status === 'active');

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back, ${user?.name?.split(' ')[0] || 'leader'}`}
        description="Track momentum and keep your delivery flowing."
      />
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          icon={FolderKanban}
          label="Active projects"
          value={activeProjects.length}
          progress={Math.min(100, activeProjects.length * 20)}
        />
        <StatCard
          icon={ClipboardList}
          label="Total projects"
          value={projects.length}
          progress={Math.min(100, projects.length * 15)}
        />
        <StatCard icon={Flame} label="Velocity" value="92%" progress={92} />
      </div>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Latest projects</h2>
        {projects.length === 0 ? (
          <EmptyState
            title="No projects yet"
            description="Create your first project to unlock the dashboard."
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projects.slice(0, 3).map((project) => (
              <ProjectCard
                key={project.id || project._id}
                project={project}
                role={getProjectRole(project, user?.id || user?._id)}
                onSelect={() => navigate(`/projects/${project.id || project._id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
