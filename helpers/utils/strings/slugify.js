/**
 * Convert string to url slug.
 *
 * @param  {String} str - the string to slugify
 *
 * @return {String} The slugified string.
 */
export default function Slugify(str) {
	if (str == null) {
		return '';
	}

	return str
		.toString()
		.toLowerCase()
		.trim()
		.replace(/&/g, '-and-') // Replace & with 'and'
		.replace(/[\s\W-\/]+/g, '-') // Replace spaces, non-word characters and dashes with a single dash (-)
		.replace(/^-+|-+$/g, ''); // remove leading, trailing -
}
