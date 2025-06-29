import type { Message, User } from "@shared/lib/types";

import { useAuth } from "@clerk/clerk-react";
import config from "@frontend/lib/config";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const API_URL = `${config.BACKEND_URL}/users`;

export function useEditUserMutation() {
	const { getToken } = useAuth();

	return useMutation<Message, unknown, { firstName: string; lastName: string }>({
		mutationFn: async ({ firstName, lastName }) => {
			const token = await getToken();
			const res = await fetch(`${API_URL}`, {
				method: "PUT",
				headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
				body: JSON.stringify({ firstName, lastName }),
			});

			const data = await res.json();

			if (res.status === 400) {
				const message = data?.message || "Failed to update user";
				toast.error("Something went wrong!", {
					description: message,
				});
				return { message };
			}
			toast.success("User Updated.");

			return data;
		},
	});
}

export function useUpdateUserPasswordMutation() {
	const { getToken } = useAuth();

	return useMutation<Message, unknown, { oldPassword: string; newPassword: string }>({
		mutationFn: async ({ oldPassword, newPassword }) => {
			const token = await getToken();
			const res = await fetch(`${API_URL}/update-password`, {
				method: "PUT",
				headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
				body: JSON.stringify({ oldPassword, newPassword }),
			});

			const data = await res.json();

			if (res.status === 400) {
				const message = data?.message || "Failed to update Password";
				toast.error("Something went wrong!", {
					description: message,
				});
				return { message };
			}
			toast.success("Password Updated.");

			return data;
		},
	});
}

export function useDeleteUserMutation() {
	const { getToken } = useAuth();

	return useMutation<Message, unknown, { id: string }>({
		mutationFn: async ({ id }) => {
			const token = await getToken();
			const res = await fetch(`${API_URL}/delete-user`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
				body: JSON.stringify({ clerkUserId: id }),
			});

			const data = await res.json();

			if (res.status === 400) {
				const message = data?.message || "Failed to delete User";
				toast.error("Something went wrong!", {
					description: message,
				});
				return { message };
			}

			return data;
		},
	});
}

export function useUsersQuery() {
	const { getToken } = useAuth();

	return useSuspenseQuery<User>({
		queryKey: ["user"],
		queryFn: async () => {
			const token = await getToken();
			const res = await fetch(API_URL, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});
			const data = await res.json();

			return data as User;
		},
	});
}
