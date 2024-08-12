function fib(n: number) {
	if (n <= 1) {
		return n;
	}
	let a: number = 0;
	let b: number = 1;

	let i: number = 1;
	while (i++ < n) {
		let c: any = a + b;
		a = b;
		b = c;
	}
	return b;
}

fib(5);
