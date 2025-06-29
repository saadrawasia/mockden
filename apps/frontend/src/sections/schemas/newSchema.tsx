import type { Project } from '@shared/lib/types';

import schemaSVG from '@frontend/assets/server.svg';
import SchemaFormDialog from '@frontend/components/schemaForm/schemaForm';
import { Button } from '@frontend/components/ui/button';
import { cn } from '@frontend/lib/utils';
import { useSchemaStore } from '@frontend/stores/schemasStore';
import { Plus } from 'lucide-react';
import { useState } from 'react';

type NewSchemaSectionProps = {
	renderSVG: boolean;
	project: Project;
	allowNewSchema: boolean;
};

export default function NewSchemaSection({
	renderSVG,
	project,
	allowNewSchema,
}: NewSchemaSectionProps) {
	const setSelectedSchema = useSchemaStore(state => state.setSelectedSchema);
	const defaultSchema = useSchemaStore(state => state.defaultSchema);
	const [open, setOpen] = useState(false);

	return (
		<div
			className={cn('flex flex-col items-center justify-center gap-8 text-center', {
				'flex-auto': renderSVG,
			})}
		>
			{renderSVG && <img src={schemaSVG} alt="create-project" className="sm:w-md" />}
			<Button
				onClick={() => {
					if (!allowNewSchema) {
						return;
					}
					setSelectedSchema(defaultSchema);
					setOpen(prev => !prev);
				}}
				disabled={!allowNewSchema}
			>
				<Plus /> Create Schema
			</Button>
			<SchemaFormDialog open={open} setOpen={setOpen} title="New Schema" project={project} />
		</div>
	);
}
