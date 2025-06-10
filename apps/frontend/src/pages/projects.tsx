import projectSVG from '@frontend/assets/projects.svg';
import Navbar from '@frontend/components/navbar/navbar';
import {
  TypographyH2,
  TypographyH5,
  TypographyP,
} from '@frontend/components/typography/typography';
import { Button } from '@frontend/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@frontend/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@frontend/components/ui/dropdownMenu';
import PageShell from '@frontend/pageShell';
import { EllipsisVertical, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

type Project = {
  id: string;
  name: string;
  description: string;
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

  const deleteProject = (id: string) => {
    const index = projects.findIndex(project => project.id === id);
    const updatedProjects = [...projects];
    updatedProjects.splice(index, 1);
    setProjects(updatedProjects);
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
          <Button>
            <Plus />
            {' '}
            Create Project
          </Button>
        )}
      </div>

      {projects.length === 0 && <NewProject />}
      {projects.length > 0 && (
        <ListProjects projects={projects} deleteProject={deleteProject} />
      )}
    </PageShell>
  );
}

function NewProject() {
  return (
    <div className="flex flex-auto flex-col items-center justify-center gap-8 text-center">
      <img src={projectSVG} alt="create-project" className="sm:w-md" />
      <Button>
        <Plus />
        {' '}
        Create Project
      </Button>
    </div>
  );
}

type ListProjectsProps = {
  projects: Project[];
  deleteProject: (id: string) => void;
};

function ListProjects({ projects, deleteProject }: ListProjectsProps) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row">
      {projects.map((project) => {
        return (
          <Card key={project.id} className="sm:w-sm w-full cursor-pointer">
            <CardHeader>
              <CardTitle>
                <TypographyH5>{project.name}</TypographyH5>
              </CardTitle>
              <CardAction>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="cursor-pointer">
                    <EllipsisVertical />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem className="cursor-pointer">
                      <Pencil />
                      {' '}
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive cursor-pointer"
                      onClick={() => deleteProject(project.id)}
                    >
                      <Trash2 className="text-destructive" />
                      {' '}
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardAction>
            </CardHeader>
            <CardContent>
              <TypographyP>{project.description}</TypographyP>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
