import { Link, useNavigate } from '@tanstack/react-router';
import { CreditCard, Settings, Trash } from 'lucide-react';
import { Button } from '../ui/button';

// Menu items.
const items = [
	{
		title: 'General',
		url: '/user-settings/general',
		icon: <Settings />,
	},
	{
		title: 'Subscriptions',
		url: '/user-settings/subscriptions',
		icon: <CreditCard />,
	},
	{
		title: 'Delete Account',
		url: '/user-settings/delete-account',
		icon: <Trash />,
	},
];

export function UserSettingsSidebar({ activeSection }: { activeSection: string }) {
	const navigate = useNavigate();
	const selectedMenu = items.find(items => items.title === activeSection);

	return (
		<>
			{/* Mobile Menu Toggle */}
			<div className="border-gray-200 border-b px-4 py-3 lg:hidden">
				<select
					className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
					onChange={event => navigate({ to: event.target.value })}
					defaultValue={selectedMenu?.url}
				>
					{items.map(item => (
						<option key={item.title} value={item.url}>
							{item.title}
						</option>
					))}
				</select>
			</div>

			{/* Sidebar - Hidden on mobile */}
			<div className="hidden w-64 p-6 lg:block">
				<nav className="flex flex-col gap-2 space-y-1">
					{items.map(item => (
						<Link to={item.url} key={item.title}>
							<Button
								type="button"
								variant="link"
								className={`w-full items-start justify-start rounded-lg px-3 py-2 transition-colors hover:no-underline ${
									activeSection === item.title
										? 'bg-gray-100 font-medium text-gray-900'
										: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
								}`}
							>
								{item.icon}
								{item.title}
							</Button>
						</Link>
					))}
				</nav>
			</div>
		</>
	);
}
