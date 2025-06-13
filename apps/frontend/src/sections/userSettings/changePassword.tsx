import PasswordStrengthIndicator from '@frontend/components/passwordStrength/passwordStrengthIndicator';
import { Button } from '@frontend/components/ui/button';
import { useForm } from '@tanstack/react-form';
import { Eye, EyeClosed, Loader2Icon } from 'lucide-react';
import { useState } from 'react';

import {
  TypographyCaption,
  TypographyH5,
} from '../../components/typography/typography';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { ErrorInfo } from '../../components/ui/errorInfo';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

export default function ChangePasswordSection() {
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
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
        <TypographyH5>Change Password</TypographyH5>
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
              name="oldPassword"
              children={(field) => {
                return (
                  <>
                    <div className="grid w-full items-center gap-3">
                      <Label htmlFor={field.name}>Old Password</Label>
                      <Input
                        type="password"
                        id={field.name}
                        placeholder="Old Password"
                        name={field.name}
                        value={field.state.value}
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
            {/* A type-safe field component */}
            <form.Field
              name="newPassword"
              children={(field) => {
                return (
                  <>
                    <div className="grid w-full items-center gap-3">
                      <Label htmlFor={field.name}>New Password</Label>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        id={field.name}
                        placeholder="New Password"
                        name={field.name}
                        value={field.state.value}
                        onChange={e => field.handleChange(e.target.value)}
                        aria-invalid={
                          field.state.meta.isTouched
                          && !field.state.meta.isValid
                        }
                        endIcon={
                          showPassword
                            ? (
                                <Eye onClick={() => setShowPassword(false)} />
                              )
                            : (
                                <EyeClosed onClick={() => setShowPassword(true)} />
                              )
                        }
                      />
                    </div>
                    <ErrorInfo field={field} />
                    <PasswordStrengthIndicator
                      password={field.state.value}
                      isVisible={field.state.meta.isTouched}
                    />
                  </>
                );
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            {/* A type-safe field component */}
            <form.Field
              name="confirmPassword"
              validators={{
                onChange: ({ value }) => {
                  if (value !== form.getFieldValue('newPassword')) {
                    return 'New Password and Confirm Password do not match.';
                  }
                  return undefined;
                },
              }}
              children={(field) => {
                return (
                  <>
                    <div className="grid w-full items-center gap-3">
                      <Label htmlFor={field.name}>Confirm Password</Label>
                      <Input
                        type="password"
                        id={field.name}
                        placeholder="Confirm Password"
                        name={field.name}
                        value={field.state.value}
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
