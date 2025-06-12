/* eslint-disable unused-imports/no-unused-vars */
import type { Schema, SchemaBase } from '@shared/lib/types';

import { useState } from 'react';

import { TypographyH2 } from '../components/typography/typography';
import { useMediaQuery } from '../hooks/useMediaQuery';
import PageShell from '../pageShell';
import NewSchemaSection from '../sections/schemas.tsx/newSchema';

const defaultSchema: SchemaBase = {
  name: '',
  fields: '',
  fakeData: false,
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
      created_at: '01-01-2025',
    },
  ]);

  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

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
      {schemas.length > 0 && <div>list schemas</div>}
    </PageShell>
  );
}
