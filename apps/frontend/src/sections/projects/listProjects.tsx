import type { Project } from '@shared/lib/types';

import ProjectFormDialog from '@frontend/components/projectForm/projectForm';
import { TypographyH5, TypographyP } from '@frontend/components/typography/typography';
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
	CardFooter,
	CardHeader,
	CardTitle,
} from '@frontend/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@frontend/components/ui/dropdownMenu';
import { useDeleteProjectMutation } from '@frontend/hooks/useProjects';
import { useProjectStore } from '@frontend/stores/projectStore';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { ArrowRight, EllipsisVertical, Loader2Icon, Pencil, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';

export default function ListProjectsSection() {
	const queryClient = useQueryClient();
	const projects = queryClient.getQueryData<Project[]>(['projects']) ?? [];

	const { selectedProject, setSelectedProject } = useProjectStore();

	const deleteProjectMutation = useDeleteProjectMutation();

	const [openEdit, setOpenEdit] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [openAlert, setOpenAlert] = useState(false);
	const navigate = useNavigate();

	const handleEdit = useCallback(
		(project: Project) => {
			setSelectedProject(project);
			setOpenEdit(true);
		},
		[setSelectedProject]
	);

	const handleClick = useCallback(
		(projectSlug: string) => {
			navigate({
				to: '/projects/$projectSlug/schemas',
				params: { projectSlug },
			});
		},
		[navigate]
	);

	const handleDelete = useCallback(async () => {
		if (!selectedProject) return;
		setIsDeleting(true);
		deleteProjectMutation.mutate(selectedProject.id, {
			onSuccess: result => {
				if ('id' in result) {
					setOpenAlert(false);
				}
				setIsDeleting(false);
			},
		});
	}, [selectedProject, deleteProjectMutation]);

	return (
		<div className="flex flex-col flex-wrap gap-4 sm:flex-row">
			{projects.map(project => (
				<Card key={project.id} className="w-full gap-4 sm:w-sm">
					<CardHeader>
						<CardTitle>
							<TypographyH5>{project.name}</TypographyH5>
						</CardTitle>
						<CardAction>
							<DropdownMenu>
								<DropdownMenuTrigger asChild className="cursor-pointer">
									<EllipsisVertical />
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start">
									<DropdownMenuItem className="cursor-pointer" onSelect={() => handleEdit(project)}>
										<Button
											type="button"
											variant="link"
											className="w-full justify-start hover:no-underline"
										>
											<Pencil /> Edit
										</Button>
									</DropdownMenuItem>
									<DropdownMenuItem
										className="cursor-pointer text-destructive"
										onSelect={() => {
											setSelectedProject(project);
											setOpenAlert(true);
										}}
									>
										<Button
											type="button"
											variant="link"
											className="w-full justify-start text-destructive hover:no-underline"
										>
											<Trash2 className="text-destructive" /> Delete
										</Button>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</CardAction>
					</CardHeader>
					<CardContent>
						<TypographyP className="text-muted-foreground">{project.description}</TypographyP>
					</CardContent>
					<CardFooter>
						<Button onClick={() => handleClick(project.slug)}>
							Goto Schema <ArrowRight />
						</Button>
					</CardFooter>
				</Card>
			))}
			<ProjectFormDialog open={openEdit} setOpen={setOpenEdit} title="Edit Project" />

			<AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete your Project with all its
							schemas and records.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
							{isDeleting && <Loader2Icon className="animate-spin" />}
							Delete
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
