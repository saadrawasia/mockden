import { RequireAuth } from '@frontend/components/requireAuth/requireAuth';
import { createFileRoute } from '@tanstack/react-router';
import UserSettingsPage from '../../pages/account-settings/general';

export const Route = createFileRoute('/account-settings/general')({
	component: () => (
		<RequireAuth>
			<UserSettingsPage />
		</RequireAuth>
	),
});
