import type { SchemaBase } from '@shared/lib/types';

import schemaSVG from '@frontend/assets/server.svg';
import SchemaFormDialog from '@frontend/components/schemaForm/schemaForm';
import { Button } from '@frontend/components/ui/button';
import { cn } from '@frontend/lib/utils';
import { Plus } from 'lucide-react';
import { useState } from 'react';

type NewSchemaSectionProps = {
  defaultSchema: SchemaBase;
  isDesktop: boolean;
  renderSVG: boolean;
};

export default function NewSchemaSection({
  defaultSchema,
  isDesktop,
  renderSVG,
}: NewSchemaSectionProps) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-8 text-center',
        { 'flex-auto': renderSVG },
      )}
    >
      {renderSVG && (
        <img src={schemaSVG} alt="create-project" className="sm:w-md" />
      )}
      <Button
        onClick={() => {
          setOpen(prev => !prev);
        }}
      >
        <Plus />
        {' '}
        Create Schema
      </Button>
      <SchemaFormDialog
        open={open}
        setOpen={setOpen}
        isDesktop={isDesktop}
        schema={defaultSchema}
        title="New Schema"
      />
    </div>
  );
}
