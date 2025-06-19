import type { Project, SchemaBase } from '@shared/lib/types';

import { useMediaQuery } from '@frontend/hooks/useMediaQuery';
import { useCreateSchemaMutation, useEditSchemaMutation } from '@frontend/hooks/useSchemas';
import { useSchemaStore } from '@frontend/stores/schemasStore';
import { DialogDescription } from '@radix-ui/react-dialog';
import {
  SchemaZod,
  validateSchemaDefinition,
} from '@shared/validators/schemaValidator';
import { useForm } from '@tanstack/react-form';
import { Loader2Icon } from 'lucide-react';
import { useCallback, useState } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-tomorrow';
import 'ace-builds/src-noconflict/ext-language_tools';

import { cn } from '../../lib/utils';
import { TypographyCaption } from '../typography/typography';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '../ui/drawer';
import { ErrorInfo } from '../ui/errorInfo';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scrollArea';
import { Separator } from '../ui/separator';

type SchemaFormDialogProps = {
  title: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  project: Project;
};

export default function SchemaFormDialog({
  title,
  open,
  setOpen,
  project,
}: SchemaFormDialogProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const requestType = title.includes('Edit') ? 'edit' : 'create';

  const handleOpen = useCallback((open = false) => setOpen(open), [setOpen]);

  const FormComponent = (
    <SchemaForm setOpen={setOpen} requestType={requestType} project={project} />
  );

  const exampleSchema = `[
  {
    "name": "id",
    "type": "number",
    "primary": true,
    "nullable": false
  },
  {
    "name": "email",
    "type": "email",
    "primary": false,
    "nullable": false
  },
  {
    "name": "age",
    "type": "number",
    "primary": false,
    "nullable": true,
    "validation": {
      "min": 0,
      "max": 150
    }
  },
  {
    "name": "username",
    "type": "string",
    "primary": false,
    "nullable": false,
    "validation": {
      "minLength": 3,
      "maxLength": 30,
      "pattern": "^[a-zA-Z0-9_]+$"
    }
  }
]`;

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpen}>
        <DialogContent className="w-full sm:max-w-6xl">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className="sr-only">
              Schema Form Dialog
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            {FormComponent}
            <Separator orientation="vertical" />
            <div className="flex flex-auto flex-col gap-2">
              <Label>Example:</Label>
              <div
                className={cn(
                  'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input shadow-xs flex w-full min-w-0 rounded-md border bg-white text-base outline-none transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                  'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
                )}
              >
                <AceEditor
                  mode="json"
                  theme="tomorrow"
                  fontSize={14}
                  lineHeight={19}
                  showPrintMargin={true}
                  showGutter={true}
                  highlightActiveLine={true}
                  name="example"
                  value={exampleSchema}
                  width="100%"
                  maxLines={Infinity}
                  readOnly={true}
                  setOptions={{
                    enableBasicAutocompletion: false,
                    enableLiveAutocompletion: false,
                    enableSnippets: false,
                    enableMobileMenu: false,
                    showLineNumbers: false,
                    tabSize: 2,
                    printMargin: 8,
                    useWorker: false,
                  }}
                  className="rounded-md"
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer open={open} onOpenChange={handleOpen}>
      <DrawerContent className="max-h-[80vh]">
        <div className="mx-auto w-full max-w-sm  pb-8 ">
          <DrawerHeader className="px-2">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription className="sr-only">
              Schema Form Dialog
            </DrawerDescription>
          </DrawerHeader>
          <ScrollArea className="max-h-[60vh] overflow-auto px-2">
            {FormComponent}
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

type SchemaFormProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  requestType: 'edit' | 'create';
  project: Project;
};

function SchemaForm({ setOpen, requestType, project }: SchemaFormProps) {
  const selectedSchema = useSchemaStore(state => state.selectedSchema);

  const isDesktop = useMediaQuery('(min-width: 768px)');

  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const createSchemaMutation = useCreateSchemaMutation();
  const editSchemaMutation = useEditSchemaMutation();

  const createSchema = useCallback(
    async (value: SchemaBase) => {
      setErrorMessage('');
      setIsSaving(true);
      try {
        const mutate = await createSchemaMutation.mutateAsync(
          { projectId: project.id, newSchema: { name: value?.name, fields: value?.fields, fakeData: value.fakeData } },

        );
        if ('message' in mutate) {
          setErrorMessage(mutate.message);
        }
        else {
          setOpen(false);
        }
      }
      catch {
        setErrorMessage('Network error. Please try again.');
      }
      finally {
        setIsSaving(false);
      }
    },
    [createSchemaMutation, setOpen, project],
  );

  const editSchema = useCallback(
    async (value: SchemaBase) => {
      if (!selectedSchema)
        return;
      setErrorMessage('');
      setIsSaving(true);
      try {
        const mutate = await editSchemaMutation.mutateAsync(
          {
            id: selectedSchema.id,
            projectId: project.id,
            schema: { name: value?.name, fields: value?.fields, fakeData: value.fakeData },
          },
        );
        if ('message' in mutate) {
          setErrorMessage(mutate.message);
        }
        else {
          setOpen(false);
        }
      }
      catch {
        setErrorMessage('Network error. Please try again.');
      }
      finally {
        setIsSaving(false);
      }
    },
    [selectedSchema, editSchemaMutation, setOpen, project],
  );

  const form = useForm({
    defaultValues: { ...selectedSchema, fields: Array.isArray(selectedSchema?.fields) ? JSON.stringify(selectedSchema?.fields, undefined, 2) : selectedSchema?.fields },
    onSubmit: async ({ value }) => {
      if (requestType === 'create') {
        await createSchema(value as SchemaBase);
      }
      else {
        await editSchema(value as SchemaBase);
      }
    },
  });

  const validateSchema = (value: string): string | void => {
    let schema = {};
    try {
      schema = JSON.parse(value);
    }
    catch {
      return 'Invalid Scheme JSON';
    }

    const validate = validateSchemaDefinition(schema);
    if ('error' in validate) {
      return validate.error;
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="mx-auto flex max-w-xs flex-col gap-4 md:max-w-md lg:max-w-xl"
    >
      <div className="flex flex-col gap-2">
        {/* A type-safe field component */}
        <form.Field
          name="name"
          validators={{
            onChange: ({ value }) => {
              const result = SchemaZod.shape.name.safeParse(value);
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
                <div className="grid w-full items-center gap-3">
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
                    autoComplete="off"
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
          name="fields"
          validators={{
            onBlur: ({ value }) => validateSchema(value ?? ''),
          }}
          children={field => (
            <>
              <Label>Schema</Label>
              <div
                className={cn(
                  'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input shadow-xs flex w-full min-w-0 rounded-md border bg-white text-base outline-none transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                  'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
                  {
                    'ring-destructive/20 dark:ring-destructive/40 border-destructive':
                      field.state.meta.isTouched && !field.state.meta.isValid,
                  },
                )}
              >
                <AceEditor
                  mode="json"
                  theme="tomorrow"
                  fontSize={14}
                  lineHeight={19}
                  showPrintMargin={true}
                  showGutter={true}
                  highlightActiveLine={true}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={value => field.handleChange(value)}
                  width="100%"
                  height={isDesktop ? '500px' : '250px'}
                  setOptions={{
                    enableBasicAutocompletion: false,
                    enableLiveAutocompletion: false,
                    enableSnippets: false,
                    enableMobileMenu: false,
                    showLineNumbers: false,
                    tabSize: 2,
                    printMargin: 8,
                    useWorker: false,
                  }}
                  className="rounded-md"
                />
              </div>

              <ErrorInfo field={field} />
            </>
          )}
        />
      </div>

      <form.Field
        name="fakeData"
        validators={{
          onChange: ({ value }) => {
            const result = SchemaZod.shape.fakeData.safeParse(value);
            if (!result.success) {
              // Return first Zod error message
              return result.error.issues[0].message;
            }
            return undefined;
          },
        }}
        children={field => (
          <>
            <Label className="hover:bg-accent/50 has-[[aria-checked=true]]:border-primary has-[[aria-checked=true]]:bg-neutral-50 flex cursor-pointer items-start gap-3 rounded-lg border p-3">
              <Checkbox
                id="toggle-2"
                name={field.name}
                checked={field.state.value}
                // onBlur={field.handleBlur}
                onCheckedChange={() => field.handleChange(!field.state.value)}
                className="data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white"
              />
              <div className="grid gap-1.5 font-normal">
                <p className="text-sm font-medium leading-none">
                  Create Fake Entries
                </p>
                <p className="text-muted-foreground text-sm">
                  Based on your Schema we will create 10 fake entries in your
                  records to get you started.
                </p>
              </div>
            </Label>
          </>
        )}
      />
      {errorMessage && (
        <TypographyCaption className="text-destructive">
          {errorMessage}
        </TypographyCaption>
      )}

      {
        requestType === 'edit' && <TypographyCaption className="italic text-muted-foreground">* Editing the schema with remove all the previous records.</TypographyCaption>
      }
      <form.Subscribe
        selector={state => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (

          <Button type="submit" disabled={!canSubmit || isSaving}>
            {isSubmitting && <Loader2Icon className="animate-spin" />}
            Save
          </Button>
        )}
      />
      <Button variant="outline" disabled={isSaving} onClick={() => setOpen(false)}>
        Cancel
      </Button>
    </form>
  );
}
