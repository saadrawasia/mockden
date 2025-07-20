import { createFileRoute } from '@tanstack/react-router';
import FeatureFlagsAdmin from '../../pages/testing/featureFlags';

export const Route = createFileRoute('/testing/feature-flags')({
	component: FeatureFlagsAdmin,
});
