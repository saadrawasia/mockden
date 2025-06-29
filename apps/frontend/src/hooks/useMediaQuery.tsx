import { useEffect, useState } from 'react';

export function useMediaQuery(query: string) {
	const [value, setValue] = useState(false);

	useEffect(() => {
		function onChange(event: MediaQueryListEvent) {
			setValue(event.matches);
		}

		const result = matchMedia(query);
		result.addEventListener('change', onChange);
		// eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
		setValue(result.matches);

		return () => result.removeEventListener('change', onChange);
	}, [query]);

	return value;
}
