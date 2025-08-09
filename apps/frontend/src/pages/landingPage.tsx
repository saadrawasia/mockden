import heroImage from '@frontend/assets/hero-mockden.jpg';
import {
	TypographyCaption,
	TypographyH1,
	TypographyH3,
	TypographyH5,
	TypographyLargeP,
} from '@frontend/components/typography/typography';
import { Button } from '@frontend/components/ui/button';
import { Separator } from '@frontend/components/ui/separator';
import PageShell from '@frontend/pageShell';
import { Link, useNavigate } from '@tanstack/react-router';
import { ArrowRight, Code, Database, Zap } from 'lucide-react';
import PricingCards from '../components/pricingCards/pricingCards';
import { useFeatureFlag } from '../providers/featureFlags';

export default function LandingPage() {
	const { isEnabled: isPaymentEnabled } = useFeatureFlag('payment_enabled');
	const navigate = useNavigate();
	let proPlanBtnText = 'Coming Soon';

	if (isPaymentEnabled) {
		proPlanBtnText = 'Get Pro';
	}

	const handleProPlan = () => {
		if (!isPaymentEnabled) {
			return;
		}

		navigate({
			to: '/sign-up',
			search: { proPlan: true },
		});
	};

	return (
		<PageShell>
			<title>Mockden</title>

			{/* Background Image with Overlay */}
			<div className="-z-1 absolute inset-0 ">
				<img
					src={heroImage}
					alt="API development visualization"
					className="h-full w-full object-cover opacity-10"
				/>
				<div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/60 to-transparent" />
			</div>

			{/* Hero Content */}
			<div className="relative z-10 mx-auto max-w-7xl px-6 py-20 text-center">
				<div className="mx-auto max-w-4xl space-y-8">
					{/* Badge */}
					<div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 font-medium text-primary text-sm">
						<Zap className="h-4 w-4" />
						For Developers, By Developers
					</div>

					{/* Main Heading */}
					<TypographyH1 className="font-bold text-5xl leading-tight md:text-7xl">
						Rapid API
						<span className="text-neutral-500"> Prototyping</span>
						<br />
						Made Simple
					</TypographyH1>

					{/* Subtitle */}
					<TypographyLargeP className="mx-auto max-w-3xl text-muted-foreground text-xl leading-relaxed md:text-2xl">
						Define schemas, generate realistic mock data, and validate APIs in minutes. Mockden
						empowers developers to prototype and test data-driven applications with confidence.
					</TypographyLargeP>

					{/* CTA Buttons */}
					<div className="flex flex-col items-center justify-center gap-4 pt-8 sm:flex-row">
						<Link to="/sign-up">
							<Button size="lg" className="grou px-8 py-6 text-lg transition-all duration-300">
								Start Building Free
								<ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
							</Button>
						</Link>
						<Button
							asChild
							variant="outline"
							size="lg"
							className="border-primary/30 px-8 py-6 text-lg transition-all duration-300 hover:border-primary/50"
						>
							<a href="https://docs.mockden.com" target="_blank" rel="noopener noreferrer">
								View Documentation
							</a>
						</Button>
					</div>
				</div>
			</div>

			{/* How it works */}

			<section className="mx-auto grid max-w-4xl gap-8 pt-16 md:grid-cols-3">
				<div className="flex flex-col items-center space-y-3 rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all duration-300">
					<div className="rounded-lg bg-primary/10 p-3">
						<Database className="h-6 w-6 text-primary" />
					</div>
					<TypographyH5 className="">Schema Definition</TypographyH5>
					<TypographyCaption className="text-center text-muted-foreground">
						Create custom data models with our intuitive schema builder
					</TypographyCaption>
				</div>

				<div className="flex flex-col items-center space-y-3 rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all duration-300">
					<div className="rounded-lg bg-primary/10 p-3">
						<Code className="h-6 w-6 text-primary" />
					</div>
					<TypographyH5 className="">Mock Data Generation</TypographyH5>
					<TypographyCaption className="text-center text-muted-foreground">
						Generate realistic test data that matches your schema perfectly
					</TypographyCaption>
				</div>

				<div className="flex flex-col items-center space-y-3 rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all duration-300">
					<div className="rounded-lg bg-primary/10 p-3">
						<Zap className="h-6 w-6 text-primary" />
					</div>
					<TypographyH5 className="">API Simulation</TypographyH5>
					<TypographyCaption className="text-center text-muted-foreground">
						Test your applications with realistic API endpoints instantly
					</TypographyCaption>
				</div>
			</section>

			{/* Schema Image */}
			<section className="flex flex-col items-center gap-4 py-6 md:gap-6 md:py-12 md:pt-24">
				<TypographyH3 className="text-center">Simple. Powerful. Reliable.</TypographyH3>
				<TypographyLargeP className="text-center text-muted-foreground">
					Define your schema once, get validated mock data everywhere.
				</TypographyLargeP>
				<div className="w-xs select-none overflow-x-hidden rounded-2xl bg-black p-8 sm:w-xl md:w-2xl ">
					<div className="mb-6 flex items-center space-x-2">
						<div className="h-3 w-3 rounded-full bg-red-500" />
						<div className="h-3 w-3 rounded-full bg-yellow-500" />
						<div className="h-3 w-3 rounded-full bg-green-500" />
						<span className="ml-4 text-gray-400 text-sm">schema.js</span>
					</div>

					<pre className="text-green-400 text-sm">
						<code className="whitespace-break-spaces break-all">
							{`// Define your schema
POST /mockdata/myproject/schemas
{
  "name": "users",
  "fields": [
    {
      "name": "email",
      "type": "email",
    },
    {
      "name": "age",
      "type": "number",
      "validation": { "min": 18, "max": 100 }
    }
  ]
}

// Get validated mock data
GET /api/myproject/users
// Returns: [
//   { "email": "john@example.com", "age": 25 },
//   { "email": "jane@example.com", "age": 32 }
// ]`}
						</code>
					</pre>
				</div>
			</section>

			<Separator />

			{/* Pricing */}
			<section className="flex flex-col items-center gap-4 py-6 md:gap-6 md:py-12">
				<TypographyH3 className="text-center">Simple, Transparent Pricing</TypographyH3>
				<div className="flex flex-col gap-6 md:flex-row md:gap-24">
					<PricingCards
						freePlanBtn={
							<Link to="/sign-up" className="w-full">
								<Button className="w-full">Get Started</Button>
							</Link>
						}
						proPlanBtn={
							<Button
								variant="secondary"
								className="w-full"
								disabled={!isPaymentEnabled}
								onClick={handleProPlan}
							>
								{proPlanBtnText}
							</Button>
						}
					/>
				</div>
			</section>

			<Separator />

			{/* Ready to Build */}

			<section className="flex flex-col items-center gap-4 text-center md:gap-6">
				<TypographyH3>Ready to Build Better?</TypographyH3>
				<TypographyLargeP className="text-center text-muted-foreground">
					Join Mockden for your mock data needs.
				</TypographyLargeP>
				<Link to="/sign-up">
					<Button>
						Start for Free
						<ArrowRight />
					</Button>
				</Link>
			</section>
		</PageShell>
	);
}
