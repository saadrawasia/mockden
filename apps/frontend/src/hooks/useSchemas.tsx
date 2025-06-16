import type { Message, Schema } from '@shared/lib/types';

import config from '@frontend/lib/config';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

const API_URL = (projectId: string) => `${config.BACKEND_URL}/projects/${projectId}/schemas`; // adjust based on your backend

// Fetch schemas
export function useSchemasQuery(projectId: string) {
  return useSuspenseQuery<Schema[]>({
    queryKey: ['schemas'],
    queryFn: async () => {
      const res = await fetch(API_URL(projectId));
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

  return useMutation<Schema | Message, unknown, { projectId: string; newSchema: Partial<Schema> }>({
    mutationFn: async ({ projectId, newSchema }) => {
      const res = await fetch(API_URL(projectId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

    onSuccess: (result) => {
      if (!('message' in result)) {
        queryClient.setQueryData<Schema[]>(['schemas'], (old = []) => [...old, result]);
      }
    },
  });
}

// Edit schema
export function useEditSchemaMutation() {
  const queryClient = useQueryClient();

  return useMutation<Schema | Message, unknown, { projectId: string; id: string; schema: Partial<Schema> }>({
    mutationFn: async ({ id, schema, projectId }) => {
      const res = await fetch(`${API_URL(projectId)}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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

    onSuccess: (result) => {
      if (!('message' in result)) {
        queryClient.setQueryData<Schema[]>(['schemas'], (old = []) =>
          old.map(p => (p.id === result.id ? result : p)));
      }
    },
  });
}

// Delete schema
export function useDeleteSchemaMutation() {
  const queryClient = useQueryClient();

  return useMutation<Message | { id: string }, unknown, { id: string; projectId: string }>({
    mutationFn: async ({ id, projectId }) => {
      try {
        const res = await fetch(`${API_URL(projectId)}/${id}`, {
          method: 'DELETE',
        });

        const data = await res.json();

        if (res.status === 400) {
          const message = data?.message || 'Failed to delete schema';
          toast.error('Something went wrong!', { description: message });
          return { message };
        }
        else {
          return { id, message: data.message };
        }
      }
      catch {
        toast.error('Something went wrong!', { description: 'Network Error!' });
        return { message: 'Network Error!' };
      }
    },

    onSuccess: (result) => {
      if (('id' in result)) {
        queryClient.setQueryData<Schema[]>(['schemas'], (old = []) =>
          old.filter(p => p.id !== result.id));
      }
    },
  });
}
