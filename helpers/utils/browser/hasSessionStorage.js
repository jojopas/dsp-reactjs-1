export default function hasSessionStorage() {
	const bs = 'babysteps';
	try {
		sessionStorage.setItem(bs, bs);
		sessionStorage.removeItem(bs);
		return true;
	} catch (e) {
		return false;
	}
};
