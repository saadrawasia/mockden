import PageShell from '../pageShell';

export default function RefundPolicy() {
	return (
		<PageShell>
			<title>Mockden - Refund Policy</title>
			<meta
				name="description"
				content="Create, validate, and manage mock data with schemas. Built for
                  developers who demand reliability and speed."
			/>
			<div className="mx-auto max-w-4xl p-6 text-gray-800">
				<h1 className="mb-6 text-center font-bold text-3xl">Refund Policy</h1>

				<p className="mb-4 font-medium">Effective Date: 20.07.2025</p>

				<p className="mb-4">
					Thank you for choosing <strong>Mockden</strong>. Please read this Refund Policy carefully
					before subscribing to any of our paid plans. By purchasing a subscription, you agree to
					the terms outlined below.
				</p>

				<h2 className="mt-6 mb-2 font-semibold text-xl">1. No Refunds</h2>
				<p className="mb-4">
					All payments made to Mockden are <strong>final and non-refundable</strong>, including but
					not limited to:
				</p>
				<ul className="mb-4 list-inside list-disc">
					<li>Monthly or annual subscription fees</li>
					<li>Charges resulting from account upgrades</li>
					<li>Renewals of existing plans</li>
				</ul>
				<p className="mb-4">
					We do <strong>not offer refunds</strong> under any circumstances, including partial use,
					accidental purchases, or dissatisfaction with the Service.
				</p>

				<h2 className="mt-6 mb-2 font-semibold text-xl">2. Free Plan</h2>
				<p className="mb-4">
					Mockden offers a <strong>free plan</strong> that allows users to explore the platform with
					limited functionality. We encourage all users to evaluate the service using the free plan{' '}
					<strong>before</strong> committing to a paid subscription. There is{' '}
					<strong>no trial period</strong> for paid plans.
				</p>

				<h2 className="mt-6 mb-2 font-semibold text-xl">3. Subscription Cancellation</h2>
				<p className="mb-4">
					You may cancel your subscription at any time via your user settings. After cancellation:
				</p>
				<ul className="mb-4 list-inside list-disc">
					<li>Your subscription will remain active until the end of the current billing cycle.</li>
					<li>
						You will <strong>not</strong> be billed again unless you resubscribe.
					</li>
					<li>
						<strong>No prorated refunds</strong> will be issued for unused time.
					</li>
				</ul>

				<h2 className="mt-6 mb-2 font-semibold text-xl">4. Billing Responsibility</h2>
				<p className="mb-4">
					It is your responsibility to manage and cancel your subscription before the renewal date
					to avoid being charged. We do not offer refunds for subscriptions that were not cancelled
					on time.
				</p>

				<h2 className="mt-6 mb-2 font-semibold text-xl">5. Contact</h2>
				<p className="mb-4">
					If you have any questions regarding this policy, please contact us at:{' '}
					<strong>support@mockden.com</strong>
				</p>
			</div>
		</PageShell>
	);
}
