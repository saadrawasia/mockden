import { type Paddle, initializePaddle } from '@paddle/paddle-js';
import type { Subscription as PaddleSubscription } from '@paddle/paddle-node-sdk';
import { limitations } from '@shared/lib/config';
import { useRouter } from '@tanstack/react-router';
import { Loader2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useProjectsQuery } from '../../hooks/useProjects';
import { useCancelSubscriptionMutation, useSubscriptionsQuery } from '../../hooks/useSubscriptions';
import { useUsersQuery } from '../../hooks/useUsers';
import config from '../../lib/config';
import { queryClient } from '../../lib/queryClient';
import { getPlanTier } from '../../lib/subscriptionHelpers';
import { useFeatureFlag } from '../../providers/featureFlags';
import PricingCards from '../pricingCards/pricingCards';
import { TypographyCaption, TypographyH4, TypographyP } from '../typography/typography';
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
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const FreeTierCard = ({ planTier }: { planTier: 'free' | 'pro' }) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>
					Current Plan: <span className="capitalize">{planTier}</span>
				</CardTitle>
			</CardHeader>
			<CardContent className=" flex flex-col gap-2">
				<TypographyH4>
					$0
					<span className="font-medium text-sm">/month</span>
				</TypographyH4>
				<TypographyCaption className="text-muted-foreground">
					Upgrade to unlock Pro features
				</TypographyCaption>
			</CardContent>
		</Card>
	);
};

const ProTierCard = ({
	planTier,
	subscription,
	handleFreePlan,
}: { planTier: 'free' | 'pro'; subscription: PaddleSubscription; handleFreePlan: () => void }) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>
					Current Plan: <span className="capitalize">{planTier}</span>
				</CardTitle>
			</CardHeader>
			<CardContent className=" flex flex-col items-start gap-2">
				<TypographyH4>
					$15
					<span className="font-medium text-sm">/month</span>
				</TypographyH4>
				{subscription.nextBilledAt && (
					<>
						<TypographyP className="text-muted-foreground">
							Next Billed At: {new Date(subscription.nextBilledAt).toLocaleDateString()}
						</TypographyP>
						<Button onClick={handleFreePlan}>Cancel Subscription</Button>
					</>
				)}
				{subscription.scheduledChange?.action === 'cancel' && (
					<TypographyP className="text-muted-foreground">
						Your subscription will be cancelled on{' '}
						{new Date(subscription.scheduledChange.effectiveAt).toLocaleDateString()} at the end of
						billing cycle.
					</TypographyP>
				)}
			</CardContent>
		</Card>
	);
};

export default function Subscription() {
	const { PADDLE_TOKEN, PADDLE_ENV, BASE_URL } = config;
	const [paddle, setPaddle] = useState<Paddle>();
	const { data: user } = useUsersQuery();
	const { isEnabled: isPaymentEnabled } = useFeatureFlag('payment_enabled');

	const userSubscription = user.subscription;
	const { data: subscription } = useSubscriptionsQuery(userSubscription?.subscriptionId);
	const { data: projects } = useProjectsQuery(true);
	const cancelSubscriptionMutation = useCancelSubscriptionMutation();
	const [isDeleting, setIsDeleting] = useState(false);
	const [openAlert, setOpenAlert] = useState(false);
	const planTier = getPlanTier({ user, subscription });
	const router = useRouter();

	const openPaddle = () => {
		if (!paddle || planTier === 'pro') return;
		paddle.Checkout.open({
			items: [{ priceId: config.PADDLE_PRICE_ID, quantity: 1 }],
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
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (isPaymentEnabled) {
			initializePaddle({
				environment: PADDLE_ENV,
				token: PADDLE_TOKEN,
			}).then(paddle => {
				setPaddle(paddle);
			});
		}
	}, []);

	const handleFreePlan = () => {
		if (planTier === 'free') {
			return;
		}

		if (projects.length > limitations.free.projects) {
			toast.warning('Cannot move to free plan', {
				description: `Please make sure that your Projects are compatible with free plan. You should have maximum of ${limitations.free.projects} Project(s)`,
				duration: 5000,
				dismissible: true,
			});

			return;
		}

		if (
			projects.length === 1 &&
			projects[0].schemas &&
			projects[0].schemas.length > limitations.free.schemas
		) {
			toast.warning('Cannot move to free plan', {
				description: `Please make sure that your Schemas are compatible with free plan. You should have maximum of ${limitations.free.schemas} Schema(s)`,
				duration: 5000,
				dismissible: true,
			});

			return;
		}

		if (subscription?.scheduledChange?.action === 'cancel') {
			toast.warning('Cannot move to free plan', {
				description: `You Pro plan is already scheduled to cancel on ${new Date(subscription?.scheduledChange.effectiveAt).toLocaleDateString()}`,
				duration: 5000,
				dismissible: true,
			});

			return;
		}

		setOpenAlert(prev => !prev);
	};

	const cancelSubscription = async () => {
		if (!subscription?.id) {
			toast.error('No subscription found to cancel.');
			return;
		}
		setIsDeleting(true);
		const mutate = await cancelSubscriptionMutation.mutateAsync({
			subId: subscription!.id,
		});
		if (mutate.message !== 'Subscription Cancelled.') {
			toast.error('Something went wrong!', {
				description: 'Could not cancel subscription.',
			});
			return;
		}

		toast.success('Subscription Cancelled.', {
			description: 'The changes will appear in couple of seconds.',
		});

		setOpenAlert(false);
		setIsDeleting(false);
		queryClient.invalidateQueries({ queryKey: ['user'] });
		queryClient.invalidateQueries({ queryKey: ['paddle-subscription'] });
		router.navigate({ to: '/user-settings/subscriptions', search: { success: true } });
	};

	let proPlanBtnText = 'Coming Soon';

	if (isPaymentEnabled) {
		proPlanBtnText = 'Upgrade to Pro';
	} else if (planTier === 'pro') {
		proPlanBtnText = 'Current Plan';
	}

	return (
		<>
			<div className="flex flex-col gap-6">
				{planTier === 'free' ? (
					<FreeTierCard planTier={planTier} />
				) : (
					<ProTierCard
						planTier={planTier}
						subscription={subscription!}
						handleFreePlan={handleFreePlan}
					/>
				)}
			</div>
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
							disabled={planTier === 'pro' || !isPaymentEnabled}
						>
							{proPlanBtnText}
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
