import ChangePasswordSection from '@frontend/sections/userSettings/changePassword';
import UserDetailsSection from '@frontend/sections/userSettings/userDetails';

import { TypographyH2, TypographyH3 } from '../../components/typography/typography';
import { UserSettingsSidebar } from '../../components/userSettingsSidebar/userSettingsSidebar';
import PageShell from '../../pageShell';

export default function UserSettingsPage() {
	return (
		<PageShell>
			<title>Mockden - Account Settings</title>
			<meta
				name="description"
				content="Create, validate, and manage mock data with schemas. Built for
            developers who demand reliability and speed."
			/>

			<TypographyH2>Account Settings</TypographyH2>
			<div className="mx-auto flex w-full flex-col gap-16 lg:flex-row">
				<UserSettingsSidebar activeSection="General" />
				<div className="mx-auto flex w-full max-w-xl flex-col gap-4">
					<TypographyH3>General</TypographyH3>
					<UserDetailsSection />
					<ChangePasswordSection />
				</div>
			</div>
		</PageShell>
	);
}
