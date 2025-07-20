import type { FeatureFlagKey } from '../../lib/featureFlags';
import { useFeatureFlags } from '../../providers/featureFlags';

// Admin panel for managing feature flags
export default function FeatureFlagsAdmin() {
	const { flags, toggleFlag } = useFeatureFlags();

	const formatFlagName = (flag: string): string => {
		return flag.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
	};

	return (
		<div className="mx-auto mt-4 w-xl rounded-lg border bg-gray-50 p-6">
			<div className="mb-4 flex items-center justify-between">
				<h3 className="font-semibold text-gray-800 text-lg">Feature Flag Admin</h3>
			</div>

			<div className="space-y-3">
				{(Object.entries(flags) as [FeatureFlagKey, boolean][]).map(([flag, enabled]) => (
					<div key={flag} className="flex items-center justify-between rounded border bg-white p-3">
						<div>
							<span className="font-medium text-gray-700">{formatFlagName(flag)}</span>
							<span
								className={`ml-2 rounded px-2 py-1 text-xs ${
									enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
								}`}
							>
								{enabled ? 'Enabled' : 'Disabled'}
							</span>
						</div>
						<div className="flex gap-2">
							<button
								type="button"
								onClick={() => toggleFlag(flag)}
								className={`rounded px-3 py-1 text-sm transition-colors ${
									enabled
										? 'bg-red-500 text-white hover:bg-red-600'
										: 'bg-green-500 text-white hover:bg-green-600'
								}`}
							>
								{enabled ? 'Disable' : 'Enable'}
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
