import { eq } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';

import db from './client';
import { projects, users } from './schema';

async function seed() {
  const email = 'admin@example.com';
  const projectSlug = 'admin-project';

  // 1. Check if user exists
  let [user] = await db.select().from(users).where(eq(users.email, email));

  // 2. Create user if not exists
  if (!user) {
    const [newUser] = await db
      .insert(users)
      .values({
        id: randomUUID(), // optional, PostgreSQL will generate if omitted
        email,
        passwordHash: 'hashed_password_here', // Hash it in real-world apps
        planTier: 'pro',
      })
      .returning();

    user = newUser;
    console.log('✅ Created user:', user.email);
  }
  else {
    console.log('ℹ️ User already exists:', user.email);
  }

  // 3. Check if project exists for the user
  const [existingProject] = await db
    .select()
    .from(projects)
    .where(eq(projects.slug, projectSlug));

  if (!existingProject) {
    await db.insert(projects).values({
      id: randomUUID(),
      userId: user.id,
      name: 'Admin Project',
      slug: projectSlug,
      description: 'This is a default project for the admin user.',
    });
    console.log('✅ Created project:', projectSlug);
  }
  else {
    console.log('ℹ️ Project already exists:', projectSlug);
  }
}

seed().catch((e) => {
  console.error('❌ Error seeding database:', e);
  process.exit(1);
});
