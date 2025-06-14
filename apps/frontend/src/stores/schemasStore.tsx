import type { Schema, SchemaBase } from '@shared/lib/types';

import { create } from 'zustand';

type SchemasStore = {
  schemas: Schema[];
  setSchemas: (updatedSchemas: Schema[]) => void;
  selectedSchema: Schema | SchemaBase | null;
  setSelectedSchema: (schema: Schema | SchemaBase | null) => void;
  deleteSchema: (id: string) => void;
  defaultSchema: SchemaBase;
  editSchema: (index: number) => void;
};

export const useSchemaStore = create<SchemasStore>(set => ({
  schemas: [
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
  ],
  setSchemas: (updatedSchemas) => {
    set(() => ({ schemas: updatedSchemas }));
  },
  selectedSchema: null,
  setSelectedSchema: (project) => {
    set(() => ({ selectedSchema: project }));
  },
  deleteSchema: (id) => {
    const state = useSchemaStore.getState();
    const schemas = state.schemas;
    const index = schemas.findIndex(schema => schema.id === id);
    const updatedSchemas = [...schemas];
    updatedSchemas.splice(index, 1);
    state.setSchemas(updatedSchemas);
  },
  defaultSchema: {
    name: '',
    fields: '',
    fakeData: false,
    slug: '',
    status: 'active',
  },
  editSchema: (index) => {
    const state = useSchemaStore.getState();
    const schemas = state.schemas;
    const selectedSchema: Schema | SchemaBase = schemas[index] ?? state.defaultSchema;
    state.setSelectedSchema(selectedSchema);
  },
}));
