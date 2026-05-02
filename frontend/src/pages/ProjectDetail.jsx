import { useEffect, useMemo, useState } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useParams } from 'react-router-dom';
import { Filter, Plus, Search } from 'lucide-react';
import { useProjectStore } from '../store/projectStore';
import { useAuthStore } from '../store/authStore';
import TaskCard from '../components/shared/TaskCard';
import EmptyState from '../components/shared/EmptyState';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';

const columns = [
  { key: 'todo', label: 'To do' },
  { key: 'in_progress', label: 'In progress' },
  { key: 'review', label: 'Review' },
  { key: 'done', label: 'Done' },
];

export default function ProjectDetail() {
  const { projectId } = useParams();
  const {
    projects,
    tasksByProject,
    loadTasks,
    updateTask,
    createTask,
    getProjectRole,
    isLoading,
  } = useProjectStore();
  const { user } = useAuthStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '' });

  const project = projects.find((entry) => entry.id === projectId || entry._id === projectId);
  const role = getProjectRole(project, user?.id || user?._id);
  const tasks = useMemo(() => tasksByProject[projectId] || [], [tasksByProject, projectId]);

  useEffect(() => {
    if (projectId) {
      loadTasks(projectId);
    }
  }, [loadTasks, projectId]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'all' || task.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [tasks, search, filter]);

  const grouped = useMemo(() => {
    return columns.reduce((acc, column) => {
      acc[column.key] = filteredTasks
        .filter((task) => task.status === column.key)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      return acc;
    }, {});
  }, [filteredTasks]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const { destination, draggableId } = result;
    const task = tasks.find(
      (entry) => (entry.id || entry._id).toString() === draggableId.toString()
    );
    if (!task) return;
    updateTask(projectId, draggableId, {
      status: destination.droppableId,
      order: destination.index,
    });
  };

  const handleCreateTask = async (event) => {
    event.preventDefault();
    const created = await createTask(projectId, { title: form.title, description: form.description });
    if (created) {
      setOpen(false);
      setForm({ title: '', description: '' });
    }
  };

  if (!project && isLoading) {
    return (
      <EmptyState
        title="Loading project"
        description="Fetching the latest project data."
      />
    );
  }

  if (!project) {
    return (
      <EmptyState
        title="Project not found"
        description="We couldn't locate this project in your workspace."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">{project.name}</h2>
          <p className="mt-1 text-sm text-slate-400">{project.description}</p>
        </div>
        {['owner', 'admin'].includes(role) && (
          <Button onClick={() => setOpen(true)}>
            <Plus size={16} />
            New task
          </Button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-400">
          <Search size={16} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="bg-transparent text-sm text-slate-100 outline-none"
            placeholder="Search tasks"
          />
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-400">
          <Filter size={16} />
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="bg-transparent text-sm text-slate-100 outline-none"
          >
            <option value="all">All</option>
            {columns.map((column) => (
              <option key={column.key} value={column.key}>
                {column.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {tasks.length === 0 && (
        <EmptyState
          title="No tasks yet"
          description="Create a task and drag it across the board as it progresses."
        />
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid gap-6 lg:grid-cols-4">
          {columns.map((column) => (
            <div key={column.key} className="glass-card flex flex-col gap-4 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-200">{column.label}</p>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-300">
                  {grouped[column.key]?.length || 0}
                </span>
              </div>
              <Droppable droppableId={column.key}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex min-h-[120px] flex-col gap-3"
                  >
                    {(grouped[column.key] || []).map((task, index) => (
                      <TaskCard key={task.id || task._id} task={task} index={index} />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New task</DialogTitle>
            <DialogDescription>Add a task to the Kanban board.</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleCreateTask}>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
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
              <Button type="submit">Create task</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
