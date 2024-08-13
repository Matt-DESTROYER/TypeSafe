class Result {
	constructor(a, b, c) {
		this.a = a;
		this.b = b;
		this.c = c;
	}
}

function some_function(a, b, c) {
	if (typeof a !== "number") {
		throw new TypeError("[some_function(a: number, b: boolean, c: string)] Expected type `number` but got `" + (typeof a) + "`.");
	}
	if (typeof b !== "boolean") {
		throw new TypeError("[some_function(a: number, b: boolean, c: string)] Expected type `boolean` but got `" + (typeof b) + "`.");
	}
	if (typeof c !== "string") {
		throw new TypeError("[some_function(a: number, b: boolean, c: string)] Expected type `string` but got `" + (typeof c) + "`.");
	}
	{
		const return_value = new Result(a, b, c);

		if (!(return_value instanceof Result)) {
			throw new TypeError("[some_function(a: number, b: boolean, c: string)] Expected return type `Result` but returned type " + (return_value.constructor.name) + ".");
		}
		return return_value;
	}
}
