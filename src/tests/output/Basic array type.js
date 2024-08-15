const arr = [1, 2, 3];
if (!Array.isArray(arr)) {
	throw new TypeError("[arr: array] Expected type 'array', but got '" + (arr.constructor.name) + "'.");
}
console.log(arr);
