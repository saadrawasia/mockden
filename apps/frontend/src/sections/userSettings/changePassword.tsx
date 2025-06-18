import { useUser } from '@clerk/clerk-react';
import { Button } from '@frontend/components/ui/button';
import { useUpdateUserPasswordMutation } from '@frontend/hooks/useUsers';
import { cn } from '@frontend/lib/utils';
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
  const updatePasswordMutation = useUpdateUserPasswordMutation();
  const { user } = useUser();

  const form = useForm({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    onSubmit: async ({ value }) => {
      if (!user?.passwordEnabled) {
        return;
      }
      // Do something with form data
      if (value.newPassword !== value.confirmPassword) {
        setErrorMessage('New Password and Confirm Password do not match');
        return;
      }
      setErrorMessage('');
      const mutate = await updatePasswordMutation.mutateAsync(
        {
          oldPassword: value.oldPassword,
          newPassword: value.newPassword,
        },
      );
      if (mutate.message !== 'Password updated.') {
        setErrorMessage(mutate.message);
      }
      else {
        form.reset();
      }
    },
  });

  return (
    <Card className={cn({ 'opacity-50': !user?.passwordEnabled })}>
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
              validators={{
                onChange: ({ value }) => {
                  if (value.length < 1) {
                    return 'Old Password cannot be empty';
                  }
                  return undefined;
                },
              }}
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
                        disabled={!user?.passwordEnabled}
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
              validators={{
                onChange: ({ value }) => {
                  if (value.length < 8) {
                    return 'Password should be atleast 8 characters.';
                  }
                  return undefined;
                },
              }}
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
                        disabled={!user?.passwordEnabled}
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
                  if (value.length < 1) {
                    return 'Confirm Password cannot be empty';
                  }
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
                        disabled={!user?.passwordEnabled}
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
              <Button type="submit" disabled={!canSubmit || !user?.passwordEnabled} className="self-end">
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
