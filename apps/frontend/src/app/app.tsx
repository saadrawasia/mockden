import { useEffect, useState } from 'react';

interface DataItem extends Record<string, unknown> {
  id: number;
}

export default function App() {
  const [resources, setResources] = useState<string[]>([]);
  const [data, setData] = useState<DataItem[]>([]);
  const [resourceName, setResourceName] = useState('');

  const fetchAllResources = async () => {
    const res = await fetch(`http://localhost:4000/resources`);
    const json: { data: string[] } = await res.json();
    setResources(json.data);
  };

  const fetchData = async (resource: string) => {
    const res = await fetch(`http://localhost:4000/${resource}`);
    const json = await res.json();
    setData(json);
  };

  useEffect(() => {
    fetchAllResources();
  }, []);

  const createSchema = async () => {
    const res = await fetch('http://localhost:4000/define-schema', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resource: resourceName }),
    });
    const json = await res.json();
    console.log({ json, resourceName });
    setResources([...resources, resourceName]);
    setResourceName('');
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Mock API Frontend</h1>
      <input
        value={resourceName}
        onChange={(e) => setResourceName(e.target.value)}
        placeholder="New Resource Name"
      />
      <button onClick={createSchema}>Add Resource</button>
      <div>
        <h2>Available Resources:</h2>
        {resources.map((r) => (
          <button key={r} onClick={() => fetchData(r)}>
            {r}
          </button>
        ))}
      </div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
