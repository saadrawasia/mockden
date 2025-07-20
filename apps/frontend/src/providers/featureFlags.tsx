import { type ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { type FeatureFlagConfig, type FeatureFlagKey, defaultFlags } from '../lib/featureFlags';

// Context interface
interface FeatureFlagContextType {
	flags: FeatureFlagConfig;
	isEnabled: (flag: FeatureFlagKey) => boolean;
	toggleFlag: (flag: FeatureFlagKey) => void;
	setFlag: (flag: FeatureFlagKey, value: boolean) => void;
}

// Context for feature flags
const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

// Provider props interface
interface FeatureFlagProviderProps {
	children: ReactNode;
	initialFlags?: Partial<FeatureFlagConfig>;
}

// Storage key for localStorage
const FEATURE_FLAGS_STORAGE_KEY = 'featureFlags';

// Utility functions for localStorage operations
const loadFlagsFromStorage = (): Partial<FeatureFlagConfig> => {
	if (typeof window === 'undefined') return {};

	try {
		const stored = localStorage.getItem(FEATURE_FLAGS_STORAGE_KEY);
		return stored ? JSON.parse(stored) : {};
	} catch (error) {
		console.warn('Failed to load feature flags from localStorage:', error);
		return {};
	}
};

const saveFlagsToStorage = (flags: FeatureFlagConfig): void => {
	if (typeof window === 'undefined') return;

	try {
		localStorage.setItem(FEATURE_FLAGS_STORAGE_KEY, JSON.stringify(flags));
	} catch (error) {
		console.warn('Failed to save feature flags to localStorage:', error);
	}
};

// Feature Flag Provider Component
export const FeatureFlagProvider: React.FC<FeatureFlagProviderProps> = ({
	children,
	initialFlags = {},
}) => {
	const [flags, setFlags] = useState<FeatureFlagConfig>(() => {
		// Load from localStorage and merge with defaults and initial flags
		const savedFlags = loadFlagsFromStorage();
		const mergedFlags = { ...defaultFlags, ...initialFlags, ...savedFlags };
		// Ensure all values are strictly boolean
		return Object.keys(defaultFlags).reduce((acc, key) => {
			acc[key as FeatureFlagKey] = Boolean(mergedFlags[key as FeatureFlagKey]);
			return acc;
		}, {} as FeatureFlagConfig);
	});

	// Save flags to localStorage when they change
	useEffect(() => {
		saveFlagsToStorage(flags);
	}, [flags]);

	const isEnabled = (flag: FeatureFlagKey): boolean => {
		return Boolean(flags[flag]);
	};

	const toggleFlag = (flag: FeatureFlagKey): void => {
		setFlags(prev => ({
			...prev,
			[flag]: !prev[flag],
		}));
	};

	const setFlag = (flag: FeatureFlagKey, value: boolean): void => {
		setFlags(prev => ({
			...prev,
			[flag]: Boolean(value),
		}));
	};

	const contextValue: FeatureFlagContextType = {
		flags,
		isEnabled,
		toggleFlag,
		setFlag,
	};

	return <FeatureFlagContext.Provider value={contextValue}>{children}</FeatureFlagContext.Provider>;
};

// Hook return type for individual flags
interface UseFeatureFlagReturn {
	isEnabled: boolean;
	toggle: () => void;
	setFlag: (value: boolean) => void;
}

// Custom hook to use feature flags
export const useFeatureFlag = (flag: FeatureFlagKey): UseFeatureFlagReturn => {
	const context = useContext(FeatureFlagContext);
	if (!context) {
		throw new Error('useFeatureFlag must be used within a FeatureFlagProvider');
	}

	return {
		isEnabled: context.isEnabled(flag),
		toggle: () => context.toggleFlag(flag),
		setFlag: (value: boolean) => context.setFlag(flag, value),
	};
};

// Custom hook to use all feature flags
export const useFeatureFlags = (): FeatureFlagContextType => {
	const context = useContext(FeatureFlagContext);
	if (!context) {
		throw new Error('useFeatureFlags must be used within a FeatureFlagProvider');
	}
	return context;
};
