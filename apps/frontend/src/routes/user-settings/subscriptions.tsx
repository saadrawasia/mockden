import { createFileRoute } from '@tanstack/react-router';
import { RequireAuth } from '../../components/requireAuth/requireAuth';
import SubscriptionsPage from '../../pages/user-settings/subscriptions';

export const Route = createFileRoute('/user-settings/subscriptions')({
	component: () => (
		<RequireAuth>
			<SubscriptionsPage />
		</RequireAuth>
	),
});
