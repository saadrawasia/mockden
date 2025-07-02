import type { Project, SchemaBase } from '@shared/lib/types';

import { useMediaQuery } from '@frontend/hooks/useMediaQuery';
import { useCreateSchemaMutation, useEditSchemaMutation } from '@frontend/hooks/useSchemas';
import { useSchemaStore } from '@frontend/stores/schemasStore';
import { DialogDescription } from '@radix-ui/react-dialog';
import { SchemaDefinitionSchema, SchemaZod } from '@shared/validators/schemaValidator';
import { useForm } from '@tanstack/react-form';
import { Loader2Icon } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

import { cn } from '../../lib/utils';
import { TypographyCaption } from '../typography/typography';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '../ui/drawer';
import { ErrorInfo } from '../ui/errorInfo';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scrollArea';
import { Separator } from '../ui/separator';

import {
	exampleSchema,
	getLineNumberForPath,
	handleEditorDidMount,
} from '@frontend/lib/schemaFormHelpers';
import Editor from '@monaco-editor/react';
import type { editor } from 'monaco-editor';

type SchemaFormDialogProps = {
	title: string;
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	project: Project;
};

export default function SchemaFormDialog({ title, open, setOpen, project }: SchemaFormDialogProps) {
	const isDesktop = useMediaQuery('(min-width: 768px)');
	const requestType = title.includes('Edit') ? 'edit' : 'create';

	const handleOpen = useCallback((open = false) => setOpen(open), [setOpen]);

	const FormComponent = (
		<SchemaForm setOpen={setOpen} requestType={requestType} project={project} />
	);

	if (isDesktop) {
		return (
			<Dialog open={open} onOpenChange={handleOpen}>
				<DialogContent className="max-h-[80vh] w-full overflow-y-auto sm:max-w-6xl">
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription className="sr-only">Schema Form Dialog</DialogDescription>
					</DialogHeader>
					<div className="flex gap-2">
						{FormComponent}
						<Separator orientation="vertical" />
						<div className="flex flex-auto flex-col gap-2">
							<Label>Example:</Label>
							<div
								className={cn(
									'flex h-full w-full min-w-0 rounded-md border border-input bg-white text-base shadow-xs outline-none transition-[color,box-shadow] selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30',
									'focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50'
								)}
							>
								<Editor
									height="100%"
									defaultLanguage="json"
									theme="tomorrow"
									value={exampleSchema}
									options={{
										minimap: { enabled: false },
										scrollBeyondLastLine: false,
										fontSize: 14,
										lineNumbers: 'on',
										roundedSelection: false,
										readOnly: true,
									}}
								/>
							</div>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		);
	}
	return (
		<Drawer open={open} onOpenChange={handleOpen}>
			<DrawerContent className="max-h-[80vh]">
				<div className="mx-auto w-full max-w-sm pb-8 ">
					<DrawerHeader className="px-2">
						<DrawerTitle>{title}</DrawerTitle>
						<DrawerDescription className="sr-only">Schema Form Dialog</DrawerDescription>
					</DrawerHeader>
					<ScrollArea className="max-h-[60vh] overflow-auto px-2">{FormComponent}</ScrollArea>
				</div>
			</DrawerContent>
		</Drawer>
	);
}

type SchemaFormProps = {
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	requestType: 'edit' | 'create';
	project: Project;
};

function SchemaForm({ setOpen, requestType, project }: SchemaFormProps) {
	const selectedSchema = useSchemaStore(state => state.selectedSchema);

	const isDesktop = useMediaQuery('(min-width: 768px)');

	const [errorMessage, setErrorMessage] = useState('');
	const [isSaving, setIsSaving] = useState(false);
	const createSchemaMutation = useCreateSchemaMutation();
	const editSchemaMutation = useEditSchemaMutation();
	const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
	const monacoRef = useRef<typeof import('monaco-editor') | null>(null);

	const createSchema = useCallback(
		async (value: SchemaBase) => {
			setErrorMessage('');
			setIsSaving(true);
			try {
				const mutate = await createSchemaMutation.mutateAsync({
					projectId: project.id,
					newSchema: { name: value?.name, fields: value?.fields, fakeData: value.fakeData },
				});
				if ('message' in mutate) {
					setErrorMessage(mutate.message);
				} else {
					setOpen(false);
				}
			} catch {
				setErrorMessage('Network error. Please try again.');
			} finally {
				setIsSaving(false);
			}
		},
		[createSchemaMutation, setOpen, project]
	);

	const editSchema = useCallback(
		async (value: SchemaBase) => {
			if (!selectedSchema) return;
			setErrorMessage('');
			setIsSaving(true);
			try {
				const mutate = await editSchemaMutation.mutateAsync({
					id: selectedSchema.id,
					projectId: project.id,
					schema: { name: value?.name, fields: value?.fields, fakeData: value.fakeData },
				});
				if ('message' in mutate) {
					setErrorMessage(mutate.message);
				} else {
					setOpen(false);
				}
			} catch {
				setErrorMessage('Network error. Please try again.');
			} finally {
				setIsSaving(false);
			}
		},
		[selectedSchema, editSchemaMutation, setOpen, project]
	);

	const form = useForm({
		defaultValues: {
			...selectedSchema,
			fields: Array.isArray(selectedSchema?.fields)
				? JSON.stringify(selectedSchema?.fields, undefined, 2)
				: selectedSchema?.fields,
		},
		onSubmit: async ({ value }) => {
			if (requestType === 'create') {
				await createSchema(value as SchemaBase);
			} else {
				await editSchema(value as SchemaBase);
			}
		},
	});

	type SchemaError = {
		line: number;
		column: number;
		message: string;
		severity: string;
		path?: (string | number)[];
	};

	const validateSchema = (value: string): string | void | SchemaError[] => {
		let schema = {};
		try {
			schema = JSON.parse(value);
		} catch {
			return 'Invalid Scheme JSON';
		}

		let errors: SchemaError[] = [];

		try {
			const result = SchemaDefinitionSchema.safeParse(schema);

			if (!result.success) {
				result.error.issues.forEach(issue => {
					let lineNumber = 1;
					let message = issue.message;

					// Extract item index and field from path
					if (issue.path.length >= 1) {
						const itemIndex = issue.path[0];
						const fieldPath = issue.path[1];

						if (typeof itemIndex === 'number') {
							lineNumber = getLineNumberForPath(value, itemIndex, fieldPath);
							message = `Item ${itemIndex + 1}: ${issue.message}`;
						}
					}

					errors.push({
						line: lineNumber,
						column: 1,
						message: message,
						severity: 'error',
						path: issue.path,
					});
				});
			}
		} catch (e) {
			// JSON parsing error
			errors = [
				{
					line: 1,
					column: 1,
					message: `JSON Syntax Error: ${(e as Error).message}`,
					severity: 'error',
				},
			];
		}

		if (editorRef.current && monacoRef.current) {
			const markers = errors.map(error => ({
				startLineNumber: error.line,
				startColumn: error.column,
				endLineNumber: error.line,
				endColumn: error.column + 10,
				message: error.message,
				severity:
					error.severity === 'error'
						? monacoRef.current!.MarkerSeverity.Error
						: monacoRef.current!.MarkerSeverity.Warning,
			}));

			const model = editorRef.current.getModel();
			if (model) {
				monacoRef.current!.editor.setModelMarkers(model, 'zod-validation', markers);
			}
		}

		if (errors.length > 0) {
			return errors[0].message;
		}
	};

	return (
		<form
			onSubmit={e => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className="mx-auto flex max-w-xs flex-col gap-4 md:max-w-md lg:max-w-xl"
		>
			<div className="flex flex-col gap-2">
				{/* A type-safe field component */}
				<form.Field
					name="name"
					validators={{
						onChange: ({ value }) => {
							const result = SchemaZod.shape.name.safeParse(value);
							if (!result.success) {
								// Return first Zod error message
								return result.error.issues[0].message;
							}
							return undefined;
						},
					}}
					children={field => {
						// Avoid hasty abstractions. Render props are great!
						return (
							<>
								<div className="grid w-full items-center gap-3">
									<Label htmlFor={field.name}>Name</Label>
									<Input
										type="text"
										id={field.name}
										placeholder="Name"
										name={field.name}
										value={field.state.value}
										// onBlur={field.handleBlur}
										onChange={e => field.handleChange(e.target.value)}
										aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
										autoComplete="off"
									/>
								</div>
								<ErrorInfo field={field} />
							</>
						);
					}}
				/>
			</div>
			<div className="flex flex-col gap-2">
				<form.Field
					name="fields"
					validators={{
						onChange: ({ value }) => validateSchema(value ?? ''),
						onBlur: ({ value }) => validateSchema(value ?? ''),
					}}
					children={field => (
						<>
							<Label>Schema</Label>
							<div
								className={cn(
									'flex w-full min-w-0 rounded-md border border-input bg-white text-base shadow-xs outline-none transition-[color,box-shadow] selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30',
									'focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50',
									{
										'border-destructive ring-destructive/20 dark:ring-destructive/40':
											field.state.meta.isTouched && !field.state.meta.isValid,
									}
								)}
							>
								<Editor
									height={isDesktop ? '500px' : '250px'}
									defaultLanguage="json"
									theme="tomorrow"
									value={field.state.value}
									onChange={field.handleChange}
									onMount={(editor, monaco) =>
										handleEditorDidMount(editor, monaco, editorRef, monacoRef)
									}
									options={{
										minimap: { enabled: false },
										scrollBeyondLastLine: false,
										fontSize: 14,
										lineNumbers: 'on',
										roundedSelection: false,
										automaticLayout: true,
										wordWrap: 'on',
										formatOnPaste: true,
										formatOnType: true,
										suggest: {
											showKeywords: false,
											showSnippets: false,
											showColors: false,
											showFiles: false,
											showReferences: false,
											showFolders: false,
											showTypeParameters: false,
											showIssues: false,
											showUsers: false,
											showWords: false,
											insertMode: 'replace',
											filterGraceful: true,
											snippetsPreventQuickSuggestions: false,
											localityBonus: false,
											shareSuggestSelections: false,
										},
										quickSuggestions: {
											other: true,
											comments: false,
											strings: true,
										},
										quickSuggestionsDelay: 10,
									}}
								/>
							</div>

							<ErrorInfo field={field} />
						</>
					)}
				/>
			</div>

			<form.Field
				name="fakeData"
				validators={{
					onChange: ({ value }) => {
						const result = SchemaZod.shape.fakeData.safeParse(value);
						if (!result.success) {
							// Return first Zod error message
							return result.error.issues[0].message;
						}
						return undefined;
					},
				}}
				children={field => (
					<>
						<Label className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 hover:bg-accent/50 has-[[aria-checked=true]]:border-primary has-[[aria-checked=true]]:bg-neutral-50">
							<Checkbox
								id="toggle-2"
								name={field.name}
								checked={field.state.value}
								// onBlur={field.handleBlur}
								onCheckedChange={() => field.handleChange(!field.state.value)}
								className="data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white"
							/>
							<div className="grid gap-1.5 font-normal">
								<p className="font-medium text-sm leading-none">Create Fake Entries</p>
								<p className="text-muted-foreground text-sm">
									Based on your Schema we will create 10 fake entries in your records to get you
									started.
								</p>
							</div>
						</Label>
					</>
				)}
			/>
			{errorMessage && (
				<TypographyCaption className="text-destructive">{errorMessage}</TypographyCaption>
			)}

			{requestType === 'edit' && (
				<TypographyCaption className="text-muted-foreground italic">
					* Editing the schema with remove all the previous records.
				</TypographyCaption>
			)}
			<form.Subscribe
				selector={state => [state.canSubmit, state.isSubmitting]}
				children={([canSubmit, isSubmitting]) => (
					<Button type="submit" disabled={!canSubmit || isSaving}>
						{isSubmitting && <Loader2Icon className="animate-spin" />}
						Save
					</Button>
				)}
			/>
			<Button variant="outline" disabled={isSaving} onClick={() => setOpen(false)}>
				Cancel
			</Button>
		</form>
	);
}
