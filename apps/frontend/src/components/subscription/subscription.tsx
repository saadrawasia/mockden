import { type Paddle, initializePaddle } from '@paddle/paddle-js';
import { Loader2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useCancelSubscriptionMutation, useSubscriptionsQuery } from '../../hooks/useSubscriptions';
import { useUsersQuery } from '../../hooks/useUsers';
import PricingCards from '../pricingCards/pricingCards';
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '../ui/alertDialog';
import { Button } from '../ui/button';

export default function Subscription() {
	const PADDLE_TOKEN = import.meta.env.VITE_PADDLE_CLIENT_SIDE_TOKEN;
	const BASE_URL = import.meta.env.VITE_BASE_URL;
	const [paddle, setPaddle] = useState<Paddle>();
	const { data: user } = useUsersQuery();
	const planTier = user.planTier;
	const userSubscription = user.subscription;
	const { data: subscription } = useSubscriptionsQuery(userSubscription.subscriptionId);
	const cancelSubscriptionMutation = useCancelSubscriptionMutation();
	const [isDeleting, setIsDeleting] = useState(false);
	const [openAlert, setOpenAlert] = useState(false);

	const openPaddle = () => {
		if (!paddle || planTier === 'pro') return;
		paddle.Checkout.open({
			items: [{ priceId: 'pri_01jzwbfm7g9wqywsvwf87zm947', quantity: 1 }],
			settings: {
				displayMode: 'overlay',
				theme: 'light',
				successUrl: `${BASE_URL}/user-settings/subscriptions?success=true`,
				variant: 'one-page',
				showAddDiscounts: false,
				allowLogout: false,
			},
			customer: {
				email: user.email || '',
			},
			customData: { userEmail: user.email, clerkId: user.clerkUserId },
		});
	};
	useEffect(() => {
		initializePaddle({
			environment: 'sandbox',
			token: PADDLE_TOKEN,
		}).then(paddle => {
			setPaddle(paddle);
		});
	}, []);

	const handleFreePlan = () => {
		if (user.planTier === 'free') {
			return;
		}

		setOpenAlert(prev => !prev);
	};

	const cancelSubscription = async () => {
		setIsDeleting(true);
		const mutate = await cancelSubscriptionMutation.mutateAsync({
			subId: subscription.id,
		});
		if (mutate.message !== 'Subscription Cancelled') {
			toast.error('Something went wrong!', {
				description: 'Could not cancel subscription.',
			});
			return;
		}
		setOpenAlert(false);
		setIsDeleting(false);
	};

	return (
		<>
			<div className="flex flex-col gap-6 md:flex-row">
				<PricingCards
					freePlanBtn={
						<Button className="w-full" disabled={planTier === 'free'} onClick={handleFreePlan}>
							{planTier === 'free' ? 'Current Plan' : 'Move to Free'}
						</Button>
					}
					proPlanBtn={
						<Button
							variant="secondary"
							className="w-full"
							onClick={openPaddle}
							disabled={planTier === 'pro'}
						>
							{planTier === 'free' ? 'Upgrade to Pro' : 'Current Plan'}
						</Button>
					}
				/>
			</div>
			<AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>We're sorry to see you go!</AlertDialogTitle>
						<AlertDialogDescription>
							Your Pro plan has been cancelled. You'll continue to have access to Pro features until
							the end of your billing cycle. If you change your mind, you can upgrade again anytime.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Close</AlertDialogCancel>
						<Button variant="destructive" onClick={cancelSubscription} disabled={isDeleting}>
							{isDeleting && <Loader2Icon className="animate-spin" />}
							Cancel Subscription
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
