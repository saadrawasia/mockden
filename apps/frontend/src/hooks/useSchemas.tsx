import type { Message, Schema } from '@shared/lib/types';

import { useAuth } from '@clerk/clerk-react';
import config from '@frontend/lib/config';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

const API_URL = (projectId: number) => `${config.BACKEND_URL}/auth/projects/${projectId}/schemas`; // adjust based on your backend

// Fetch schemas
export function useSchemasQuery(projectId: number) {
	const { getToken } = useAuth();
	return useSuspenseQuery<Schema[]>({
		queryKey: ['schemas'],
		queryFn: async () => {
			const token = await getToken();
			const res = await fetch(API_URL(projectId), {
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			});
			const data = await res.json();

			if (!res.ok || !Array.isArray(data)) {
				const message = data?.message || 'Failed to fetch schemas';
				toast.error('Something went wrong!', {
					description: message,
				});
				return [] as Schema[];
			}

			return data as Schema[];
		},
	});
}

// Create schema
export function useCreateSchemaMutation() {
	const queryClient = useQueryClient();
	const { getToken } = useAuth();

	return useMutation<Schema | Message, unknown, { projectId: number; newSchema: Partial<Schema> }>({
		mutationFn: async ({ projectId, newSchema }) => {
			const token = await getToken();
			const res = await fetch(API_URL(projectId), {
				method: 'POST',
				headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
				body: JSON.stringify(newSchema),
			});

			const data = await res.json();

			if (!res.ok || data.message) {
				const message = data?.message || 'Failed to create schema';
				toast.error('Something went wrong!', {
					description: message,
				});
				return { message };
			}

			return data as Schema;
		},

		onSuccess: result => {
			if (!('message' in result)) {
				queryClient.setQueryData<Schema[]>(['schemas'], (old = []) => [...old, result]);
			}
		},
	});
}

// Edit schema
export function useEditSchemaMutation() {
	const queryClient = useQueryClient();
	const { getToken } = useAuth();

	return useMutation<
		Schema | Message,
		unknown,
		{ projectId: number; id: number; schema: Partial<Schema> }
	>({
		mutationFn: async ({ id, schema, projectId }) => {
			const token = await getToken();
			const res = await fetch(`${API_URL(projectId)}/${id}`, {
				method: 'PUT',
				headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
				body: JSON.stringify(schema),
			});

			const data = await res.json();

			if (!res.ok || data.message) {
				const message = data?.message || 'Failed to update schema';
				toast.error('Something went wrong!', {
					description: message,
				});
				return { message };
			}

			return data as Schema;
		},

		onSuccess: result => {
			if (!('message' in result)) {
				queryClient.setQueryData<Schema[]>(['schemas'], (old = []) =>
					old.map(p => (p.id === result.id ? result : p))
				);
			}
		},
	});
}

// Delete schema
export function useDeleteSchemaMutation() {
	const queryClient = useQueryClient();
	const { getToken } = useAuth();

	return useMutation<Message | { id: number }, unknown, { id: number; projectId: number }>({
		mutationFn: async ({ id, projectId }) => {
			const token = await getToken();
			try {
				const res = await fetch(`${API_URL(projectId)}/${id}`, {
					method: 'DELETE',
					headers: { Authorization: `Bearer ${token}` },
				});

				const data = await res.json();

				if (res.status === 400) {
					const message = data?.message || 'Failed to delete schema';
					toast.error('Something went wrong!', { description: message });
					return { message };
				}
				return { id, message: data.message };
			} catch {
				toast.error('Something went wrong!', { description: 'Network Error!' });
				return { message: 'Network Error!' };
			}
		},

		onSuccess: result => {
			if ('id' in result) {
				queryClient.setQueryData<Schema[]>(['schemas'], (old = []) =>
					old.filter(p => p.id !== result.id)
				);
			}
		},
	});
}
