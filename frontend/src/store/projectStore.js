import { create } from 'zustand';
import api from '../lib/api';
import { toast } from 'sonner';

const normalizeProject = (project) => ({
  ...project,
  members: project.members || [],
});

const getRoleForProject = (project, userId) => {
  if (!project || !userId) return null;
  const member = project.members.find((entry) => {
    const entryId = entry.user?._id || entry.user?.id || entry.user;
    return entryId?.toString() === userId.toString();
  });
  return member?.role || null;
};

export const useProjectStore = create((set) => ({
  projects: [],
  tasksByProject: {},
  isLoading: false,
  activeProjectId: null,
  getProjectRole: getRoleForProject,
  setActiveProject: (projectId) => set({ activeProjectId: projectId }),
  loadProjects: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/projects');
      set({ projects: data.projects.map(normalizeProject), isLoading: false });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load projects');
      set({ isLoading: false });
    }
  },
  createProject: async (payload) => {
    try {
      const { data } = await api.post('/projects', payload);
      set((state) => ({
        projects: [normalizeProject(data.project), ...state.projects],
      }));
      toast.success('Project created');
      return data.project;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create project');
      return null;
    }
  },
  loadTasks: async (projectId, filters = {}) => {
    try {
      const { data } = await api.get(`/projects/${projectId}/tasks`, { params: filters });
      set((state) => ({
        tasksByProject: { ...state.tasksByProject, [projectId]: data.tasks },
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load tasks');
    }
  },
  createTask: async (projectId, payload) => {
    try {
      const { data } = await api.post(`/projects/${projectId}/tasks`, payload);
      set((state) => ({
        tasksByProject: {
          ...state.tasksByProject,
          [projectId]: [data.task, ...(state.tasksByProject[projectId] || [])],
        },
      }));
      toast.success('Task created');
      return data.task;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
      return null;
    }
  },
  updateTask: async (projectId, taskId, payload) => {
    try {
      const { data } = await api.patch(`/projects/${projectId}/tasks/${taskId}`, payload);
      set((state) => ({
        tasksByProject: {
          ...state.tasksByProject,
          [projectId]: (state.tasksByProject[projectId] || []).map((task) =>
            task.id === taskId || task._id === taskId ? data.task : task
          ),
        },
      }));
      return data.task;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update task');
      return null;
    }
  },
  deleteTask: async (projectId, taskId) => {
    try {
      await api.delete(`/projects/${projectId}/tasks/${taskId}`);
      set((state) => ({
        tasksByProject: {
          ...state.tasksByProject,
          [projectId]: (state.tasksByProject[projectId] || []).filter(
            (task) => task.id !== taskId && task._id !== taskId
          ),
        },
      }));
      toast.success('Task deleted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete task');
    }
  },
}));
