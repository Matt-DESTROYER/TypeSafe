import { readFileSync as read, writeFileSync as write } from "node:fs";

import { parse_variable, parse_function, compile } from "./compiler.mjs";

const args = process.argv.slice(2);

// check at least an input file was provided
if (args.length === 0) {
	console.error("No input file provided.");
}

// handle potential errors (eg file related etc)
try {
	// get the input file
	const input_file = args[args.length-1];

	// get the code from the input file
	const input = read(input_file, "utf-8");

	// 'compile' the code
	const output = compile(input);

	// get the output file (either from the input file or by adding `.out` before the file extension)
	let output_file = input_file.split(".");
	const output_arg = args.indexOf("-o");
	if (output_arg !== -1) {
		output_file = args[output_arg+1];
	} else {
		output_file[0] += ".out";
		output_file = output_file.join(".");
	}
	
	// write the output to the output file
	write(output_file, output);
} catch (error) {
	// print any errors
	console.warn("An unexpected error occurred...");
	console.error(error);
}
