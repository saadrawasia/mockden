import type { ProjectDefinition } from '@shared/lib/types';

import projectSVG from '@frontend/assets/projects.svg';
import ProjectFormDialog from '@frontend/components/projectForm/projectForm';
import { Button } from '@frontend/components/ui/button';
import { cn } from '@frontend/lib/utils';
import { Plus } from 'lucide-react';
import { useState } from 'react';

type NewProjectSectionProps = {
  defaultProject: ProjectDefinition;
  isDesktop: boolean;
  renderSVG: boolean;
};

export default function NewProjectSection({
  defaultProject,
  isDesktop,
  renderSVG,
}: NewProjectSectionProps) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-8 text-center',
        { 'flex-auto': renderSVG },
      )}
    >
      {renderSVG && (
        <img src={projectSVG} alt="create-project" className="sm:w-md" />
      )}
      <Button
        onClick={() => {
          setOpen(prev => !prev);
        }}
      >
        <Plus />
        {' '}
        Create Project
      </Button>
      <ProjectFormDialog
        open={open}
        setOpen={setOpen}
        isDesktop={isDesktop}
        project={defaultProject}
        title="New Project"
      />
    </div>
  );
}
