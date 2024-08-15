function add(x, y) {
	if (typeof x !== "number") {
		throw new TypeError("[x: number] Expected type 'number', but got '" + (typeof x) + "'.");
	}
	if (typeof y !== "number") {
		throw new TypeError("[y: number] Expected type 'number', but got '" + (typeof y) + "'.");
	}

	{
		const return_value = x + y;
		if (typeof return_value !== "number") {
			throw new TypeError("[add(x: number, y: number)] Expected type 'number', but got '" + (typeof return_value) + "'.");
		}

		return return_value;
	}
}

const str = "hello";
if (typeof str !== "string") {
	throw new TypeError("[str: string] Expected type 'string', but got '" + (typeof str) + "'.");
}
