import type { User } from '@/apps/shared/src/lib/types';
import type { Subscription } from '@paddle/paddle-node-sdk';

type getPlanTierProps = {
	user: User;
	subscription: Subscription;
};

export const getPlanTier = ({ user, subscription }: getPlanTierProps) => {
	if ('status' in subscription) {
		if (subscription.scheduledChange?.action === 'cancel') {
			return 'free';
		}
		if (subscription.status === 'active') {
			return 'pro';
		}
		return 'free';
	}

	return user.planTier;
};
