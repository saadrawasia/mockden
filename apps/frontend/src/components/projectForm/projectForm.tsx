import type { ProjectDefinition } from '@shared/lib/types';

import { ProjectSchema } from '@shared/validators/projectValidator';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';

import { TypographyCaption } from '../typography/typography';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../ui/drawer';
import { ErrorInfo } from '../ui/errorInfo';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

type ProjectFormDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDesktop: boolean;
  project: ProjectDefinition;
  title: string;
  button: React.ReactNode;
};

export default function ProjectFormDialog({
  open,
  setOpen,
  isDesktop,
  project,
  title,
  button,
}: ProjectFormDialogProps) {
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{button}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <ProjectForm project={project} setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{button}</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm pb-8">
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
          <ProjectForm project={project} setOpen={setOpen} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

type ProjectFormProps = {
  project: ProjectDefinition;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
function ProjectForm({ project, setOpen }: ProjectFormProps) {
  const [errorMessage, setErrorMessage] = useState('');

  const form = useForm({
    defaultValues: project,
    onSubmit: ({ value }) => {
      setErrorMessage('');
      setOpen(false);
      console.log(value);
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
            onBlur: ({ value }) => {
              const result = ProjectSchema.shape.name.safeParse(value);
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
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
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
            onBlur: ({ value }) => {
              const result = ProjectSchema.shape.description.safeParse(value);
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
                onBlur={field.handleBlur}
                onChange={e => field.handleChange(e.target.value)}
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
            {isSubmitting ? '...' : 'Submit'}
          </Button>
        )}
      />
      <Button variant="outline" onClick={() => setOpen(false)}>
        Cancel
      </Button>
    </form>
  );
}
