import DeleteAccountSection from '@frontend/sections/userSettings/deleteAccount';

import { TypographyH2, TypographyH3 } from '../../components/typography/typography';
import { UserSettingsSidebar } from '../../components/userSettingsSidebar/userSettingsSidebar';
import PageShell from '../../pageShell';

export default function DeleteAccountPage() {
	return (
		<PageShell>
			<title>Mockden - User Settings</title>
			<meta
				name="description"
				content="Create, validate, and manage mock data with schemas. Built for
            developers who demand reliability and speed."
			/>

			<TypographyH2>User Settings</TypographyH2>
			<div className="mx-auto flex w-full flex-col gap-16 lg:flex-row">
				<UserSettingsSidebar activeSection="Delete Account" />
				<div className="mx-auto flex max-w-xl flex-col gap-4">
					<TypographyH3>Delete Account</TypographyH3>
					<DeleteAccountSection />
				</div>
			</div>
		</PageShell>
	);
}
