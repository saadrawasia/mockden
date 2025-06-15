import type { Message, Project, ProjectBase } from '@shared/lib/types';

import { useMediaQuery } from '@frontend/hooks/useMediaQuery';
import config from '@frontend/lib/config';
import { useProjectStore } from '@frontend/stores/projectStore';
import { ProjectZod } from '@shared/validators/projectValidator';
import { useForm } from '@tanstack/react-form';
import { Loader2Icon } from 'lucide-react';
import { useCallback, useState } from 'react';

import { TypographyCaption } from '../typography/typography';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '../ui/drawer';
import { ErrorInfo } from '../ui/errorInfo';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

type ProjectFormDialogProps = {
  title: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ProjectFormDialog({
  title,
  open,
  setOpen,
}: ProjectFormDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const requestType = title.includes('Edit') ? 'edit' : 'create';

  const handleOpen = useCallback((open = false) => setOpen(open), [setOpen]);

  const FormComponent = (
    <ProjectForm setOpen={setOpen} requestType={requestType} />
  );

  return isDesktop
    ? (
        <Dialog open={open} onOpenChange={handleOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription className="sr-only">Project Form Dialog</DialogDescription>
            </DialogHeader>
            {FormComponent}
          </DialogContent>
        </Dialog>
      )
    : (
        <Drawer open={open} onOpenChange={handleOpen}>
          <DrawerContent aria-describedby="Project Form Drawer">
            <div className="mx-auto w-full max-w-sm pb-8">
              <DrawerHeader className="pl-0">
                <DrawerTitle>{title}</DrawerTitle>
                <DrawerDescription className="sr-only">Project Form Dialog</DrawerDescription>
              </DrawerHeader>
              {FormComponent}
            </div>
          </DrawerContent>
        </Drawer>
      );
}

type ProjectFormProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  requestType: 'edit' | 'create';
};

function ProjectForm({ setOpen, requestType }: ProjectFormProps) {
  const { selectedProject, projects, setProjects } = useProjectStore();
  const [errorMessage, setErrorMessage] = useState('');

  const createProject = useCallback(async (value: ProjectBase) => {
    setErrorMessage('');
    try {
      const res = await fetch(`${config.BACKEND_URL}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: value?.name, description: value?.description }),
      });
      const json: Project | Message = await res.json();
      if ('message' in json) {
        setErrorMessage(json.message);
      }
      else {
        setProjects([...projects, json]);
        setOpen(false);
      }
    }
    catch {
      setErrorMessage('Network error. Please try again.');
    }
  }, [projects, setProjects, setOpen]);

  const editProject = useCallback(async (value: ProjectBase) => {
    if (!selectedProject)
      return;
    setErrorMessage('');
    try {
      const res = await fetch(`${config.BACKEND_URL}/projects/${selectedProject.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: value?.name, description: value?.description }),
      });
      const json: Project | Message = await res.json();
      if ('message' in json) {
        setErrorMessage(json.message);
      }
      else {
        const updatedProjects = projects.map(p => (p.id === selectedProject.id ? json : p));
        setProjects(updatedProjects);
        setOpen(false);
      }
    }
    catch {
      setErrorMessage('Network error. Please try again.');
    }
  }, [selectedProject, projects, setProjects, setOpen]);

  const form = useForm({
    defaultValues: selectedProject,
    onSubmit: async ({ value }) => {
      if (requestType === 'create') {
        await createProject(value as ProjectBase);
      }
      else {
        await editProject(value as ProjectBase);
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-2">
        <form.Field
          name="name"
          validators={{
            onChange: ({ value }) => {
              const result = ProjectZod.shape.name.safeParse(value);
              return result.success ? undefined : result.error.issues[0].message;
            },
          }}
        >
          {field => (
            <>
              <div className="grid w-full max-w-sm items-center gap-3">
                <Label htmlFor={field.name}>Name</Label>
                <Input
                  type="text"
                  id={field.name}
                  placeholder="Name"
                  name={field.name}
                  value={field.state.value}
                  onChange={e => field.handleChange(e.target.value)}
                  aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
                />
              </div>
              <ErrorInfo field={field} />
            </>
          )}
        </form.Field>
      </div>
      <div className="flex flex-col gap-2">
        <form.Field
          name="description"
          validators={{
            onChange: ({ value }) => {
              const result = ProjectZod.shape.description.safeParse(value);
              return result.success ? undefined : result.error.issues[0].message;
            },
          }}
        >
          {field => (
            <>
              <Label htmlFor={field.name}>Description</Label>
              <Textarea
                placeholder="Small description about your Project"
                className="resize-none"
                id={field.name}
                name={field.name}
                value={field.state.value}
                onChange={e => field.handleChange(e.target.value)}
                aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
              />
              <ErrorInfo field={field} />
            </>
          )}
        </form.Field>
      </div>
      {errorMessage && (
        <TypographyCaption className="text-destructive">
          {errorMessage}
        </TypographyCaption>
      )}
      <form.Subscribe selector={state => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <Button type="submit" disabled={!canSubmit}>
            {isSubmitting && <Loader2Icon className="animate-spin" />}
            Save
          </Button>
        )}
      </form.Subscribe>
      <Button variant="outline" type="button" onClick={() => setOpen(false)}>
        Cancel
      </Button>
    </form>
  );
}
