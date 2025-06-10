import type { Project } from '@shared/lib/types';

import Navbar from '@frontend/components/navbar/navbar';
import ProjectFormDialog from '@frontend/components/projectForm/projectForm';
import { TypographyH2 } from '@frontend/components/typography/typography';
import { Button } from '@frontend/components/ui/button';
import { useMediaQuery } from '@frontend/hooks/useMediaQuery';
import PageShell from '@frontend/pageShell';
import ListProjectsSection from '@frontend/sections/projects/listProjects';
import NewProjectSection from '@frontend/sections/projects/newProject';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const defaultProject = {
  name: '',
  description: '',
};

export default function ProjectsPage() {
  const [project, setProject] = useState(defaultProject);
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

    setProject(projectToEdit);
  };

  return (
    <PageShell>
      <title>Mockden - Projects</title>
      <meta
        name="description"
        content="Create, validate, and manage mock data with schemas. Built for
          developers who demand reliability and speed."
      />
      <Navbar />
      <div className="flex justify-between">
        <TypographyH2>Projects</TypographyH2>
        {projects.length > 0 && (
          <ProjectFormDialog
            button={(
              <Button onClick={() => setOpen(prev => !prev)}>
                <Plus />
                {' '}
                Create Project
              </Button>
            )}
            isDesktop={isDesktop}
            setOpen={setOpen}
            open={open}
            project={project}
            title="New Project"
          />
        )}
      </div>

      {projects.length === 0 && (
        <NewProjectSection
          button={(
            <ProjectFormDialog
              button={(
                <Button onClick={() => setOpen(prev => !prev)}>
                  <Plus />
                  {' '}
                  Create Project
                </Button>
              )}
              isDesktop={isDesktop}
              setOpen={setOpen}
              open={open}
              project={project}
              title="New Project"
            />
          )}
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
