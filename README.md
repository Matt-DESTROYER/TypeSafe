[![Version](https://img.shields.io/npm/v/typesafe-cli.svg?style=flat)](https://www.npmjs.com/package/typesafe-cli)
[![Install size](https://packagephobia.com/badge?p=typesafe-cli)](https://www.npmjs.com/package/typesafe-cli)
[![Minzipped size](https://img.shields.io/bundlephobia/minzip/typesafe-cli?style=flat)](https://www.npmjs.com/package/typesafe-cli)
[![Downloads/month](https://img.shields.io/npm/dm/typesafe-cli.svg?style=flat)](https://www.npmjs.com/package/typesafe-cli)

# TypeSafe
TypeSafe is (technically) a 'language' created solely to bring Python-like type hints to JavaScript, at runtime. This 'compiler' simply takes your TypeSafe code and converts it to valid JavaScript code **with proper runtime type checking**.

## How does it work?

## Syntax
The syntax is stolen from Python's type hints and TypeScript, the main difference between this and TypeScript is simply when and how the type checking occurs. In TypeSafe, valid vanilla JavaScript type checking is injected into your code, replacing the type hints.

TypeSafe uses colons followed by a type name to allow type checking.
Type hints can be placed after any variable or parameter name, and after a function declaration.
All built-in types are supported and classes can also be used as types.
```js
// variable declarations
const str: string = "Hello, world!";
let num: number = 123;

// using a class as a type
class Foo {
	constructor(bar) {
		this.bar = bar;
	}
}

var foo: Foo = new Foo("bar");

// functions
// function name(param1: type, ...): return type {}
function multiply(x: number, y: number): number {
	return x * y;
}
```

## Completeness
This project is a work-in-progress, it is not yet even _near_ close to completion.

### Current capabilities
 - Variable declarations: The compiler can currently add proper type checking for single variable _declarations_ (will not work when multiple variables are declared using commas, also will not work for more complex assignments such as multiline functions, chained expressions, etc). This solely means checking that a variable is the correct type _after_ it is declared. In future this will aim to check type on every assignment operation (although this will dramatically increase bloat...).
 - Basic functions: The compiler can currently add proper type checking for a basic function declaration, including parameters and a return type. This does not include lambda (squid) functions.

### Future capabilities
 - For loops: The compiler should be able to perform type checking for variables declared inside of any `for` loop.
 - Arrays: The compiler should be able to perform type checking for arrays, allowing statically typed arrays.

## Pros and Cons
### Why use TypeSafe?
This project is for fun, in reality there is likely little to no real reason to ever use TypeSafe for your own projects, if you find one, let me know!
 - Runtime type checking: TypeSafe will enable you to get proper runtime errors for invalid types. In theory though, if you use TypeScript or something similar, these issues should never arise.

### Why not use TypeSafe?
 - File sizes: TypeSafe will only increase your file sizes, and the code you write, the more significantly your file size will increase.
