export default function randomNum(length = 12) {
	let rnd = `${Math.floor(Math.random() * 1000000000000000)}`;
	return rnd.substr(0, length || rnd.length);
};
