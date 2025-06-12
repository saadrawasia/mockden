import type { SchemaBase } from '@shared/lib/types';

import {
  SchemaZod,
  validateSchemaDefinition,
} from '@shared/validators/schemaValidator';
import { useForm } from '@tanstack/react-form';
import { Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import AceEditor from 'react-ace';

import { cn } from '../../lib/utils';
import { TypographyCaption } from '../typography/typography';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '../ui/drawer';
import { ErrorInfo } from '../ui/errorInfo';

import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-tomorrow';
import 'ace-builds/src-noconflict/ext-language_tools';

import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scrollArea';
import { Separator } from '../ui/separator';

type SchemaFormDialogProps = {
  isDesktop: boolean;
  schema: SchemaBase;
  title: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SchemaFormDialog({
  isDesktop,
  schema,
  title,
  open,
  setOpen,
}: SchemaFormDialogProps) {
  const handleOpen = (open = false) => {
    console.log('handleOpen', open);
    setOpen(open);
  };

  const exampleSchema = `[
  {
    "name": "id",
    "type": "number",
    "primary": true,
    "nullable": false
  },
  {
    "name": "email",
    "type": "string",
    "primary": false,
    "nullable": false,
    "validation": {
      "format": "email",
      "maxLength": 255
    }
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
        <DialogContent className="sm:max-w-6xl w-full">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="flex gap-2">
            <SchemaForm schema={schema} setOpen={setOpen} isDesktop={isDesktop} />
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
                    rendererOptions: {
                      padding: 16, // adjust as needed
                    },
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
          </DrawerHeader>
          <ScrollArea className="px-2 max-h-[60vh] overflow-auto">
            <SchemaForm schema={schema} setOpen={setOpen} isDesktop={isDesktop} />
          </ScrollArea>

        </div>
      </DrawerContent>
    </Drawer>
  );
}

type SchemaFormProps = {
  schema: SchemaBase;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDesktop: boolean;
};

function SchemaForm({ schema, setOpen, isDesktop }: SchemaFormProps) {
  const [errorMessage, setErrorMessage] = useState('');

  const form = useForm({
    defaultValues: schema,
    onSubmit: async ({ value }) => {
      // Do something with form data
      setErrorMessage('');
      // const schema = JSON.stringify(JSON.parse(value.fields), null, 4); // prettify json
      // const res = await fetch('http://localhost:4000/schemas', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name: value.name, schema }),
      // });
      // const json: Schema | Message = await res.json();
      // if ('message' in json) {
      //   setErrorMessage(json.message);
      // }
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          setOpen(false);
          console.log(value);
          resolve();
        }, 1500);
      });
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
      className="flex max-w-xs md:max-w-md lg:max-w-xl flex-col gap-4"
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
            onBlur: ({ value }) => validateSchema(value),
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
                    rendererOptions: {
                      padding: 16, // adjust as needed
                    },
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
            <Label className="hover:bg-accent/50 has-[[aria-checked=true]]:border-green-600 has-[[aria-checked=true]]:bg-green-50 dark:has-[[aria-checked=true]]:border-green-900 dark:has-[[aria-checked=true]]:bg-green-950 flex cursor-pointer items-start gap-3 rounded-lg border p-3">
              <Checkbox
                id="toggle-2"
                name={field.name}
                checked={field.state.value}
                // onBlur={field.handleBlur}
                onCheckedChange={() => field.handleChange(!field.state.value)}
                className="data-[state=checked]:border-green-600 data-[state=checked]:bg-green-600 data-[state=checked]:text-white dark:data-[state=checked]:border-green-700 dark:data-[state=checked]:bg-green-700"
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
