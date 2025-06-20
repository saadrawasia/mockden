import type { NextFunction, Request, Response } from 'express';

import db from '@backend/db/client';
import { apiUsage } from '@backend/db/schema';
import { getProjectWithUserAndSchemas } from '@backend/services/projectService';
import { limitations } from '@shared/lib/config';
import { and, eq } from 'drizzle-orm';

// import { apiUsage } from '../db/schema';

export async function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const projectHeader = req.headers['x-mockden-header'] as string;
  if (!projectHeader)
    return res.status(401).send('Unauthorized');

  const { projectSlug, schemaSlug } = req.params;

  const project = await getProjectWithUserAndSchemas({ projectHeader, projectSlug, schemaSlug });

  if (!project || project.schemas.length === 0) {
    return res.status(404).json({ message: 'Project or schema not found.' });
  }

  const today = new Date().toISOString().split('T')[0];

  const [record] = await db
    .select()
    .from(apiUsage)
    .where(and(eq(apiUsage.userId, project.userId), eq(apiUsage.date, today)));

  if (!record) {
    await db
      .insert(apiUsage)
      .values({ userId: project.userId, date: today, count: 1 })
      .returning();

    return next();
  }

  const planTier = (project.user.planTier === 'pro' || project.user.planTier === 'free')
    ? project.user.planTier
    : 'free';

  if (record.count >= limitations[planTier].dailyApiLimit) {
    return res.status(429).json({ message: `API limit (${limitations[planTier].dailyApiLimit}/day) exceeded.` });
  }

  await db
    .update(apiUsage)
    .set({ count: record.count + 1, updatedAt: new Date() })
    .where(eq(apiUsage.id, record.id))
    .returning();

  return next();
}
