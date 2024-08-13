// CONSTANTS
const BUILTIN_TYPES          = Object.freeze(["boolean", "number", "bigint", "string", "function", "symbol", "undefined"]);
//const WHITESPACE             = Object.freeze([/* space */ " ", /* tab */ "	"]);
const VARIABLE_KEYWORDS      = Object.freeze(["var", "let", "const"]);
const ARGUMENT_DELIMITERS    = Object.freeze([",", "=", ":"]);
const RETURN_TYPE_DELIMITERS = Object.freeze(["=", "{"]);
const VARIABLE_REGEX         = /(var|let|const) [_a-zA-Z].* *: *[_a-zA-Z].*( *= *.*)(;|\n)/gm;
const FUNCTION_REGEX         = /function( [_a-zA-Z].*)? *\(.*\)( *(:|->) *[_a-zA-Z].*)? *\{(.|\n)*\}/gm;
const WHITESPACE_REGEX       = /\s+/;
const RETURN_REGEX           = /return .*(;|\n|\})/gm;

// a function to detect indentation of a line
function line_indentation(line) {
	const match = line.match(WHITESPACE_REGEX);
	return match ? match[0] : "";
}

// parse a variable declaration
function parse_variable(content) {
	// check if the content is actually a variable declaration
	const declaration_start = (function is_actual_variable_declaration() {
		for (const keyword of VARIABLE_KEYWORDS) {
			const idx = content.indexOf(keyword);
			if (idx !== -1) {
				return idx;
			}
		}
		return -1;
	})();
	if (declaration_start === -1) {
		return {
			result: content,
			name: null,
			type: null
		};
	}
	// find type definition's start
	const type_begin = content.indexOf(":", declaration_start);
	// if no type definition, just return the original content
	if (type_begin === -1) {
		return {
			result: content,
			name: variable_name,
			type: "any"
		};
	}

	// locate the type definition's end
	let type_end = content.indexOf("=", type_begin);
	if (type_end === -1) {
		type_end = content.indexOf(";", type_begin);
	}
	if (type_end === -1) {
		type_end = content.length;
	}

	// get the type
	const type = content.substring(type_begin + 1, type_end).trim();

	// get the variable's name
	const variable_name = content
		.substring(content.indexOf(" ", declaration_start) + 1, type_begin)
		.trim();

	// reconstruct a valid variable declaration
	const variable_definition =
		content.substring(0, type_begin).trim() +
		content.substring(type_end - 1);

	// if type is any, don't add type any logic
	if (type.toLowerCase() === "any") {
		return {
			result: variable_definition,
			name: variable_name,
			type: "any"
		};
	}

	// add type safety checking
	let type_code = "";
	// if type is a built-in type
	if (BUILTIN_TYPES.includes(type.toLowerCase())) {
		// use typeof
		type_code = `if (typeof ${variable_name} !== "${type}") {
	throw new TypeError("[${variable_name}] Expected type \`${type}\` but got \`" + (typeof ${variable_name}) + "\`.");
}
`;
	} else {
		// if type is a custom type, use instanceof
		type_code = `if (!(${variable_name} instanceof ${type})) {
	throw new TypeError("[${variable_name}] Expected type \`${type}\` but got \`" + (${variable_name}.constructor.name) + "\`.");
}
`;
	}

	// return the new valid definition plus the logic to double check type
	return {
		result: variable_definition.trimEnd() + "\n" + type_code,
		name: variable_name,
		type: type
	};
}

// parse a for loop
function parse_for_loop(content) {
	// check if the content is actually a for loop
	const for_loop_start = content.indexOf("for");
	if (for_loop_start === -1) {
		return {
			result: content
		};
	}

	// TODO: actually implement...
	// TEMP
	return {
		result: content
	};
}

// parse a function declaration
function parse_function(content) {
	// a helper function to parse a function's parameters
	function parse_parameters(content) {
		// store each parameter and it's type
		const parameters = [];
		// remember the current parameter, the current type, and whether
		let current = "";
		for (let i = 0; i < content.length; i++) {
			// while we haven't reached a delimiting character
			if (!ARGUMENT_DELIMITERS.includes(content[i])) {
				// keep reading characters into the current parameter
				current += content[i];
			} else {
				// othewise, add the current parameter to the list of parameters
				parameters.push(current.trim());
				current = "";
				// check for a type definition
				if (content[i] === ":") {
					// if there is a type definition, grab it
					i++;
					while (i < content.length && !ARGUMENT_DELIMITERS.includes(content[i])) {
						current += content[i];
						i++;
					}
					parameters.push(current.trim());
					current = "";
				} else {
					// otherwise, add a default value
					parameters.push("any");
				}
			}
		}
		return parameters;
	}

	// find the function's parameters
	const function_def_start = content.indexOf("function");
	// if this is not a function definition, just return the original content
	if (function_def_start === -1) {
		return {
			result: content
		};
	}

	// find where the function's parameters start and end
	const parameters_begin = content.indexOf("(", function_def_start) + 1;
	let parameters_end = content.indexOf(")", parameters_begin);

	// find all the function's parameters
	const parameters = parse_parameters(
		content.substring(
			parameters_begin,
			parameters_end
		)
	);

	// create a reconstruct a valid string of parameters
	const reconstructed_parameters = parameters
		.filter((parameter, index) => index % 2 === 0)
		.join(", ");

	// rewrite function definition with the valid parameters
	const valid_parameters = content.substring(0, parameters_begin) + reconstructed_parameters + content.substring(parameters_end);
	parameters_end = valid_parameters.indexOf(")", parameters_begin) + 1;

	// find return type (if it exists)
	let return_type = "", return_type_idx = -1;
	// start looking at the end of the parameters
	for (let i = parameters_end; i < valid_parameters.length; i++) {
		// if we find `:` or `->`, we've found a return type
		if (valid_parameters[i] === ":" ||
			valid_parameters.substring(i, i+2) === "->") {
			// grab the return type
			i++;
			if (valid_parameters[i] === ">") {
				i++;
			}
			while (i < valid_parameters.length && !RETURN_TYPE_DELIMITERS.includes(valid_parameters[i])) {
				return_type += valid_parameters[i];
				i++;
			}
			return_type_idx = i;
			break;
		} else if (RETURN_TYPE_DELIMITERS.includes(valid_parameters[i])) {
			// the function starts here and we haven't found a return type
			break;
		}
	}
	// trim the return type if found
	return_type = return_type.trim();

	// complete the valid, cleaned function definition
	let valid_function_definition = "";
	if (return_type_idx !== -1) {
		valid_function_definition = valid_parameters.substring(0, parameters_end) + " " + valid_parameters.substring(return_type_idx);
	} else {
		valid_function_definition = valid_parameters;
	}

	// time to start adding type checking!!!

	let function_name = "";
	const name_index = valid_function_definition.indexOf("function ");
	if (name_index !== -1) {
		function_name = content.substring(name_index+9, content.indexOf(")", name_index+9)+1);
	}
	const function_start = valid_function_definition.indexOf("{", parameters_end);

	const indentation_start = (function find_indentation_start() {
		// just keep reading newlines from the function's start
		let i = function_start;
		while (valid_function_definition[i] !== "\n") {
			i++;
		}
		return i;
	})();

	const indentation = line_indentation(valid_function_definition.substring(indentation_start+1));

	let type_code = "\n";
	for (let i = 0; i < parameters.length; i += 2) {
		// if the parameter is a built-in type
		if (BUILTIN_TYPES.includes(parameters[i + 1].toLowerCase())) {
			// use typeof
			type_code += `${indentation}if (typeof ${parameters[i]} !== "${parameters[i + 1].toLowerCase()}") {
${indentation}${indentation}throw new TypeError("[${function_name}] Expected type \`${parameters[i + 1]}\` but got \`" + (typeof ${parameters[i]}) + "\`.");
${indentation}}
`;
		} else {
			// if the parameter is a custom type, use instanceof
			type_code += `${indentation}if (!(${parameters[i]} instanceof ${parameters[i + 1]})) {
${indentation}${indentation}throw new TypeError("[${function_name}] Expected type \`${parameters[i + 1]}\` but got \`" + (${parameters[i]}.constructor.name) + "\`.");
${indentation}}
`;
		}
	}

	const type_checked_parameters = valid_function_definition.substring(0, function_start+1) + type_code + valid_function_definition.substring(function_start+1);

	// now to handle return type...

	// since there could be multiple returns, easier to handle with RegEx
	let fully_typed_function = type_checked_parameters;
	if (return_type) {
		fully_typed_function = fully_typed_function.replaceAll(RETURN_REGEX, function(content) {
			let return_value = `${indentation}${indentation}const return_value = ${content.substring(7)}`;
			if (!return_value.endsWith(";\n")) {
				return_value  += ";\n";
			}
			if (BUILTIN_TYPES.includes(return_type.toLowerCase())) {
				return `{
${return_value}
${indentation}${indentation}if (typeof return_value !== "${return_type.toLowerCase()}") {
${indentation}${indentation}${indentation}throw new TypeError("[${function_name}] Expected return type \`${return_type}\` but returned type " + (typeof return_value) + ".");
${indentation}${indentation}}
${indentation}${indentation}return return_value;
${indentation}}
`;
		} else {
			return `{
${return_value}
${indentation}${indentation}if (!(return_value instanceof ${return_type})) {
${indentation}${indentation}${indentation}throw new TypeError("[${function_name}] Expected return type \`${return_type}\` but returned type " + (return_value.constructor.name) + ".");
${indentation}${indentation}}
${indentation}${indentation}return return_value;
${indentation}}
`;
			}
		});
	}

	return {
		result: fully_typed_function,
		return_type: return_type,
		parameters: parameters
	};
}

function compile(code) {
	return code
		.replaceAll(VARIABLE_REGEX, (x) => parse_variable(x).result)
		.replaceAll(FUNCTION_REGEX, (x) => parse_function(x).result);
}

export {
	BUILTIN_TYPES,
	VARIABLE_KEYWORDS,
	parse_variable,
	parse_for_loop,
	parse_function,
	compile
};
