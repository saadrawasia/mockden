import { CircleCheck } from 'lucide-react';
import type React from 'react';
import { useFeatureFlag } from '../../providers/featureFlags';
import { TypographyH4, TypographyP } from '../typography/typography';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';

type PricingCardsProps = {
	freePlanBtn: React.ReactNode;
	proPlanBtn: React.ReactNode;
};

export default function PricingCards({ freePlanBtn, proPlanBtn }: PricingCardsProps) {
	const { isEnabled: isPaymentEnabled } = useFeatureFlag('payment_enabled');
	return (
		<>
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
				<CardFooter>{freePlanBtn}</CardFooter>
			</Card>
			{isPaymentEnabled && (
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
					<CardFooter>{proPlanBtn}</CardFooter>
				</Card>
			)}
		</>
	);
}
