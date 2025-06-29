import { RequireAuth } from "@frontend/components/requireAuth/requireAuth";
import SchemasPage from "@frontend/pages/schemas";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/projects/$projectSlug/schemas")({
	component: () => (
		<RequireAuth>
			<SchemasPage />
		</RequireAuth>
	),
	loader: async ({ params }) => {
		return {
			projectSlug: params.projectSlug,
		};
	},
	pendingComponent: () => <div>Loading...</div>,
});
