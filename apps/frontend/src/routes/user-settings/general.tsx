import { RequireAuth } from '@frontend/components/requireAuth/requireAuth';
import { createFileRoute } from '@tanstack/react-router';
import UserSettingsPage from '../../pages/user-settings/general';

export const Route = createFileRoute('/user-settings/general')({
	component: () => (
		<RequireAuth>
			<UserSettingsPage />
		</RequireAuth>
	),
});
