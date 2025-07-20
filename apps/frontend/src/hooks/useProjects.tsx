import type { Message, Project } from '@shared/lib/types';

import { useAuth } from '@clerk/clerk-react';
import config from '@frontend/lib/config';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

const API_URL = `${config.BACKEND_URL}/auth/projects`; // adjust based on your backend

// Fetch projects
export function useProjectsQuery(withSchemas = false) {
	const { getToken } = useAuth();

	return useSuspenseQuery<Project[]>({
		queryKey: ['projects'],
		queryFn: async () => {
			const token = await getToken();
			const res = await fetch(`${API_URL}?withSchemas=${withSchemas}`, {
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			});
			const data = await res.json();

			if (!res.ok || !Array.isArray(data)) {
				const message = data?.message || 'Failed to fetch projects';
				toast.error('Something went wrong!', {
					description: message,
				});
				return [] as Project[];
			}

			return data as Project[];
		},
	});
}

// Create project
export function useCreateProjectMutation() {
	const queryClient = useQueryClient();
	const { getToken } = useAuth();

	return useMutation<Project | Message, unknown, Pick<Project, 'name' | 'description'>>({
		mutationFn: async newProject => {
			const token = await getToken();

			const res = await fetch(API_URL, {
				method: 'POST',
				headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
				body: JSON.stringify(newProject),
			});

			const data = await res.json();

			if (!res.ok || data.message) {
				const message = data?.message || 'Failed to create project';
				toast.error('Something went wrong!', {
					description: message,
				});
				return { message };
			}

			return data as Project;
		},

		onSuccess: result => {
			if (!('message' in result)) {
				queryClient.setQueryData<Project[]>(['projects'], (old = []) => [...old, result]);
			}
		},
	});
}

// Edit project
export function useEditProjectMutation() {
	const queryClient = useQueryClient();
	const { getToken } = useAuth();

	return useMutation<Project | Message, unknown, { id: number; project: Partial<Project> }>({
		mutationFn: async ({ id, project }) => {
			const token = await getToken();
			const res = await fetch(`${API_URL}/${id}`, {
				method: 'PUT',
				headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
				body: JSON.stringify(project),
			});

			const data = await res.json();

			if (!res.ok || data.message) {
				const message = data?.message || 'Failed to update project';
				toast.error('Something went wrong!', {
					description: message,
				});
				return { message };
			}

			return data as Project;
		},

		onSuccess: result => {
			if (!('message' in result)) {
				queryClient.setQueryData<Project[]>(['projects'], (old = []) =>
					old.map(p => (p.id === result.id ? result : p))
				);
			}
		},
	});
}

// Delete project
export function useDeleteProjectMutation() {
	const queryClient = useQueryClient();
	const { getToken } = useAuth();

	return useMutation<Message | { id: number }, unknown, number>({
		mutationFn: async id => {
			const token = await getToken();
			try {
				const res = await fetch(`${API_URL}/${id}`, {
					method: 'DELETE',
					headers: { Authorization: `Bearer ${token}` },
				});

				const data = await res.json();

				if (res.status === 400) {
					const message = data?.message || 'Failed to delete project';
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
				queryClient.setQueryData<Project[]>(['projects'], (old = []) =>
					old.filter(p => p.id !== result.id)
				);
			}
		},
	});
}
