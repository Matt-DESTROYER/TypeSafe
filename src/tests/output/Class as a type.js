class Foo {
	constructor(bar) {
		this.bar = bar;
	}
}

const foo = new Foo("bar");
if (!(foo instanceof Foo)) {
	throw new TypeError("[foo: Foo] Expected type 'Foo', but got '" + (foo.constructor.name) + "'.");
}
