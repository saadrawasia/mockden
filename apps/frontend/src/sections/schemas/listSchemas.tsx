import type { Schema } from '@shared/lib/types';

import {
  TypographyH5,
  TypographyP,
} from '@frontend/components/typography/typography';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@frontend/components/ui/alertDialog';
import { Button, buttonVariants } from '@frontend/components/ui/button';
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
import { Copy, EllipsisVertical, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

import SchemaFormDialog from '../../components/schemaForm/schemaForm';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';

export type ListSchemasProps = {
  schemas: Schema[];
  deleteSchema: (id: string) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDesktop: boolean;
  editSchema: (index: number) => void;
};

export default function ListSchemasSection({
  schemas,
  deleteSchema,
  isDesktop,
  editSchema,
}: ListSchemasProps) {
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [schema, setSchema] = useState<Schema | null>(null);
  const handleEdit = (index: number) => {
    editSchema(index);
  };

  return (
    <div className="flex flex-col gap-6">
      {schemas.map((schema, idx) => {
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
                      onSelect={() => {
                        setSchema(schema);
                        handleEdit(idx);
                        setOpen(prev => !prev);
                      }}
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
                        setSchema(schema);
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
                      https://mockden.com/api/project-slug/
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
      <SchemaFormDialog
        open={open}
        setOpen={setOpen}
        isDesktop={isDesktop}
        schema={schema!}
        title="Edit Schema"
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
            <AlertDialogAction
              className={buttonVariants({ variant: 'destructive' })}
              onClick={() => deleteSchema(schema!.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
