import { z } from 'zod';

export const UserDetailsZod = z.object({
	name: z
		.string()
		.min(1, 'Name is required')
		.max(25, 'Name cannot be more than 25 characters')
		.regex(/^[A-Z][A-Z ]*$/i, 'Name is not valid'),
	email: z.string().email().min(1, 'Email is required'),
});
