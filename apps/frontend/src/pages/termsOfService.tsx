import PageShell from '../pageShell';

export default function TermsOfService() {
	return (
		<PageShell>
			<title>Mockden - Terms of Service</title>
			<meta
				name="description"
				content="Create, validate, and manage mock data with schemas. Built for
                  developers who demand reliability and speed."
			/>

			<div className="mx-auto max-w-4xl p-6 text-gray-800">
				<h1 className="mb-6 text-center font-bold text-3xl">Terms of Service</h1>

				<p className="mb-4 font-medium">Effective Date: 20.07.2025</p>

				<p className="mb-4">
					Welcome to Mockden! These Terms of Service ("Terms") govern your access to and use of the
					Mockden platform and services ("Service", "Services") provided by Mockden ("we", "us",
					"our"). By accessing or using our Service, you agree to be bound by these Terms.
				</p>

				<h2 className="mt-6 mb-2 font-semibold text-xl">1. Eligibility</h2>
				<p className="mb-4">
					You must be at least 18 years old and capable of entering into a legally binding agreement
					to use the Service. By registering or using Mockden, you confirm that you meet these
					requirements.
				</p>

				<h2 className="mt-6 mb-2 font-semibold text-xl">2. Description of Service</h2>
				<p className="mb-4">
					Mockden is a SaaS platform that enables developers and teams to rapidly prototype, test,
					and validate APIs and data-driven applications. The platform supports schema validation,
					mock data generation, and environment management. It is intended for{' '}
					<strong>development, testing, and educational purposes only</strong> — not for production
					use or the storage of sensitive personal data.
				</p>

				<h2 className="mt-6 mb-2 font-semibold text-xl">
					3. Account Registration and Authentication
				</h2>
				<p className="mb-4">
					To access key features, users must create an account. We use{' '}
					<a
						href="https://clerk.com"
						className="text-blue-600 underline"
						target="_blank"
						rel="noopener noreferrer"
					>
						Clerk
					</a>{' '}
					as our third-party authentication provider, which includes support for Google Sign-In and
					other social login methods. By registering, you agree to Clerk’s terms and privacy policy.
					You are responsible for maintaining the confidentiality of your account credentials and
					for all activity under your account.
				</p>

				<h2 className="mt-6 mb-2 font-semibold text-xl">4. Payments and Billing</h2>
				<p className="mb-4">
					If you purchase a paid subscription, payment processing is handled by{' '}
					<a
						href="https://paddle.com"
						className="text-blue-600 underline"
						target="_blank"
						rel="noopener noreferrer"
					>
						Paddle
					</a>
					, our Merchant of Record. Paddle manages invoicing, VAT, and payment security. We do not
					store or process credit card information directly.
				</p>

				<h2 className="mt-6 mb-2 font-semibold text-xl">5. Infrastructure and Hosting</h2>
				<p className="mb-4">
					Mockden is deployed and hosted on{' '}
					<a
						href="https://railway.app"
						className="text-blue-600 underline"
						target="_blank"
						rel="noopener noreferrer"
					>
						Railway
					</a>
					. While we manage application logic and data, some operations are facilitated by Railway’s
					infrastructure.
				</p>

				<h2 className="mt-6 mb-2 font-semibold text-xl">6. Acceptable Use</h2>
				<ul className="mb-4 list-inside list-disc">
					<li>Use the Service only for lawful purposes.</li>
					<li>
						Do not store, transmit, or process sensitive personal data (e.g., health info,
						government IDs, or financial records).
					</li>
					<li>
						Do not interfere with the platform’s operation, reverse engineer, or exploit it in
						unauthorized ways.
					</li>
				</ul>

				<h2 className="mt-6 mb-2 font-semibold text-xl">7. Intellectual Property</h2>
				<p className="mb-4">
					All rights, title, and interest in and to Mockden, including trademarks, source code, and
					documentation, are owned by Mockden. You retain ownership of your own content and schemas.
				</p>

				<h2 className="mt-6 mb-2 font-semibold text-xl">8. Service Availability and Changes</h2>
				<p className="mb-4">
					We may modify, suspend, or discontinue the Service at any time, with or without notice. We
					are not liable for any interruptions or changes.
				</p>

				<h2 className="mt-6 mb-2 font-semibold text-xl">9. Termination</h2>
				<p className="mb-4">
					We may suspend or terminate your account if you violate these Terms. You may also delete
					your account at any time.
				</p>

				<h2 className="mt-6 mb-2 font-semibold text-xl">10. Disclaimer of Warranties</h2>
				<p className="mb-4">
					The Service is provided "as is" and "as available" without warranties of any kind. Use is
					at your own risk.
				</p>

				<h2 className="mt-6 mb-2 font-semibold text-xl">11. Limitation of Liability</h2>
				<p className="mb-4">
					To the fullest extent permitted by law, Mockden and its affiliates are not liable for any
					indirect, incidental, or consequential damages.
				</p>

				<h2 className="mt-6 mb-2 font-semibold text-xl">12. Governing Law and Jurisdiction</h2>
				<p className="mb-4">
					These Terms are governed by the laws of the Islamic Republic of Pakistan. You agree that
					any legal disputes will be handled exclusively by courts in Pakistan.
				</p>

				<h2 className="mt-6 mb-2 font-semibold text-xl">13. Third-Party Services</h2>
				<ul className="mb-4 list-inside list-disc">
					<li>
						<strong>Clerk</strong> – User authentication and identity management
					</li>
					<li>
						<strong>Paddle</strong> – Billing and payment processing
					</li>
					<li>
						<strong>Railway</strong> – Cloud hosting and infrastructure
					</li>
				</ul>

				<h2 className="mt-6 mb-2 font-semibold text-xl">14. Contact</h2>
				<p>
					For questions or concerns about these Terms, contact us at:{' '}
					<strong>support@mockden.com</strong>
				</p>
			</div>
		</PageShell>
	);
}
