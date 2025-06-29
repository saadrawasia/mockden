export function slugify(str: string) {
	let result = str.replace(/^\s+|\s+$/g, ""); // trim leading/trailing white space
	result = result.toLowerCase(); // convert string to lowercase
	result = result
		.replace(/[^a-z0-9 -]/g, "") // remove any non-alphanumeric characters
		.replace(/\s+/g, "-") // replace spaces with hyphens
		.replace(/-+/g, "-"); // remove consecutive hyphens
	return result;
}
