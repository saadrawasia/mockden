import NotFoundSVG from "@frontend/assets/404.svg";
import { Button } from "@frontend/components/ui/button";
import { cn } from "@frontend/lib/utils";
import PageShell from "@frontend/pageShell";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export default function PageNotFound() {
	const navigate = useNavigate();
	return (
		<PageShell>
			<title>Mockden - Page Not Found</title>
			<meta
				name="description"
				content="Create, validate, and manage mock data with schemas. Built for
          developers who demand reliability and speed."
			/>
			<div className={cn("flex flex-auto flex-col items-center justify-center gap-8 text-center")}>
				<img src={NotFoundSVG} alt="create-project" className="sm:w-md" />

				<Button
					onClick={() => {
						navigate({
							to: "/",
						});
					}}
				>
					<ArrowLeft /> Go Home
				</Button>
			</div>
		</PageShell>
	);
}
