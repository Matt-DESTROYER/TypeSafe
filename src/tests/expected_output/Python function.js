class Result {
	constructor(a, b, c) {
		this.a = a;
		this.b = b;
		this.c = c;
	}
}

function some_function(a, b, c) {
	if (typeof a !== "number") {
		throw new TypeError("[a: number] Expected type 'number', but got '" + (typeof a) + "'.");
	}
	if (typeof b !== "boolean") {
		throw new TypeError("[b: boolean] Expected type 'boolean', but got '" + (typeof b) + "'.");
	}
	if (typeof c !== "string" && (typeof c !== undefined)) {
		throw new TypeError("[c: ?string] Expected type 'string', but got '" + (typeof c) + "'.");
	}

	{
		const return_value = new Result(a, b, c);
		if (!(return_value instanceof Result)) {
			throw new TypeError("[some_function(a: number, b: boolean, c: ?string)] Expected type 'Result', but got '" + (return_value.constructor.name) + "'.");
		}
		return return_value;
	}
}
