import PageShell from '../pageShell';

export default function PrivacyPolicy() {
	return (
		<PageShell>
			<title>Mockden - Privacy Policy</title>

			<div className="mx-auto max-w-4xl p-6 text-gray-800">
				<h1 className="mb-6 text-center font-bold text-3xl">Privacy Policy</h1>

				<p className="mb-4 font-medium">Effective Date: 20.07.2025</p>

				<p className="mb-4">
					Your privacy is important to us. This Privacy Policy explains how Mockden ("we", "us",
					"our") collects, uses, and protects your personal information when you use our services.
				</p>

				<h2 className="mt-6 mb-2 font-semibold text-xl">1. Information We Collect</h2>
				<ul className="mb-4 list-inside list-disc">
					<li>
						<strong>Account Information:</strong> Name, email, and login credentials, managed
						through{' '}
						<a
							href="https://clerk.com"
							className="text-blue-600 underline"
							target="_blank"
							rel="noopener noreferrer"
						>
							Clerk
						</a>
						, including Google Sign-In and other social login providers.
					</li>
					<li>
						<strong>Payment Information:</strong> Processed securely by{' '}
						<a
							href="https://paddle.com"
							className="text-blue-600 underline"
							target="_blank"
							rel="noopener noreferrer"
						>
							Paddle
						</a>
						. We do not store payment details.
					</li>
					<li>
						<strong>Usage Data:</strong> Log files, IP address, browser type, and device metadata.
					</li>
					<li>
						<strong>Cookies:</strong> Used to personalize experience and analyze usage.
					</li>
				</ul>

				<h2 className="mt-6 mb-2 font-semibold text-xl">2. How We Use Your Information</h2>
				<ul className="mb-4 list-inside list-disc">
					<li>To provide and maintain the Service.</li>
					<li>To authenticate users (via Clerk).</li>
					<li>To process payments and manage subscriptions (via Paddle).</li>
					<li>To improve platform functionality and performance.</li>
					<li>To communicate service updates and security alerts.</li>
					<li>To comply with legal obligations.</li>
				</ul>

				<h2 className="mt-6 mb-2 font-semibold text-xl">3. Third-Party Services</h2>
				<p className="mb-4">We use the following providers to support our platform:</p>
				<ul className="mb-4 list-inside list-disc">
					<li>
						<strong>Clerk:</strong> For authentication and user management, supporting Google
						Sign-In and other social login methods (
						<a
							href="https://clerk.com"
							className="text-blue-600 underline"
							target="_blank"
							rel="noopener noreferrer"
						>
							clerk.com
						</a>
						)
					</li>
					<li>
						<strong>Paddle:</strong> For payments and billing (
						<a
							href="https://paddle.com"
							className="text-blue-600 underline"
							target="_blank"
							rel="noopener noreferrer"
						>
							paddle.com
						</a>
						)
					</li>
					<li>
						<strong>Railway:</strong> For infrastructure and deployment (
						<a
							href="https://railway.app"
							className="text-blue-600 underline"
							target="_blank"
							rel="noopener noreferrer"
						>
							railway.app
						</a>
						)
					</li>
				</ul>

				<h2 className="mt-6 mb-2 font-semibold text-xl">4. Data Retention</h2>
				<p className="mb-4">
					We retain your data only as long as needed to deliver the service or meet legal
					requirements. You can request deletion of your account and data at any time.
				</p>

				<h2 className="mt-6 mb-2 font-semibold text-xl">5. Data Security</h2>
				<p className="mb-4">
					We implement appropriate security measures including encryption, access controls, and
					secure infrastructure hosting. However, no system is completely secure, and use of the
					Service is at your own risk.
				</p>

				<h2 className="mt-6 mb-2 font-semibold text-xl">6. International Data Transfers</h2>
				<p className="mb-4">
					By using Mockden, you consent to the transfer of your information to systems and providers
					that may be located outside your country, including jurisdictions without equivalent data
					protection laws.
				</p>

				<h2 className="mt-6 mb-2 font-semibold text-xl">7. Your Rights</h2>
				<ul className="mb-4 list-inside list-disc">
					<li>Access or update your personal information.</li>
					<li>Request deletion of your account and data.</li>
					<li>Object to certain types of data processing (as permitted by law).</li>
				</ul>

				<h2 className="mt-6 mb-2 font-semibold text-xl">8. Children's Privacy</h2>
				<p className="mb-4">
					Mockden is not intended for use by children under 13. We do not knowingly collect data
					from minors.
				</p>

				<h2 className="mt-6 mb-2 font-semibold text-xl">9. Changes to This Policy</h2>
				<p className="mb-4">
					We may revise this Privacy Policy from time to time. Significant changes will be
					communicated via email or in-app notifications.
				</p>

				<h2 className="mt-6 mb-2 font-semibold text-xl">10. Contact Us</h2>
				<p>
					If you have questions about this Privacy Policy, contact us at:{' '}
					<strong>support@mockden.com</strong>
				</p>
			</div>
		</PageShell>
	);
}
