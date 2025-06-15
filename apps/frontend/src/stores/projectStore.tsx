import type { Project } from '@shared/lib/types';

import { create } from 'zustand';

type ProjectsStore = {
  projects: Project[];
  setProjects: (updatedProjects: Project[]) => void;
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  deleteProject: (id: string) => void;
  defaultProject: Project;
  editProject: (index: number) => void;
};

export const useProjectStore = create<ProjectsStore>(set => ({
  projects: [],
  setProjects: (updatedProjects) => {
    set(() => ({ projects: updatedProjects }));
  },
  selectedProject: null,
  setSelectedProject: (project) => {
    set(() => ({ selectedProject: project }));
  },
  deleteProject: (id) => {
    const state = useProjectStore.getState();
    const projects = state.projects;
    const index = projects.findIndex(project => project.id === id);
    const updatedProjects = [...projects];
    updatedProjects.splice(index, 1);
    state.setProjects(updatedProjects);
  },
  defaultProject: {
    id: '',
    name: '',
    description: '',
    slug: '',
  },
  editProject: (index) => {
    const state = useProjectStore.getState();
    const projects = state.projects;
    const selectedProject = projects[index] ?? state.defaultProject;
    state.setSelectedProject(selectedProject);
  },
}));
