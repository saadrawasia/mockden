/* eslint-disable unicorn/filename-case */
import UserSettingsPage from '@frontend/pages/userSettings';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/user-settings')({
  component: UserSettingsPage,
});
