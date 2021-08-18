function hexrand(length) {
	length = length || 12;
	return (function gen(num) {
		return (num += [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'][
			Math.floor(Math.random() * 100000000000) % 16
		]) &&
			((num = num != '0' ? num : '') && num.length == length)
			? num
			: gen(num);
	}(''));
}

export default function IFAID() {
	let uuid = '';

	uuid += hexrand(8);
	uuid += '-';
	uuid += hexrand(4);
	uuid += '-';
	uuid += hexrand(4);
	uuid += '-';
	uuid += hexrand(4);
	uuid += '-';
	uuid += hexrand(12);

	return uuid;
};
