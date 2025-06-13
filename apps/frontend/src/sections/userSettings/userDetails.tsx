import { Button } from '@frontend/components/ui/button';
import { UserDetailsZod } from '@shared/validators/userValidator';
import { useForm } from '@tanstack/react-form';
import { Loader2Icon } from 'lucide-react';
import { useState } from 'react';

import {
  TypographyCaption,
  TypographyH5,
} from '../../components/typography/typography';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { ErrorInfo } from '../../components/ui/errorInfo';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

export default function UserDetailsSection() {
  const [errorMessage, setErrorMessage] = useState('');

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
    },
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
          console.log(value);
          resolve();
        }, 1500);
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <TypographyH5>User Details</TypographyH5>
      </CardHeader>
      <CardContent>
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
                  const result = UserDetailsZod.shape.name.safeParse(value);
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
                          field.state.meta.isTouched
                          && !field.state.meta.isValid
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
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="Name"
              name="email"
              value="test@example.con"
              disabled
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
              <Button type="submit" disabled={!canSubmit} className="self-end">
                {isSubmitting && <Loader2Icon className="animate-spin" />}
                Save
              </Button>
            )}
          />
        </form>
      </CardContent>
    </Card>
  );
}
