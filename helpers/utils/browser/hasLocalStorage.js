export default function hasLocalStorage() {
	const bs = 'babysteps';
	try {
		localStorage.setItem(bs, bs);
		localStorage.removeItem(bs);
		return true;
	} catch (e) {
		return false;
	}
};
