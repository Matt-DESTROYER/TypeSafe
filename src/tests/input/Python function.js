class Result {
	constructor(a, b, c) {
		this.a = a;
		this.b = b;
		this.c = c;
	}
}

function some_function(a: number, b: boolean, c: ?string) -> Result {
	return new Result(a, b, c);
}
