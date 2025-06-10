import type { Project } from '@shared/lib/types';

import ProjectFormDialog from '@frontend/components/projectForm/projectForm';
import {
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
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';

export type ListProjectsProps = {
  projects: Project[];
  deleteProject: (id: string) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDesktop: boolean;
  editProject: (index: number) => void;
};

export default function ListProjectsSection({
  projects,
  deleteProject,
  open,
  setOpen,
  isDesktop,
  editProject,
}: ListProjectsProps) {
  const handleEdit = (index: number) => {
    editProject(index);
    setOpen(prev => !prev);
  };

  return (
    <div className="flex flex-col gap-6 sm:flex-row">
      {projects.map((project, idx) => {
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
                      <ProjectFormDialog
                        button={(
                          <Button
                            variant="ghost"
                            onClick={() => handleEdit(idx)}
                            className="has-[>svg]:p-0 w-full justify-start"
                          >
                            <Pencil />
                            {' '}
                            Edit
                          </Button>
                        )}
                        isDesktop={isDesktop}
                        setOpen={setOpen}
                        open={open}
                        project={project}
                        title="Edit Project"
                      />
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
