import type { Message, Project } from '@shared/lib/types';

import ProjectFormDialog from '@frontend/components/projectForm/projectForm';
import {
  TypographyH5,
  TypographyP,
} from '@frontend/components/typography/typography';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@frontend/components/ui/alertDialog';
import { Button, buttonVariants } from '@frontend/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@frontend/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@frontend/components/ui/dropdownMenu';
import config from '@frontend/lib/config';
import { useProjectStore } from '@frontend/stores/projectStore';
import { useNavigate } from '@tanstack/react-router';
import { ArrowRight, EllipsisVertical, Loader2Icon, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ListProjectsSection() {
  const projects = useProjectStore(state => state.projects);
  const editProject = useProjectStore(state => state.editProject);
  const selectedProject = useProjectStore(state => state.selectedProject);
  const setSelectedProject = useProjectStore(
    state => state.setSelectedProject,
  );
  const deleteProject = useProjectStore(state => state.deleteProject);

  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const navigate = useNavigate();
  const handleEdit = (index: number) => {
    editProject(index);
  };

  const handleClick = (projectId: string) => {
    navigate({
      to: '/projects/$projectId/schemas',
      params: {
        projectId,
      },
    });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const res = await fetch(`${config.BACKEND_URL}/projects/${(selectedProject as Project).id}`, {
      method: 'DELETE',
    });
    const json: Message = await res.json();
    if (json.message.includes('deleted')) {
      deleteProject((selectedProject as Project).id);
      setOpenAlert(false);
    }
    else {
      toast('Something went wrong!', {
        description: json.message,

      });
    }
    setIsDeleting(false);
  };

  return (
    <div className="flex flex-col gap-6 sm:flex-row">
      {projects.map((project, idx) => {
        return (
          <Card key={project.id} className="sm:w-sm w-full gap-4">
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
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onSelect={() => {
                        handleEdit(idx);
                        setOpen(prev => !prev);
                      }}
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full justify-start"
                      >
                        <Pencil />
                        {' '}
                        Edit
                      </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive cursor-pointer"
                      onSelect={() => {
                        setSelectedProject(project);
                        setOpenAlert(prev => !prev);
                      }}
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        className="hover:text-destructive w-full justify-start"
                      >
                        <Trash2 className="text-destructive" />
                        {' '}
                        Delete
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardAction>
            </CardHeader>
            <CardContent>
              <TypographyP className="text-muted-foreground">
                {project.description}
              </TypographyP>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleClick(project.id)}>
                Goto Schema
                {' '}
                <ArrowRight />
              </Button>
            </CardFooter>
          </Card>
        );
      })}
      <ProjectFormDialog open={open} setOpen={setOpen} title="Edit Project" />

      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              Project with all its schemas and records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({ variant: 'destructive' })}
              asChild
            >
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting && <Loader2Icon className="animate-spin" />}
                Delete
              </Button>

            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
