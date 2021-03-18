export default function getKey(obj, val) {
	return Object.keys(obj).find(key => obj[key] === val) || 149;
}
