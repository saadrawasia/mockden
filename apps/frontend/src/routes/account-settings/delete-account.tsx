import { createFileRoute } from '@tanstack/react-router';
import { RequireAuth } from '../../components/requireAuth/requireAuth';
import DeleteAccountPage from '../../pages/account-settings/deleteAccount';

export const Route = createFileRoute('/account-settings/delete-account')({
	component: () => (
		<RequireAuth>
			<DeleteAccountPage />
		</RequireAuth>
	),
});
