/* eslint-disable unicorn/filename-case */
import { RequireAuth } from '@frontend/components/requireAuth/requireAuth';
import UserSettingsPage from '@frontend/pages/userSettings';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/user-settings')({
  component: () => (
    <RequireAuth>
      <UserSettingsPage />
    </RequireAuth>
  ),
});
