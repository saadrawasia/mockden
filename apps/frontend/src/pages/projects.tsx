import { TypographyH2 } from '@frontend/components/typography/typography';
import PageShell from '@frontend/pageShell';
import ListProjectsSection from '@frontend/sections/projects/listProjects';
import NewProjectSection from '@frontend/sections/projects/newProject';
import { useProjectStore } from '@frontend/stores/projectStore';

export default function ProjectsPage() {
  const projects = useProjectStore(state => state.projects);

  return (
    <PageShell>
      <title>Mockden - Projects</title>
      <meta
        name="description"
        content="Create, validate, and manage mock data with schemas. Built for
          developers who demand reliability and speed."
      />
      <div className="flex justify-between">
        <TypographyH2>Projects</TypographyH2>
        {projects.length > 0 && (
          <NewProjectSection
            renderSVG={false}
          />
        )}
      </div>

      {projects.length === 0 && (
        <NewProjectSection
          renderSVG={true}
        />
      )}
      {projects.length > 0 && (
        <ListProjectsSection />
      )}
    </PageShell>
  );
}
