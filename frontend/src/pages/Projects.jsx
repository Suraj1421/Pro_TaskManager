import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/shared/PageHeader';
import ProjectCard from '../components/shared/ProjectCard';
import EmptyState from '../components/shared/EmptyState';
import { useProjectStore } from '../store/projectStore';
import { useAuthStore } from '../store/authStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';

export default function Projects() {
  const navigate = useNavigate();
  const { projects, createProject, getProjectRole } = useProjectStore();
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });

  const roleLookup = useMemo(
    () => (project) => getProjectRole(project, user?.id || user?._id),
    [getProjectRole, user]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    const created = await createProject(form);
    if (created) {
      setOpen(false);
      setForm({ name: '', description: '' });
      navigate(`/projects/${created.id}`);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Spin up new workstreams and manage team membership."
        actionLabel="New project"
        onAction={() => setOpen(true)}
      />
      {projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Create a project to start assigning tasks and milestones."
          actionLabel="Create project"
          onAction={() => setOpen(true)}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => {
            const projectId = project.id || project._id;
            return (
              <ProjectCard
                key={projectId}
                project={project}
                role={roleLookup(project)}
                onSelect={() => navigate(`/projects/${projectId}`)}
              />
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New project</DialogTitle>
            <DialogDescription>Create a project and invite collaborators.</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Project name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Create project</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
