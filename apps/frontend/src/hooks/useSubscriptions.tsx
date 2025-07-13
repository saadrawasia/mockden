import { useAuth } from '@clerk/clerk-react';
import type { Subscription } from '@paddle/paddle-node-sdk';
import { useSuspenseQuery } from '@tanstack/react-query';
import config from '../lib/config';

const API_URL = `${config.BACKEND_URL}/subscriptions`;

export function useSubscriptionsQuery(subId: string) {
	const { getToken } = useAuth();

	return useSuspenseQuery<Subscription>({
		queryKey: ['paddle-subscription'],
		queryFn: async () => {
			const token = await getToken();
			const res = await fetch(`${API_URL}/${subId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			});
			const data = await res.json();

			return data as Subscription;
		},
	});
}
