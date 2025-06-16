import { TypographyH2 } from '@frontend/components/typography/typography';
import { Skeleton } from '@frontend/components/ui/skeleton';
import { useProjectsQuery } from '@frontend/hooks/useProjects';
import PageShell from '@frontend/pageShell';
import ListProjectsSection from '@frontend/sections/projects/listProjects';
import NewProjectSection from '@frontend/sections/projects/newProject';
import { useMemo } from 'react';

export default function ProjectsPage() {
  const { data: projects, isLoading } = useProjectsQuery();

  const hasProjects = useMemo(() => projects.length > 0, [projects.length]);

  return (
    <PageShell>
      <title>Mockden - Projects</title>
      <meta
        name="description"
        content="Create, validate, and manage mock data with schemas. Built for developers who demand reliability and speed."
      />
      <div className="flex justify-between">
        <TypographyH2>Projects</TypographyH2>
        {hasProjects && <NewProjectSection renderSVG={false} />}
      </div>
      {!isLoading
        ? (
            <>
              {!hasProjects && <NewProjectSection renderSVG={true} />}
              {hasProjects && <ListProjectsSection />}
            </>
          )
        : (
            <Skeleton className="h-[176px] w-[384px] rounded-xl" />
          )}
    </PageShell>
  );
}
