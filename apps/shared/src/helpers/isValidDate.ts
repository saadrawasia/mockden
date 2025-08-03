import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export function isValidDateOrDatetime(input: string, fieldType: 'date' | 'datetime') {
	// Reject if input is a string that looks like a Unix timestamp
	if (typeof input === 'string' && /^\d{10}$/.test(input)) {
		return false;
	}

	const parsed = dayjs(input, getFormat(fieldType), true);
	return parsed.isValid();
}

export function parseDate(input: string, fieldType: 'date' | 'datetime') {
	return dayjs(input).format(getFormat(fieldType));
}

export function getFormat(fieldType: 'date' | 'datetime') {
	let format = 'YYYY-MM-DD';
	if (fieldType === 'datetime') {
		format = 'YYYY-MM-DDTHH:mm:ss';
	}

	return format;
}
