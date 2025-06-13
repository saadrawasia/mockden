import type { Schema, SchemaBase } from '@shared/lib/types';

import { useState } from 'react';

import { TypographyH2 } from '../components/typography/typography';
import { useMediaQuery } from '../hooks/useMediaQuery';
import PageShell from '../pageShell';
import ListSchemasSection from '../sections/schemas.tsx/listSchemas';
import NewSchemaSection from '../sections/schemas.tsx/newSchema';

const defaultSchema: SchemaBase = {
  name: '',
  fields: '',
  fakeData: false,
  slug: '',
  status: 'active',
};

export default function SchemasPage() {
  const [schemas, setSchemas] = useState<Schema[]>([
    {
      id: 'test',
      name: 'Users',
      fields: `[
        {
          name: 'id',
          type: 'string',
          primary: true,
          nullable: false,
        },
        {
          name: 'email',
          type: 'string',
          primary: false,
          nullable: false,
        },
      ]`,
      fakeData: true,
      slug: 'users',
      status: 'active',
      created_at: '01-01-2025',
    },
    {
      id: 'test 2',
      name: 'Projects',
      fields: `[
        {
          name: 'id',
          type: 'string',
          primary: true,
          nullable: false,
        },
        {
          name: 'description',
          type: 'string',
          primary: false,
          nullable: false,
        },
      ]`,
      fakeData: false,
      slug: 'projects',
      status: 'inactive',
      created_at: '01-01-2025',
    },
  ]);

  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const deleteSchema = (id: string) => {
    const index = schemas.findIndex(schema => schema.id === id);
    const updatedSchemas = [...schemas];
    updatedSchemas.splice(index, 1);
    setSchemas(updatedSchemas);
  };

  const editSchema = (index: number) => {
    const { id, ...schemaToEdit } = schemas[index] ?? defaultSchema;
    console.log(schemaToEdit);
  };

  return (
    <PageShell>
      <title>Mockden - Schemas</title>
      <meta
        name="description"
        content="Create, validate, and manage mock data with schemas. Built for
              developers who demand reliability and speed."
      />
      <div className="flex justify-between">
        <TypographyH2>Project Name - Schemas</TypographyH2>
        {schemas.length > 0 && (
          <NewSchemaSection
            isDesktop={isDesktop}
            defaultSchema={defaultSchema}
            renderSVG={false}
          />
        )}
      </div>

      {schemas.length === 0 && (
        <NewSchemaSection
          isDesktop={isDesktop}
          defaultSchema={defaultSchema}
          renderSVG={true}
        />
      )}
      {schemas.length > 0 && (
        <ListSchemasSection
          schemas={schemas}
          open={open}
          setOpen={setOpen}
          isDesktop={isDesktop}
          deleteSchema={deleteSchema}
          editSchema={editSchema}
        />
      )}
    </PageShell>
  );
}
