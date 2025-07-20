/* eslint-disable unicorn/filename-case */
import { SignIn } from '@clerk/clerk-react';
import { TypographyP } from '@frontend/components/typography/typography';
import { Button } from '@frontend/components/ui/button';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';

export const Route = createFileRoute('/sign-in')({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	return (
		<>
			<title>Mockden - Sign Up</title>

			<div className="mx-auto flex min-h-screen w-fit flex-col justify-center">
				<div className="flex">
					<Button
						variant="link"
						className="hover:no-underline"
						onClick={() =>
							navigate({
								to: '/',
							})
						}
					>
						<ArrowLeft /> <TypographyP>Go Home</TypographyP>
					</Button>
				</div>
				<SignIn signUpUrl="/sign-up" forceRedirectUrl="/projects" />
			</div>
		</>
	);
}
