import type { User } from '@/apps/shared/src/lib/types';
import type { Subscription } from '@paddle/paddle-node-sdk';

type getPlanTierProps = {
	user: User;
	subscription: Subscription;
	checkScheduledChange?: boolean;
};

export const getPlanTier = ({
	user,
	subscription,
	checkScheduledChange = false,
}: getPlanTierProps) => {
	if ('status' in subscription) {
		if (checkScheduledChange && subscription.scheduledChange?.action === 'cancel') {
			return 'free';
		}
		if (subscription.status === 'active') {
			return 'pro';
		}
		return 'free';
	}

	return user.planTier;
};
