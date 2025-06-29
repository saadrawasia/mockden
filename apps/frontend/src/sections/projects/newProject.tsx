import projectSVG from '@frontend/assets/projects.svg';
import ProjectFormDialog from '@frontend/components/projectForm/projectForm';
import { Button } from '@frontend/components/ui/button';
import { cn } from '@frontend/lib/utils';
import { useProjectStore } from '@frontend/stores/projectStore';
import { Plus } from 'lucide-react';
import { useState } from 'react';

type NewProjectSectionProps = {
	renderSVG: boolean;
	allowNewProject: boolean;
};

export default function NewProjectSection({ renderSVG, allowNewProject }: NewProjectSectionProps) {
	const [open, setOpen] = useState(false);
	const setSelectedProject = useProjectStore(state => state.setSelectedProject);
	const defaultProject = useProjectStore(state => state.defaultProject);

	return (
		<div
			className={cn('flex flex-col items-center justify-center gap-8 text-center', {
				'flex-auto': renderSVG,
			})}
		>
			{renderSVG && <img src={projectSVG} alt="create-project" className="sm:w-md" />}
			<Button
				onClick={() => {
					if (!allowNewProject) {
						return;
					}
					setSelectedProject(defaultProject);
					setOpen(prev => !prev);
				}}
				disabled={!allowNewProject}
			>
				<Plus /> Create Project
			</Button>
			<ProjectFormDialog open={open} setOpen={setOpen} title="New Project" />
		</div>
	);
}
