function fib(n) {
	if (typeof n !== "number") {
		throw new TypeError("[fib(n: number)] Expected type `number` but got `" + (typeof n) + "`.");
	}

	if (n <= 1) {
		return n;
	}
	let a = 0;
if (typeof a !== "number") {
	throw new TypeError("[a] Expected type `number` but got `" + (typeof a) + "`.");
}
	let b = 1;
if (typeof b !== "number") {
	throw new TypeError("[b] Expected type `number` but got `" + (typeof b) + "`.");
}

	let i = 1;
if (typeof i !== "number") {
	throw new TypeError("[i] Expected type `number` but got `" + (typeof i) + "`.");
}
	while (i++ < n) {
		let c = a + b;
		a = b;
		b = c;
	}
	return b;
}

fib(5);
