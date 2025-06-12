import type { Project } from '@shared/lib/types';

import { TypographyH2 } from '@frontend/components/typography/typography';
import { useMediaQuery } from '@frontend/hooks/useMediaQuery';
import PageShell from '@frontend/pageShell';
import ListProjectsSection from '@frontend/sections/projects/listProjects';
import NewProjectSection from '@frontend/sections/projects/newProject';
import { useState } from 'react';

const defaultProject = {
  name: '',
  description: '',
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 'test',
      name: 'Project 1',
      description: 'Description of Project 1',
    },
    {
      id: 'test 2',
      name: 'Project 2',
      description: 'Description of Project 2',
    },
  ]);

  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const deleteProject = (id: string) => {
    const index = projects.findIndex(project => project.id === id);
    const updatedProjects = [...projects];
    updatedProjects.splice(index, 1);
    setProjects(updatedProjects);
  };

  const editProject = (index: number) => {
    const { id, ...projectToEdit } = projects[index] ?? defaultProject;
    console.log(projectToEdit);
  };

  return (
    <PageShell>
      <title>Mockden - Projects</title>
      <meta
        name="description"
        content="Create, validate, and manage mock data with schemas. Built for
          developers who demand reliability and speed."
      />
      <div className="flex justify-between">
        <TypographyH2>Projects</TypographyH2>
        {projects.length > 0 && (
          <NewProjectSection
            isDesktop={isDesktop}
            defaultProject={defaultProject}
            renderSVG={false}
          />
        )}
      </div>

      {projects.length === 0 && (
        <NewProjectSection
          isDesktop={isDesktop}
          defaultProject={defaultProject}
          renderSVG={true}
        />
      )}
      {projects.length > 0 && (
        <ListProjectsSection
          projects={projects}
          deleteProject={deleteProject}
          isDesktop={isDesktop}
          setOpen={setOpen}
          open={open}
          editProject={editProject}
        />
      )}
    </PageShell>
  );
}
