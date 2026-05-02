import { useEffect, useMemo, useState } from 'react';
import { useProjectStore } from '../store/projectStore';
import { useAuthStore } from '../store/authStore';
import { Badge } from '../components/ui/badge';
import EmptyState from '../components/shared/EmptyState';

export default function Tasks() {
  const { projects, tasksByProject, loadTasks, activeProjectId, setActiveProject } =
    useProjectStore();
  const { user } = useAuthStore();
  const [selectedProject, setSelectedProject] = useState(activeProjectId || '');
  const resolvedProjectId =
    selectedProject || activeProjectId || (projects[0]?.id || projects[0]?._id || '');

  useEffect(() => {
    if (resolvedProjectId) {
      setActiveProject(resolvedProjectId);
      loadTasks(resolvedProjectId);
    }
  }, [resolvedProjectId, loadTasks, setActiveProject]);

  const tasks = useMemo(
    () => tasksByProject[resolvedProjectId] || [],
    [tasksByProject, resolvedProjectId]
  );

  const assignedTasks = useMemo(() => {
    if (!user) return tasks;
    return tasks.filter((task) =>
      (task.assignees || []).some(
        (assignee) => (assignee._id || assignee.id || assignee) === (user.id || user._id)
      )
    );
  }, [tasks, user]);

  if (!projects.length) {
    return (
      <EmptyState
        title="No projects yet"
        description="Create a project before managing tasks."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">Your tasks</h2>
          <p className="text-sm text-slate-400">
            Tracking {assignedTasks.length} tasks assigned to you.
          </p>
        </div>
        <select
          value={resolvedProjectId}
          onChange={(event) => setSelectedProject(event.target.value)}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100"
        >
          {projects.map((project) => (
            <option key={project.id || project._id} value={project.id || project._id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {assignedTasks.length === 0 ? (
        <EmptyState
          title="No assigned tasks"
          description="You're all caught up. Check back when new tasks land."
        />
      ) : (
        <div className="grid gap-4">
          {assignedTasks.map((task) => (
            <div key={task.id || task._id} className="glass-card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">{task.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {task.description || 'No description'}
                  </p>
                </div>
                <Badge variant={task.status === 'done' ? 'success' : 'info'}>
                  {task.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
