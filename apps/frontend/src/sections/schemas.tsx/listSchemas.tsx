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
import { Badge } from '../../components/ui/badge';
import { cn } from '../../lib/utils';

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
                <Badge
                  variant="outline"
                  className={cn('px-3 py-1 rounded-full', {
                    'text-green-500 border-green-500 bg-green-50': schema.status === 'active',
                    'text-red-500 border-red-500 bg-red-50': schema.status === 'inactive',
                  })}
                >
                  {schema.status}
                </Badge>
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
                  <div className="cursor-pointer flex gap-2 group">
                    <TypographyP className="text-muted-foreground">
                      https://mockden.com/api/project-slug/
                      {schema.slug}
                    </TypographyP>
                    <Copy className="md:hidden hidden group-hover:flex text-muted-foreground" size={20} />
                  </div>
                </div>

                <div>
                  <TypographyP className="font-semibold">Custom Headers:</TypographyP>
                  <div className="cursor-pointer flex gap-2 group">
                    <TypographyP className="text-muted-foreground">
                      x-mockden-key: random-api-key
                    </TypographyP>
                    <Copy className="md:hidden hidden group-hover:flex text-muted-foreground" size={20} />
                  </div>
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
