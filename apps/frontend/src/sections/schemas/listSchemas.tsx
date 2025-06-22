import type { Project, Schema } from '@shared/lib/types';

import {
  TypographyH5,
  TypographyP,
} from '@frontend/components/typography/typography';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@frontend/components/ui/alertDialog';
import { Button } from '@frontend/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@frontend/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@frontend/components/ui/dropdownMenu';
import {
  useDeleteSchemaMutation,
  useEditSchemaMutation,
} from '@frontend/hooks/useSchemas';
import config from '@frontend/lib/config';
import { useSchemaStore } from '@frontend/stores/schemasStore';
import { useQueryClient } from '@tanstack/react-query';
import {
  Copy,
  EllipsisVertical,
  Loader2Icon,
  Pencil,
  Trash2,
} from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import SchemaFormDialog from '../../components/schemaForm/schemaForm';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';

type ListSchemasSectionProps = {
  project: Project;
};

export default function ListSchemasSection({
  project,
}: ListSchemasSectionProps) {
  const queryClient = useQueryClient();
  const schemas = queryClient.getQueryData<Schema[]>(['schemas']) ?? [];

  const { selectedSchema, setSelectedSchema } = useSchemaStore();
  const deleteSchemasMutation = useDeleteSchemaMutation();
  const editSchemaMutation = useEditSchemaMutation();

  const [openEdit, setOpenEdit] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const handleEdit = useCallback(
    (schema: Schema) => {
      setSelectedSchema(schema);
      setOpenEdit(true);
    },
    [setSelectedSchema, setOpenEdit],
  );

  const handleDelete = useCallback(async () => {
    if (!selectedSchema)
      return;
    setIsDeleting(true);
    deleteSchemasMutation.mutate(
      { projectId: project.id, id: selectedSchema.id },
      {
        onSuccess: (result) => {
          if ('id' in result) {
            setOpenAlert(false);
          }
          setIsDeleting(false);
        },
      },
    );
  }, [selectedSchema, deleteSchemasMutation, project]);

  const handleIsActive = (schema: Schema) => {
    editSchemaMutation.mutate({
      id: schema.id,
      projectId: project.id,
      schema: {
        name: schema.name,
        fields: schema.fields,
        fakeData: schema.fakeData,
        isActive: !schema.isActive,
      },
    });
  };

  const copyToClipboard = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      toast('Copied to clipboard.');
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {schemas.map((schema) => {
        return (
          <Card key={schema.id} className="w-full gap-4">
            <CardHeader>
              <div className="flex flex-col gap-4">
                <CardTitle>
                  <TypographyH5>
                    /
                    {schema.slug}
                  </TypographyH5>
                </CardTitle>
              </div>

              <CardAction>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="cursor-pointer">
                    <EllipsisVertical />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onSelect={() => handleEdit(schema)}
                    >
                      <Button
                        type="button"
                        variant="link"
                        className="w-full justify-start hover:no-underline"
                      >
                        <Pencil />
                        {' '}
                        Edit
                      </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive cursor-pointer"
                      onSelect={() => {
                        setSelectedSchema(schema);
                        setOpenAlert(prev => !prev);
                      }}
                    >
                      <Button
                        type="button"
                        variant="link"
                        className="hover:text-destructive w-full justify-start hover:no-underline"
                      >
                        <Trash2 className="text-destructive" />
                        {' '}
                        Delete
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardAction>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <TypographyP className="font-semibold">
                    API:
                    {' '}
                    <span className="text-muted-foreground">(GET, POST, PUT, DELETE)</span>
                  </TypographyP>
                  <div className="group flex cursor-pointer gap-2" onClick={() => copyToClipboard(`${config.BACKEND_URL}/mockdata/${project.slug}/${schema.slug}`)}>
                    <TypographyP className="text-muted-foreground">
                      {config.BACKEND_URL}
                      /mockdata
                      {project.slug}
                      /
                      {schema.slug}
                    </TypographyP>
                    <Copy
                      className="text-muted-foreground hidden group-hover:flex md:hidden"
                      size={20}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <TypographyP className="font-semibold">Body Object Example:</TypographyP>
                  <div className="group flex cursor-pointer gap-2" onClick={() => copyToClipboard(JSON.stringify({ data: { email: 'test2@test.com', username: 'test' } }, null, 2))}>
                    <pre>{JSON.stringify({ data: { email: 'test2@test.com', username: 'test' } }, null, 2) }</pre>
                    <Copy
                      className="text-muted-foreground hidden group-hover:flex md:hidden"
                      size={20}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <TypographyP className="font-semibold">
                    Custom Headers:
                  </TypographyP>
                  <div className="group flex cursor-pointer gap-2" onClick={() => copyToClipboard(`x-mockden-header: ${project.apiKey}`)}>
                    <TypographyP className="text-muted-foreground">
                      x-mockden-header:
                      {' '}
                      {project.apiKey}
                    </TypographyP>
                    <Copy
                      className="text-muted-foreground hidden group-hover:flex md:hidden"
                      size={20}
                    />
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Switch
                    id="active"
                    checked={schema.isActive}
                    onCheckedChange={() => handleIsActive(schema)}
                  />
                  <Label htmlFor="active" className="text-md font-semibold">
                    Active
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
      <SchemaFormDialog
        open={openEdit}
        setOpen={setOpenEdit}
        title="Edit Schema"
        project={project}
      />

      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              Schema with all its records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2Icon className="animate-spin" />}
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
