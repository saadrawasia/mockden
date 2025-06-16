import { Skeleton } from '@frontend/components/ui/skeleton';
import { useSchemasQuery } from '@frontend/hooks/useSchemas';
import { Route } from '@frontend/routes/projects/$projectSlug/schemas';
import { useMemo } from 'react';

import { TypographyH2 } from '../components/typography/typography';
import PageShell from '../pageShell';
import ListSchemasSection from '../sections/schemas/listSchemas';
import NewSchemaSection from '../sections/schemas/newSchema';

export default function SchemasPage() {
  const { project } = Route.useLoaderData();

  const { data: schemas, isLoading } = useSchemasQuery(project.id);

  const hasSchemas = useMemo(() => schemas.length > 0, [schemas.length]);

  return (
    <PageShell>
      <title>Mockden - Schemas</title>
      <meta
        name="description"
        content="Create, validate, and manage mock data with schemas. Built for
              developers who demand reliability and speed."
      />
      <div className="flex justify-between">
        <TypographyH2>
          {project?.name}
          {' '}
          - Schemas
        </TypographyH2>
        {hasSchemas && <NewSchemaSection renderSVG={false} />}
      </div>

      {!isLoading
        ? (
            <>
              {!hasSchemas && <NewSchemaSection renderSVG={true} />}
              {hasSchemas && <ListSchemasSection />}

            </>
          )
        : (
            <Skeleton className="h-[176px] w-[384px] rounded-xl" />
          )}
    </PageShell>
  );
}
