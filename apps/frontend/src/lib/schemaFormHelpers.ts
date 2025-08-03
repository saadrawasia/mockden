import type { FieldType } from '@shared/validators/schemaValidator';
import { editor } from 'monaco-editor';

export const getLineNumberForPath = (
	jsonString: string,
	itemIndex: number,
	fieldPath: string | number
) => {
	try {
		const lines = jsonString.split('\n');
		const currentLine = 1;
		let bracketCount = 0;
		let currentItemIndex = -1;
		let inItem = false;

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i].trim();

			if (line.includes('{')) {
				bracketCount += (line.match(/{/g) || []).length;
				if (bracketCount === 1) {
					// Starting a new item
					currentItemIndex++;
					inItem = true;
				}
			}

			if (line.includes('}')) {
				bracketCount -= (line.match(/}/g) || []).length;
				if (bracketCount === 1) {
					inItem = false;
				}
			}

			if (currentItemIndex === itemIndex && inItem) {
				if (!fieldPath) {
					return i + 1; // Return line number (1-based)
				}

				// Look for specific field
				if (fieldPath === 'validation' && line.includes('validation')) {
					return i + 1;
				}

				if (line.includes(`${fieldPath}`)) {
					return i + 1;
				}
			}

			if (currentItemIndex > itemIndex) {
				break;
			}
		}

		return currentLine;
	} catch {
		return 1;
	}
};

export const handleEditorDidMount = (
	editor: editor.IStandaloneCodeEditor,
	monaco: typeof import('monaco-editor'),
	editorRef: React.RefObject<editor.IStandaloneCodeEditor | null>,
	monacoRef: React.RefObject<unknown>
) => {
	editorRef.current = editor;
	monacoRef.current = monaco;

	// Configure JSON language settings - disable built-in completions
	monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
		validate: false, // Disable built-in validation to avoid conflicts
		allowComments: false,
		schemas: [],
		enableSchemaRequest: false,
	});

	// Disable built-in JSON completion
	monaco.languages.json.jsonDefaults.setModeConfiguration({
		documentFormattingEdits: true,
		documentRangeFormattingEdits: true,
		completionItems: false, // Disable built-in completions
		hovers: false,
		documentSymbols: false,
		tokens: true,
		colors: true,
		foldingRanges: true,
		diagnostics: false,
		selectionRanges: true,
	});

	// Register completion provider for auto-suggestions with higher priority
	monaco.languages.registerCompletionItemProvider('json', {
		triggerCharacters: ['"', ':', ' ', '\n', '\t'],
		provideCompletionItems: (model, position) => {
			const textUntilPosition = model.getValueInRange({
				startLineNumber: 1,
				startColumn: 1,
				endLineNumber: position.lineNumber,
				endColumn: position.column,
			});

			const lineText = model.getLineContent(position.lineNumber);
			const wordInfo = model.getWordUntilPosition(position);

			// Get current context - check if we're in a value position after "type":
			const isInTypeValue =
				/["']type["']\s*:\s*["']?[^"']*$/.test(textUntilPosition) ||
				/["']type["']\s*:\s*$/.test(textUntilPosition);

			// Check if we're inside a "type" field or right after "type":
			if (isInTypeValue) {
				const typeOptions: FieldType[] = [
					'string',
					'number',
					'boolean',
					'array',
					'object',
					'date',
					'datetime',
					'url',
					'uuid',
					'email',
				];
				const suggestions: import('monaco-editor').languages.CompletionItem[] = [];

				typeOptions.forEach((type, index) => {
					suggestions.push({
						label: `${type}`,
						kind: monaco.languages.CompletionItemKind.Value,
						insertText: `${type}`,
						documentation: `Field type: ${type}`,
						sortText: `0${index.toString().padStart(2, '0')}`,
						filterText: type,
						range: {
							startLineNumber: position.lineNumber,
							endLineNumber: position.lineNumber,
							startColumn: wordInfo.startColumn,
							endColumn: wordInfo.endColumn,
						},
					});
					suggestions.push({
						label: `"${type}"`,
						kind: monaco.languages.CompletionItemKind.Value,
						insertText: `"${type}"`,
						documentation: `Field type: ${type}`,
						sortText: `0${index.toString().padStart(2, '0')}`,
						filterText: type,
						range: {
							startLineNumber: position.lineNumber,
							endLineNumber: position.lineNumber,
							startColumn: wordInfo.startColumn,
							endColumn: wordInfo.endColumn,
						},
					});
				});

				return {
					suggestions,
					incomplete: false,
				};
			}

			// Check if we're in a validation context
			const isInValidation = /["']validation["']\s*:\s*\{[^}]*$/.test(textUntilPosition);

			if (isInValidation) {
				const validationOptions = [
					{ label: 'min', desc: 'Minimum value (number/date)' },
					{ label: 'max', desc: 'Maximum value (number/date)' },
					{ label: 'minLength', desc: 'Minimum length (string)' },
					{ label: 'maxLength', desc: 'Maximum length (string)' },
					{ label: 'pattern', desc: 'Regex pattern (string)' },
					{ label: 'minItems', desc: 'Minimum items (array)' },
					{ label: 'maxItems', desc: 'Maximum items (array)' },
				];

				const suggestions: import('monaco-editor').languages.CompletionItem[] = [];

				validationOptions.forEach((option, index) => {
					suggestions.push({
						label: `"${option.label}"`,
						kind: monaco.languages.CompletionItemKind.Property,
						insertText: `"${option.label}": `,
						documentation: option.desc,
						sortText: `1${index.toString().padStart(2, '0')}`,
						filterText: option.label,
						range: {
							startLineNumber: position.lineNumber,
							endLineNumber: position.lineNumber,
							startColumn: wordInfo.startColumn,
							endColumn: wordInfo.endColumn,
						},
					});
					suggestions.push({
						label: `${option.label}`,
						kind: monaco.languages.CompletionItemKind.Property,
						insertText: `${option.label}`,
						documentation: option.desc,
						sortText: `1${index.toString().padStart(2, '0')}`,
						filterText: option.label,
						range: {
							startLineNumber: position.lineNumber,
							endLineNumber: position.lineNumber,
							startColumn: wordInfo.startColumn,
							endColumn: wordInfo.endColumn,
						},
					});
				});

				return {
					suggestions,
					incomplete: false,
				};
			}

			// General field suggestions - show when we're in an object context
			const isInObjectContext =
				/\{[^}]*$/.test(textUntilPosition) ||
				/^\s*$/.test(lineText) ||
				/,\s*$/.test(textUntilPosition);

			if (isInObjectContext && !isInValidation && !isInTypeValue) {
				const fieldOptions = [
					{ label: 'name', desc: 'Field name (alphabets only)' },
					{ label: 'type', desc: 'Field type' },
					{ label: 'primary', desc: 'Primary key (boolean)' },
					{ label: 'nullable', desc: 'Can be null (boolean)' },
					{ label: 'validation', desc: 'Validation rules' },
					{ label: 'items', desc: 'Array item definition' },
					{ label: 'fields', desc: 'Object field definitions' },
				];
				const suggestions: import('monaco-editor').languages.CompletionItem[] = [];

				fieldOptions.forEach((option, index) => {
					suggestions.push({
						label: `"${option.label}"`,
						kind: monaco.languages.CompletionItemKind.Property,
						insertText: `"${option.label}": `,
						documentation: option.desc,
						sortText: `2${index.toString().padStart(2, '0')}`,
						filterText: option.label,
						range: {
							startLineNumber: position.lineNumber,
							endLineNumber: position.lineNumber,
							startColumn: wordInfo.startColumn,
							endColumn: wordInfo.endColumn,
						},
					});

					suggestions.push({
						label: `${option.label}`,
						kind: monaco.languages.CompletionItemKind.Property,
						insertText: `${option.label}`,
						documentation: option.desc,
						sortText: `2${index.toString().padStart(2, '0')}`,
						filterText: option.label,
						range: {
							startLineNumber: position.lineNumber,
							endLineNumber: position.lineNumber,
							startColumn: wordInfo.startColumn,
							endColumn: wordInfo.endColumn,
						},
					});
				});

				return {
					suggestions,
					incomplete: false,
				};
			}
			return {
				suggestions: [],
				incomplete: false,
			};
		},
	});
};

export const exampleSchema = `[
  {
    "name": "id",
    "type": "number",
    "primary": true,
    "nullable": false
  },
  {
    "name": "email",
    "type": "email",
    "primary": false,
    "nullable": false
  },
  {
    "name": "age",
    "type": "number",
    "primary": false,
    "nullable": true,
    "validation": {
      "min": 0,
      "max": 150
    }
  },
  {
    "name": "username",
    "type": "string",
    "primary": false,
    "nullable": false,
    "validation": {
      "minLength": 3,
      "maxLength": 30,
      "pattern": "^[a-zA-Z0-9_]+$"
    }
  },
  {
    "name": "roles",
    "type": "array",
    "items": {
      "enum": [
        "user",
        "admin",
        "editor",
        "viewer"
      ],
      "type": "string"
    },
    "validation": {
      "maxItems": 2,
      "minItems": 1
    }
  },
  {
    "name": "address",
    "type": "object",
    "fields": [
      { "name": "street", "type": "string" },
      { "name": "city", "type": "string"},
      { "name": "zipCode", "type": "string" },
      { "name": "country", "type": "string" }
    ]
  },
  {
    "name": "birthdate",
    "type": "date",
    "primary": false,
    "nullable": false,
    "validation": {
      "min": "1900-01-01",
      "max": "3000-01-01"
    }
  },
  {
    "name": "userid",
    "type": "uuid",
    "primary": false,
    "nullable": false
  },
    {
    "name": "isactive",
    "type": "boolean",
    "nullable": false
  },
  {
    "name": "link",
    "type": "url",
    "nullable": false
  },
	 {
    "name": "createdAt",
    "type": "datetime",
    "primary": false,
    "nullable": false,
  },
]`;
