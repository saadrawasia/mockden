import { createFileRoute } from '@tanstack/react-router';
import { RequireAuth } from '../../components/requireAuth/requireAuth';
import DeleteAccountPage from '../../pages/user-settings/deleteAccount';

export const Route = createFileRoute('/user-settings/delete-account')({
	component: () => (
		<RequireAuth>
			<DeleteAccountPage />
		</RequireAuth>
	),
});
