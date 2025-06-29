import { useUser } from "@clerk/clerk-react";
import { Button } from "@frontend/components/ui/button";
import { useEditUserMutation } from "@frontend/hooks/useUsers";
import { UserDetailsZod } from "@shared/validators/userValidator";
import { useForm } from "@tanstack/react-form";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";

import { TypographyCaption, TypographyH5 } from "../../components/typography/typography";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { ErrorInfo } from "../../components/ui/errorInfo";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

export default function UserDetailsSection() {
	const [errorMessage, setErrorMessage] = useState("");
	const { user } = useUser();
	const editUserMutation = useEditUserMutation();

	const form = useForm({
		defaultValues: {
			firstName: user?.firstName ?? "",
			lastName: user?.lastName ?? "",
		},
		onSubmit: async ({ value }) => {
			// Do something with form data
			setErrorMessage("");
			const mutate = await editUserMutation.mutateAsync({
				firstName: value.firstName,
				lastName: value.lastName,
			});
			if (mutate.message !== "User updated.") {
				setErrorMessage(mutate.message);
			}
		},
	});

	return (
		<Card>
			<CardHeader>
				<TypographyH5>User Details</TypographyH5>
			</CardHeader>
			<CardContent>
				<form
					onSubmit={e => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className="flex flex-col gap-4"
				>
					<div className="flex flex-col gap-2">
						{/* A type-safe field component */}
						<form.Field
							name="firstName"
							validators={{
								onChange: ({ value }) => {
									const result = UserDetailsZod.shape.name.safeParse(value);
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
											<Label htmlFor={field.name}>First Name</Label>
											<Input
												type="text"
												id={field.name}
												placeholder="First Name"
												name={field.name}
												value={field.state.value}
												// onBlur={field.handleBlur}
												onChange={e => field.handleChange(e.target.value)}
												aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
											/>
										</div>
										<ErrorInfo field={field} />
									</>
								);
							}}
						/>
					</div>
					<div className="flex flex-col gap-2">
						{/* A type-safe field component */}
						<form.Field
							name="lastName"
							validators={{
								onChange: ({ value }) => {
									const result = UserDetailsZod.shape.name.safeParse(value);
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
											<Label htmlFor={field.name}>Last Name</Label>
											<Input
												type="text"
												id={field.name}
												placeholder="Last Name"
												name={field.name}
												value={field.state.value}
												// onBlur={field.handleBlur}
												onChange={e => field.handleChange(e.target.value)}
												aria-invalid={field.state.meta.isTouched && !field.state.meta.isValid}
											/>
										</div>
										<ErrorInfo field={field} />
									</>
								);
							}}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="email">Email</Label>
						<Input
							type="email"
							id="email"
							placeholder="Email Address"
							name="email"
							value={user?.primaryEmailAddress?.emailAddress}
							disabled
						/>
					</div>
					{errorMessage && (
						<TypographyCaption className="text-destructive">{errorMessage}</TypographyCaption>
					)}
					<form.Subscribe
						selector={state => [state.canSubmit, state.isSubmitting]}
						children={([canSubmit, isSubmitting]) => (
							<>
								{isSubmitting.toString()}
								<Button type="submit" disabled={!canSubmit || isSubmitting} className="self-end">
									{isSubmitting && <Loader2Icon className="animate-spin" />}
									Save
								</Button>
							</>
						)}
					/>
				</form>
			</CardContent>
		</Card>
	);
}
