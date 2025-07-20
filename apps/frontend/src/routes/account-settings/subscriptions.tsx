import { createFileRoute, redirect } from '@tanstack/react-router';
import { RequireAuth } from '../../components/requireAuth/requireAuth';
import SubscriptionsPage from '../../pages/account-settings/subscriptions';

export const Route = createFileRoute('/account-settings/subscriptions')({
	component: () => (
		<RequireAuth>
			<SubscriptionsPage />
		</RequireAuth>
	),
	loader: async ctx => {
		const params = new URLSearchParams(ctx.location.search as string);
		const success = params.get('success');

		if (success === 'true') {
			await new Promise(resolve => setTimeout(resolve, 3000));
			throw redirect({ to: '/account-settings/subscriptions', search: {} });
		}
	},
	pendingComponent: () => <div>Loading...</div>,
});
