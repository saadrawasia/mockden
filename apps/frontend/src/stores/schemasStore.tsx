import type { Schema } from '@shared/lib/types';

import { create } from 'zustand';

type SchemasStore = {
  selectedSchema: Schema | null;
  setSelectedSchema: (schema: Schema | null) => void;
  defaultSchema: Schema;
};

export const useSchemaStore = create<SchemasStore>(set => ({
  selectedSchema: null,
  setSelectedSchema: (schema) => {
    set(() => ({ selectedSchema: schema }));
  },
  defaultSchema: {
    id: '',
    name: '',
    fields: '',
    fakeData: false,
    slug: '',
    status: 'active',
    created_at: '',
  },
}));
