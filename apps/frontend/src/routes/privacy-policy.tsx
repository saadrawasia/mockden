import { createFileRoute } from '@tanstack/react-router';
import PrivacyPolicy from '../pages/privacyPolicy';

export const Route = createFileRoute('/privacy-policy')({
	component: PrivacyPolicy,
});
