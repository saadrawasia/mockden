import { type Paddle, initializePaddle } from '@paddle/paddle-js';
import { CircleCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useUsersQuery } from '../../hooks/useUsers';
import { TypographyH4, TypographyP } from '../typography/typography';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';

export default function Subscription() {
	const PADDLE_TOKEN = import.meta.env.VITE_PADDLE_CLIENT_SIDE_TOKEN;
	const BASE_URL = import.meta.env.VITE_BASE_URL;
	const [paddle, setPaddle] = useState<Paddle>();
	const { data: user } = useUsersQuery();
	const planTier = user.planTier;

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

	return (
		<>
			<div className="flex flex-col gap-6 md:flex-row">
				<Card>
					<CardHeader>
						<CardTitle>Starter</CardTitle>
						<CardDescription>Free. Forever</CardDescription>
					</CardHeader>
					<CardContent className=" flex flex-col gap-2">
						<TypographyH4>
							$0
							<span className="font-medium text-sm">/month</span>
						</TypographyH4>
						<TypographyP className="inline-flex gap-2">
							<CircleCheck className="text-green-500" />1 Project
						</TypographyP>
						<TypographyP className="inline-flex gap-2">
							<CircleCheck className="text-green-500" />
							Upto 3 Schemas/Project
						</TypographyP>
						<TypographyP className="inline-flex gap-2">
							<CircleCheck className="text-green-500" />
							Upto 100 records per Schema
						</TypographyP>
						<TypographyP className="inline-flex gap-2">
							<CircleCheck className="text-green-500" />
							100 API calls per day
						</TypographyP>
					</CardContent>
					<CardFooter>
						<Button className="w-full" disabled={planTier === 'free'}>
							{planTier === 'free' ? 'Current Plan' : 'Move to Free'}
						</Button>
					</CardFooter>
				</Card>

				<Card className="bg-neutral-900 text-white">
					<CardHeader>
						<CardTitle>Pro</CardTitle>
						<CardDescription>If you want more.</CardDescription>
					</CardHeader>
					<CardContent className=" flex flex-col gap-2">
						<TypographyH4>
							$15
							<span className="font-medium text-sm">/month</span>
						</TypographyH4>
						<TypographyP className="inline-flex gap-2">
							<CircleCheck className="text-green-500" />
							Upto 5 Projects
						</TypographyP>
						<TypographyP className="inline-flex gap-2">
							<CircleCheck className="text-green-500" />
							Upto 15 Schemas/Project
						</TypographyP>
						<TypographyP className="inline-flex gap-2">
							<CircleCheck className="text-green-500" />
							Upto 1000 records per Schema
						</TypographyP>
						<TypographyP className="inline-flex gap-2">
							<CircleCheck className="text-green-500" />
							1000 API calls per day
						</TypographyP>
					</CardContent>
					<CardFooter>
						<Button
							variant="secondary"
							className="w-full"
							onClick={openPaddle}
							disabled={planTier === 'pro'}
						>
							{planTier === 'free' ? 'Upgrade to Pro' : 'Current Plan'}
						</Button>
					</CardFooter>
				</Card>
			</div>
		</>
	);
}
