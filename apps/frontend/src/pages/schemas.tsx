import { Route } from '@frontend/routes/projects/$projectSlug/schemas';
import { useSchemaStore } from '@frontend/stores/schemasStore';

import { TypographyH2 } from '../components/typography/typography';
import PageShell from '../pageShell';
import ListSchemasSection from '../sections/schemas/listSchemas';
import NewSchemaSection from '../sections/schemas/newSchema';

export default function SchemasPage() {
  const { project, projectSlug } = Route.useLoaderData();
  console.log({ project, projectSlug });

  const schemas = useSchemaStore(state => state.schemas);

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
        {schemas.length > 0 && <NewSchemaSection renderSVG={false} />}
      </div>

      {schemas.length === 0 && <NewSchemaSection renderSVG={true} />}
      {schemas.length > 0 && <ListSchemasSection />}
    </PageShell>
  );
}
