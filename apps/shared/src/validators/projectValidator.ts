import { z } from 'zod';

import type { ProjectBase, ZodError } from '../lib/types';

export const ProjectZod = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(25, 'Name cannot be more than 25 characters')
    .regex(/^[A-Z][A-Z0-9 ]*$/i, 'Name must be a valid e.g Project, Project 1'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(100, 'Description cannot be more than 100 characters'),
}) satisfies z.ZodType<ProjectBase>;

export function validateProject(fields: unknown): ProjectBase | ZodError {
  try {
    return ProjectZod.parse(fields);
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
