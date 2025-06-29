import ChangePasswordSection from "@frontend/sections/userSettings/changePassword";
import DeleteAccountSection from "@frontend/sections/userSettings/deleteAccount";
import UserDetailsSection from "@frontend/sections/userSettings/userDetails";

import { TypographyH2 } from "../components/typography/typography";
import PageShell from "../pageShell";

export default function UserSettingsPage() {
	return (
		<PageShell>
			<title>Mockden - User Settings</title>
			<meta
				name="description"
				content="Create, validate, and manage mock data with schemas. Built for
            developers who demand reliability and speed."
			/>

			<TypographyH2>User Settings</TypographyH2>

			<div className="mx-auto flex w-full max-w-xl flex-col gap-4">
				<UserDetailsSection />
				<ChangePasswordSection />
				<DeleteAccountSection />
			</div>
		</PageShell>
	);
}
