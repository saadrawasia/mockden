export function isValidDate(input: string) {
	const patterns = [
		/^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
		/^\d{2}-\d{2}-\d{4}$/, // MM-DD-YYYY or DD-MM-YYYY
		/^\d{2}\/\d{2}\/\d{4}$/, // MM/DD/YYYY or DD/MM/YYYY
		/^\d{4}\/\d{2}\/\d{2}$/, // YYYY/MM/DD
		/^\d{4}\.\d{2}\.\d{2}$/, // YYYY.MM.DD
		/^\d{2}\.\d{2}\.\d{4}$/, // DD.MM.YYYY
	];

	return patterns.some(pattern => pattern.test(input));
}
