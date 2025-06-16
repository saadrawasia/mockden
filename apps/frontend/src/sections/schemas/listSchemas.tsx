import type { Schema } from '@shared/lib/types';

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
import { useDeleteSchemaMutation } from '@frontend/hooks/useSchemas';
import { Route } from '@frontend/routes/projects/$projectSlug/schemas';
import { useSchemaStore } from '@frontend/stores/schemasStore';
import { useQueryClient } from '@tanstack/react-query';
import { Copy, EllipsisVertical, Loader2Icon, Pencil, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';

import SchemaFormDialog from '../../components/schemaForm/schemaForm';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';

export default function ListSchemasSection() {
  const { projectSlug, project } = Route.useLoaderData();
  const queryClient = useQueryClient();
  const schemas = queryClient.getQueryData<Schema[]>(['schemas']) ?? [];

  const { selectedSchema, setSelectedSchema } = useSchemaStore();
  const deleteSchemasMutation = useDeleteSchemaMutation();

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
    deleteSchemasMutation.mutate({ projectId: project.id, id: selectedSchema.id }, {
      onSuccess: (result) => {
        if ('id' in result) {
          setOpenAlert(false);
        }
        setIsDeleting(false);
      },
    });
  }, [selectedSchema, deleteSchemasMutation, project]);

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
                        variant="ghost"
                        className="w-full justify-start"
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
                        variant="ghost"
                        className="hover:text-destructive w-full justify-start"
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
                <div>
                  <TypographyP className="font-semibold">API:</TypographyP>
                  <div className="group flex cursor-pointer gap-2">
                    <TypographyP className="text-muted-foreground">
                      https://mockden.com/api/
                      {projectSlug}
                      /
                      {schema.slug}
                    </TypographyP>
                    <Copy
                      className="text-muted-foreground hidden group-hover:flex md:hidden"
                      size={20}
                    />
                  </div>
                </div>

                <div>
                  <TypographyP className="font-semibold">
                    Custom Headers:
                  </TypographyP>
                  <div className="group flex cursor-pointer gap-2">
                    <TypographyP className="text-muted-foreground">
                      x-mockden-key: random-api-key
                    </TypographyP>
                    <Copy
                      className="text-muted-foreground hidden group-hover:flex md:hidden"
                      size={20}
                    />
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Switch id="active" checked={schema.status === 'active'} />
                  <Label htmlFor="active" className="text-md font-semibold">
                    Active
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
      <SchemaFormDialog open={openEdit} setOpen={setOpenEdit} title="Edit Schema" />

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
