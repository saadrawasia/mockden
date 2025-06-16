import type { Project } from '@shared/lib/types';

import { create } from 'zustand';

type ProjectsStore = {
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  defaultProject: Project;
};

export const useProjectStore = create<ProjectsStore>(set => ({
  selectedProject: null,
  setSelectedProject: (project) => {
    set(() => ({ selectedProject: project }));
  },
  defaultProject: {
    id: '',
    name: '',
    description: '',
    slug: '',
  },
}));
