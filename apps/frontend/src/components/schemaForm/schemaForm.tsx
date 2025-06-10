import { validateSchemaDefinition } from '@shared/validators/schemaValidator';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';

import { ErrorInfo } from '../ui/errorInfo';

type Schema = {
  id: string;
  name: string;
  schema_definition: string;
};

type Message = {
  message: string;
};

export default function SchemaForm() {
  const [errorMessage, setErrorMessage] = useState('');

  const form = useForm({
    defaultValues: {
      name: '',
      schema: '',
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      setErrorMessage('');
      const schema = JSON.stringify(JSON.parse(value.schema), null, 4); // prettify json
      const res = await fetch('http://localhost:4000/schemas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: value.name, schema }),
      });
      const json: Schema | Message = await res.json();
      if ('message' in json) {
        setErrorMessage(json.message);
      }
    },
  });

  const validateName = (value: string): string | void => {
    if (!value) {
      return 'A name is required';
    }
    if (value.length < 2) {
      return 'Name must be at least 2 characters';
    }
  };

  const validateSchema = (value: string): string | void => {
    let schema = {};
    try {
      schema = JSON.parse(value);
    }
    catch {
      return 'Invalid Scheme JSON';
    }

    const validate = validateSchemaDefinition(schema);
    if ('error' in validate) {
      return validate.error;
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <h2>Create Schema</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div>
          {/* A type-safe field component */}
          <form.Field
            name="name"
            validators={{
              onBlur: ({ value }) => validateName(value),
            }}
            children={(field) => {
              // Avoid hasty abstractions. Render props are great!
              return (
                <>
                  <label htmlFor={field.name}>Name:</label>
                  <input
                    className="border"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
                  />
                  <ErrorInfo field={field} />
                </>
              );
            }}
          />
        </div>
        <div>
          <form.Field
            name="schema"
            validators={{
              onBlur: ({ value }) => validateSchema(value),
            }}
            children={field => (
              <>
                <label htmlFor={field.name}>Schema:</label>
                <textarea
                  className="border"
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => field.handleChange(e.target.value)}
                />
                <ErrorInfo field={field} />
              </>
            )}
          />
        </div>
        {errorMessage && <p>{errorMessage}</p>}
        <form.Subscribe
          selector={state => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <button type="submit" disabled={!canSubmit}>
              {isSubmitting ? '...' : 'Submit'}
            </button>
          )}
        />
      </form>
    </div>
  );
}
