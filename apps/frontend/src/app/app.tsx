import SchemaForm from '@frontend/components/schemaForm/schemaForm';
import { useEffect, useState } from 'react';

type DataItem = {
  id: number;
} & Record<string, unknown>;

type Resource = {
  id: string;
  name: string;
  schema_definition: string;
};

export default function App() {
  const [schemas, setSchemas] = useState<Resource[]>([]);
  const [data, setData] = useState<DataItem[]>([]);

  const fetchAllSchemas = async () => {
    const res = await fetch(`http://localhost:4000/schemas`);
    const json: Resource[] = await res.json();
    setSchemas(json);
  };

  const fetchData = async (schemaId: string) => {
    const res = await fetch(`http://localhost:4000/${schemaId}`);
    const json = await res.json();
    console.log({ schemaId, json });
    setData(json);
  };

  useEffect(() => {
    fetchAllSchemas();
  }, []);

  return (
    <div style={{ padding: 20 }} className="flex gap-2 flex-col">
      <h1>Mock API Frontend</h1>
      <SchemaForm />
      <div>
        <h2>Available Schemas:</h2>
        {schemas.map(r => (
          <button key={r.id} onClick={() => fetchData(r.id)}>
            {r.name}
          </button>
        ))}
      </div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
