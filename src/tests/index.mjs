import compile from "../compiler.mjs";

import { readdirSync as readDir, existsSync as exists, readFileSync as read, writeFileSync as write } from "node:fs";
import { expect } from "./test.mjs";

const TEST_FILES = Object.freeze(readDir("./tests/input"));
const TESTS = new Array(TEST_FILES.length);

for (let i = 0; i < TEST_FILES.length; i++) {
	// for of (we need the `i` for storing all tests)
	const test = TEST_FILES[i];

	if (!exists("./tests/expected_output/" + test)) {
		console.warn(`Expected output for test '${test}' does not exist...`);
		continue;
	}

	// read in the input and expected output
	const input = read(`./tests/input/${test}`, "utf-8");
	const expected = read(`./tests/expected_output/${test}`, "utf-8");

	// get the output
	const output = compile(input);

	// write the actual output to the respective file
	write(`./tests/output/${test}`, output);

	// check if the output is correct
	TESTS[i] = expect(output.replaceAll(/\s/g, ""))
		.toBe(expected.replaceAll(/\s/g, ""));
}

// check how many tests passed
const passed = TESTS.filter((test) => test === true).length;

// print the results
console.info(`${passed}/${TEST_FILES.length} tests passed.`);

if (passed !== TEST_FILES.length) {
	console.error("Some tests failed!");
	process.exitCode = 1;
}
