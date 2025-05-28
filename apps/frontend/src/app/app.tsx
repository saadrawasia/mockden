import { useEffect, useState } from 'react';

import ResourceForm from '../components/resourceForm/resourceForm';

type DataItem = {
  id: number;
} & Record<string, unknown>;

type Resource = {
  id: string;
  name: string;
  schema_definition: string;
};

export default function App() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [data, setData] = useState<DataItem[]>([]);

  const fetchAllResources = async () => {
    const res = await fetch(`http://localhost:4000/resources`);
    const json: Resource[] = await res.json();
    setResources(json);
  };

  const fetchData = async (resourceId: string) => {
    const res = await fetch(`http://localhost:4000/${resourceId}`);
    const json = await res.json();
    console.log({ resourceId, json });
    setData(json);
  };

  useEffect(() => {
    fetchAllResources();
  }, []);

  return (
    <div style={{ padding: 20 }} className="flex gap-2 flex-col">
      <h1>Mock API Frontend</h1>
      <ResourceForm />
      <div>
        <h2>Available Resources:</h2>
        {resources.map(r => (
          <button key={r.id} onClick={() => fetchData(r.id)}>
            {r.name}
          </button>
        ))}
      </div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
