import { Button } from '@frontend/components/ui/button';
import { useForm } from '@tanstack/react-form';
import { Loader2Icon } from 'lucide-react';

import {
  TypographyH5,
  TypographyP,
} from '../../components/typography/typography';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Input } from '../../components/ui/input';

export default function DeleteAccountSection() {
  const deleteKey = '@mockden/api-key';
  const form = useForm({
    defaultValues: {
      deleteText: '',
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
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
        <TypographyH5>Delete Account</TypographyH5>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <TypographyP className="text-muted-foreground">This action is permanent and cannot be undone. Deleting your account will remove all Projects, Schemas and Records.</TypographyP>
        <TypographyP className="text-muted-foreground">
          To confirm, please type
          {' '}
          <span className="text-foreground font-semibold">{deleteKey}</span>
          {' '}
          in the box below and click the button.
        </TypographyP>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className=" flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            {/* A type-safe field component */}
            <form.Field
              name="deleteText"
              validators={{
                onChange: ({ value }) => {
                  if (value !== deleteKey) {
                    return true;
                  }
                  return undefined;
                },
              }}
              children={(field) => {
                // Avoid hasty abstractions. Render props are great!
                return (
                  <>
                    <div className="grid w-full items-center gap-3">
                      <Input
                        type="text"
                        id={field.name}
                        placeholder={deleteKey}
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
                  </>
                );
              }}
            />
          </div>

          <form.Subscribe
            selector={state => [state.canSubmit, state.isSubmitting, state.isDirty, state.isPristine]}
            children={([canSubmit, isSubmitting, isDirty, isPristine]) => (
              <Button type="submit" disabled={!canSubmit || isPristine || !isDirty} className="self-end" variant="destructive">
                {isSubmitting && <Loader2Icon className="animate-spin" />}
                Delete
              </Button>
            )}
          />
        </form>
      </CardContent>
    </Card>
  );
}
