import type { Message } from '@/apps/shared/src/lib/types';
import { useAuth } from '@clerk/clerk-react';
import type { Subscription } from '@paddle/paddle-node-sdk';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import config from '../lib/config';

const API_URL = `${config.BACKEND_URL}/auth/subscriptions`;

export function useSubscriptionsQuery(subId: string | null) {
	const { getToken } = useAuth();

	return useSuspenseQuery<Subscription>({
		queryKey: ['paddle-subscription'],
		queryFn: async () => {
			if (!subId) {
				return {} as Subscription;
			}
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

export function useCancelSubscriptionMutation() {
	const { getToken } = useAuth();

	return useMutation<Message, unknown, { subId: string }>({
		mutationFn: async ({ subId }) => {
			const token = await getToken();
			const res = await fetch(`${API_URL}/${subId}`, {
				method: 'DELETE',
				headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
			});

			const data = await res.json();

			if (res.status === 400) {
				const message = data?.message || 'Failed to delete Subscription';
				toast.error('Something went wrong!', {
					description: message,
				});
				return { message };
			}

			return data;
		},
	});
}
