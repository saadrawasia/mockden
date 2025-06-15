import type { Message, Project, ProjectBase } from '@shared/lib/types';

import { useMediaQuery } from '@frontend/hooks/useMediaQuery';
import config from '@frontend/lib/config';
import { useProjectStore } from '@frontend/stores/projectStore';
import { ProjectZod } from '@shared/validators/projectValidator';
import { useForm } from '@tanstack/react-form';
import { Loader2Icon } from 'lucide-react';
import { useState } from 'react';

import { TypographyCaption } from '../typography/typography';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '../ui/drawer';
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

  const handleOpen = (open = false) => {
    console.log('handleOpen', open);
    setOpen(open);
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpen}>
        <DialogContent
          className="sm:max-w-[425px]"
          aria-describedby="Project Form Dialog"
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <ProjectForm setOpen={setOpen} requestType={requestType} />
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer open={open} onOpenChange={handleOpen}>
      <DrawerContent aria-describedby="Project Form Drawer">
        <div className="mx-auto w-full max-w-sm pb-8">
          <DrawerHeader className="pl-0">
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
          <ProjectForm setOpen={setOpen} requestType={requestType} />
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
  const selectedProject = useProjectStore(state => state.selectedProject);
  const projects = useProjectStore(state => state.projects);
  const setProjects = useProjectStore(state => state.setProjects);
  const [errorMessage, setErrorMessage] = useState('');

  const createProject = async (value: ProjectBase) => {
    setErrorMessage('');
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
  };

  const editProject = async (value: ProjectBase) => {
    const project = selectedProject as Project;
    setErrorMessage('');
    const res = await fetch(`${config.BACKEND_URL}/projects/${project.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: value?.name, description: value?.description }),
    });
    const json: Project | Message = await res.json();
    if ('message' in json) {
      setErrorMessage(json.message);
    }
    else {
      const index = projects.findIndex(p => p.id === project.id);
      const updatedProjects = [...projects];
      updatedProjects[index] = json;
      setProjects(updatedProjects);
      setOpen(false);
    }
  };

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
        {/* A type-safe field component */}
        <form.Field
          name="name"
          validators={{
            onChange: ({ value }) => {
              const result = ProjectZod.shape.name.safeParse(value);
              if (!result.success) {
                // Return first Zod error message
                return result.error.issues[0].message;
              }
              return undefined;
            },
          }}
          children={(field) => {
            // Avoid hasty abstractions. Render props are great!
            return (
              <>
                <div className="grid w-full max-w-sm items-center gap-3">
                  <Label htmlFor={field.name}>Name</Label>
                  <Input
                    type="text"
                    id={field.name}
                    placeholder="Name"
                    name={field.name}
                    value={field.state.value}
                    // onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
                    aria-invalid={
                      field.state.meta.isTouched && !field.state.meta.isValid
                    }
                  />
                </div>

                <ErrorInfo field={field} />
              </>
            );
          }}
        />
      </div>
      <div className="flex flex-col gap-2">
        <form.Field
          name="description"
          validators={{
            onChange: ({ value }) => {
              const result = ProjectZod.shape.description.safeParse(value);
              if (!result.success) {
                // Return first Zod error message
                return result.error.issues[0].message;
              }
              return undefined;
            },
          }}
          children={field => (
            <>
              <Label htmlFor={field.name}>Description</Label>

              <Textarea
                placeholder="Small description about your Project"
                className="resize-none"
                id={field.name}
                name={field.name}
                value={field.state.value}
                // onBlur={field.handleBlur}
                onChange={e => field.handleChange(e.target.value)}
                aria-invalid={
                  field.state.meta.isTouched && !field.state.meta.isValid
                }
              />
              <ErrorInfo field={field} />
            </>
          )}
        />
      </div>
      {errorMessage && (
        <TypographyCaption className="text-destructive">
          {errorMessage}
        </TypographyCaption>
      )}
      <form.Subscribe
        selector={state => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <Button type="submit" disabled={!canSubmit}>
            {isSubmitting && <Loader2Icon className="animate-spin" />}
            Save
          </Button>
        )}
      />
      <Button variant="outline" onClick={() => setOpen(false)}>
        Cancel
      </Button>
    </form>
  );
}
