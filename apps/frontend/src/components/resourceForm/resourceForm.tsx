import { AnyFieldApi, useForm } from '@tanstack/react-form';
import { validateSchemaDefinition } from '@shared/validators/schemaValidator';
import { useState } from 'react';

function ErrorInfo({ field }: { field: AnyFieldApi }) {
  return field.state.meta.isTouched && !field.state.meta.isValid ? (
    <em>{field.state.meta.errors.join(', ')}</em>
  ) : null;
}

type Resource = {
  id: string;
  name: string;
  schema_definition: string;
};

type Message = {
  message: string;
};

export default function ResourceForm() {
  const [errorMessage, setErrorMessage] = useState('');

  const form = useForm({
    defaultValues: {
      name: '',
      schema: '',
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      setErrorMessage('');
      console.log(value);
      const schema = JSON.stringify(JSON.parse(value.schema), null, 4); //prettify json
      const res = await fetch('http://localhost:4000/resource', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: value.name, schema }),
      });
      const json: Resource | Message = await res.json();
      if ('message' in json) {
        setErrorMessage(json.message);
      }
    },
  });

  const validateName = (value: string) => {
    if (!value) {
      return 'A name is required';
    }
    if (value.length < 2) {
      return 'Name must be at least 2 characters';
    }

    return;
  };

  const validateSchema = (value: string) => {
    let schema = {};
    try {
      schema = JSON.parse(value);
    } catch {
      return 'Invalid Scheme JSON';
    }

    const validate = validateSchemaDefinition(schema);
    if ('error' in validate) {
      return validate.error;
    }

    return;
  };

  return (
    <div className="flex gap-2 flex-col">
      <h2>Create Resource</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div>
          {/* A type-safe field component*/}
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
                    onChange={(e) => field.handleChange(e.target.value)}
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
            children={(field) => (
              <>
                <label htmlFor={field.name}>Schema:</label>
                <textarea
                  className="border"
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <ErrorInfo field={field} />
              </>
            )}
          />
        </div>
        {errorMessage && <p>{errorMessage}</p>}
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
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
