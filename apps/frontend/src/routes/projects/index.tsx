import { RequireAuth } from "@frontend/components/requireAuth/requireAuth";
import ProjectsPage from "@frontend/pages/projects";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/projects/")({
	component: () => (
		<RequireAuth>
			<ProjectsPage />
		</RequireAuth>
	),
	pendingComponent: () => <div>Loading...</div>,
});
