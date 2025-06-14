import type { Project, ProjectBase } from '@shared/lib/types';

import { create } from 'zustand';

type ProjectsStore = {
  projects: Project[];
  setProjects: (updatedProjects: Project[]) => void;
  selectedProject: Project | ProjectBase | null;
  setSelectedProject: (project: Project | ProjectBase | null) => void;
  deleteProject: (id: string) => void;
  defaultProject: ProjectBase;
  editProject: (index: number) => void;
};

export const useProjectStore = create<ProjectsStore>(set => ({
  projects: [{
    id: 'test',
    name: 'Project 1',
    description: 'Description of Project 1',
    slug: 'project-1',
  }, {
    id: 'test 2',
    name: 'Project 2',
    description: 'Description of Project 2',
    slug: 'project-2',
  }],
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
    name: '',
    description: '',
  },
  editProject: (index) => {
    const state = useProjectStore.getState();
    const projects = state.projects;
    const selectedProject: Project | ProjectBase = projects[index] ?? state.defaultProject;
    state.setSelectedProject(selectedProject);
  },
}));
