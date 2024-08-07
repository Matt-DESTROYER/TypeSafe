function expect(actual) {
	return Object.freeze({
		toBe: function(expected) {
			return actual === expected;
		},
		equals: (...args) => this.toBe(...args)
	});
}

export { expect };