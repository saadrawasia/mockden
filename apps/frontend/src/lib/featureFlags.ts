export const FeatureFlags = {
	PAYMENT_ENABLED: 'payment_enabled',
};

// Default feature flag configuration
export const defaultFlags = {
	[FeatureFlags.PAYMENT_ENABLED]: false,
};

// Extract the type from the FeatureFlags object
export type FeatureFlagKey = (typeof FeatureFlags)[keyof typeof FeatureFlags];

// Type for feature flag configuration
export type FeatureFlagConfig = Record<FeatureFlagKey, boolean>;
