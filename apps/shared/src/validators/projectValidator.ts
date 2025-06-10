import { z } from 'zod';

import type { ProjectDefinition, ZodError } from '../lib/types';

export const ProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .regex(/^[a-z]\w*$/i, 'Name must be a valid with only alphabets'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(100, 'Description cannot be more than 100 characters'),
}) satisfies z.ZodType<ProjectDefinition>;

export function validateProject(fields: unknown): ProjectDefinition | ZodError {
  try {
    return ProjectSchema.parse(fields);
  }
  catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(
        err => `${err.path.join('.')}: ${err.message}`,
      );

      return { error: `Invalid: ${errorMessages.join(', ')}` };
    }
    return { error: (error as Error).message };
  }
}
