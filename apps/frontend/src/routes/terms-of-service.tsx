import { createFileRoute } from '@tanstack/react-router';
import TermsOfService from '../pages/termsOfService';

export const Route = createFileRoute('/terms-of-service')({
	component: TermsOfService,
});
