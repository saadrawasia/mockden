import type { Project } from '@shared/lib/types';

import { Button } from '@frontend/components/ui/button';
import { Skeleton } from '@frontend/components/ui/skeleton';
import { useProjectsQuery } from '@frontend/hooks/useProjects';
import { useSchemasQuery } from '@frontend/hooks/useSchemas';
import { useUsersQuery } from '@frontend/hooks/useUsers';
import { getProjectBySlug } from '@frontend/lib/projectHelpers';
import { Route } from '@frontend/routes/projects/$projectSlug/schemas';
import { limitations } from '@shared/lib/config';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { useMemo } from 'react';

import { TypographyH2, TypographyP } from '../components/typography/typography';
import PageShell from '../pageShell';
import ListSchemasSection from '../sections/schemas/listSchemas';
import NewSchemaSection from '../sections/schemas/newSchema';
import PageNotFound from './pageNotFound';

export default function SchemasPage() {
  const { projectSlug } = Route.useLoaderData();
  const { data: projects } = useProjectsQuery();

  const project = getProjectBySlug(projectSlug, projects);
  if (!project) {
    return <PageNotFound />;
  }

  return <SchemaPageImplementation project={project} />;
}

type SchemaPageImplementationProps = {
  project: Project;
};

function SchemaPageImplementation({ project }: SchemaPageImplementationProps) {
  const { data: schemas, isLoading } = useSchemasQuery(project.id);
  const { data: user } = useUsersQuery();
  const allowNewSchema = schemas.length < limitations[user.planTier].schemas;

  const hasSchemas = useMemo(() => schemas.length > 0, [schemas.length]);
  const navigate = useNavigate();

  return (
    <PageShell>
      <title>Mockden - Schemas</title>
      <meta
        name="description"
        content="Create, validate, and manage mock data with schemas. Built for
              developers who demand reliability and speed."
      />
      <Button
        variant="link"
        className="hover:no-underline justify-start"
        onClick={() => navigate({
          to: '/projects',
        })}
      >
        <ArrowLeft />
        {' '}
        <TypographyP>Goto Projects</TypographyP>
      </Button>
      <div className="flex justify-between">
        <TypographyH2>
          {project?.name}
          {' '}
          - Schemas
        </TypographyH2>
        {hasSchemas && <NewSchemaSection renderSVG={false} project={project} allowNewSchema={allowNewSchema} />}
      </div>

      {!isLoading
        ? (
            <>
              {!hasSchemas && <NewSchemaSection renderSVG={true} project={project} allowNewSchema={allowNewSchema} />}
              {hasSchemas && <ListSchemasSection project={project} />}

            </>
          )
        : (
            <Skeleton className="h-[176px] w-[384px] rounded-xl" />
          )}
    </PageShell>
  );
}
