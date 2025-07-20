import { createFileRoute } from '@tanstack/react-router';
import RefundPolicy from '../pages/refundPolicy';

export const Route = createFileRoute('/refund-policy')({
	component: RefundPolicy,
});
