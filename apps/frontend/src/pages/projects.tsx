import type { Message, Project } from '@shared/lib/types';

import { TypographyH2 } from '@frontend/components/typography/typography';
import config from '@frontend/lib/config';
import PageShell from '@frontend/pageShell';
import ListProjectsSection from '@frontend/sections/projects/listProjects';
import NewProjectSection from '@frontend/sections/projects/newProject';
import { useProjectStore } from '@frontend/stores/projectStore';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';

export default function ProjectsPage() {
  const { projects, setProjects } = useProjectStore();
  const { data } = useSuspenseQuery<Project[] | Message>({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await fetch(`${config.BACKEND_URL}/projects`);
      const json = await res.json();
      if ('message' in json) {
        toast.error('Something went wrong!', {
          description: json.message,
        });
      }
      return json;
    },
  });

  useEffect(() => {
    if (Array.isArray(data)) {
      setProjects(data);
    }
  }, [data, setProjects]);

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
      {!hasProjects && <NewProjectSection renderSVG={true} />}
      {hasProjects && <ListProjectsSection />}
    </PageShell>
  );
}
