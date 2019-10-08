/**
* Convert a glob pattern into a Regular Expression
* @param {String} glob - Glob pattern
* @return {RegExp} Regular Expression
*/
module.exports = function glob(glob) {
	// Metacharacters
	var AT = '@';
	var BACKSLASH = '\\';
	var BANG = '!';
	var CARET = '^';
	var COLON = ':';
	var COMMA = ',';
	var CURLY_OPEN = '{';
	var CURLY_SHUT = '}';
	var DOLLAR = '$';
	var DOT = '.';
	var EQUAL = '=';
	var PAREN_OPEN = '(';
	var PAREN_SHUT = ')';
	var PIPE = '|';
	var PLUS = '+';
	var QUERY = '?';
	var SLASH = '/';
	var SQUARE_OPEN = '[';
	var SQUARE_SHUT = ']';
	var STAR = '*';

	// Regular Expression sources for path segments
	var GLOBSTAR_SEGMENT = '((?:[^/]*(?:/|$))*)';
	var WILDCARD_SEGMENT = '([^/]*)';

	/** @type {String} source of the Regular Expression to return */
	var source = '';

	// if we are doing extended matching, this boolean is true when we are
	// inside a group (eg {*.html,*.js}), and false otherwise.
	var inGroup = false;
	var inRange = false;

	/** @type {Array<String>} - stack (to be kept out of scope) */
	var ext = [];

	/** @type {Number} index of the current character in the glob pattern */
	var i = 0;

	/** @type {String} current character in the glob pattern */
	var char;

	/** @type {String} next character in the glob pattern */
	var nextChar;

	for (; i < glob.length; ++i) {
		char = glob[i];
		nextChar = glob[i + 1];

		// escape the following symbols
		if (
			char === BACKSLASH ||
			char === DOLLAR ||
			char === CARET ||
			char === DOT ||
			char === EQUAL
		) {
			source += BACKSLASH + char;

			continue;
		}

		if (char === SLASH) {
			source += BACKSLASH + char;

			continue;
		}

		if (char === PAREN_OPEN) {
			if (ext.length) {
				source += char;

				continue;
			}

			source += BACKSLASH + char;

			continue;
		}

		if (char === PAREN_SHUT) {
			if (ext.length) {
				source += char;

				var type = ext.pop();

				source += (
					type === AT
						? '{1}'
						: type === BANG
							? WILDCARD_SEGMENT
							: type
				);

				continue;
			}

			source += BACKSLASH + char;

			continue;
		}

		if (char === PIPE) {
			if (ext.length) {
				source += char;

				continue;
			}

			source += BACKSLASH + char;

			continue;
		}

		if (char === PLUS) {
			if (nextChar === PAREN_OPEN) {
				ext.push(char);

				continue;
			}

			source += BACKSLASH + char;

			continue;
		}

		if (
			char === AT &&
			nextChar === PAREN_OPEN
		) {
			ext.push(char);

			continue;
		}

		if (char === BANG) {
			if (inRange) {
				source += CARET;

				continue;
			}

			if (nextChar === PAREN_OPEN) {
				ext.push(char);

				source += '(?!';

				++i;

				continue;
			}

			source += BACKSLASH + char;

			continue;
		}

		if (char === QUERY) {
			if (nextChar === PAREN_OPEN) {
				ext.push(char);
			} else {
				source += DOT;
			}

			continue;
		}

		if (char === SQUARE_OPEN) {
			if (
				inRange &&
				nextChar === COLON
			) {
				++i;

				/** @type {String} - range or class of characters */
				var value = '';

				while (glob[++i] !== COLON) {
					value += glob[i];
				}

				if (value === 'alnum') {
					source += '(\\w|\\d)';
				} else if (value === 'space') {
					source += '\\s';
				} else if (value === 'digit') {
					source += '\\d';
				}

				// skip the closing `:` handled in the while loop above
				++i;

				continue;
			}

			inRange = true;

			source += char;

			continue;
		}

		if (char === SQUARE_SHUT) {
			inRange = false;

			source += char;

			continue;
		}

		if (char === CURLY_OPEN) {
			inGroup = true;

			source += PAREN_OPEN;

			continue;
		}

		if (char === CURLY_SHUT) {
			inGroup = false;

			source += PAREN_SHUT;

			continue;
		}

		if (char === COMMA) {
			if (inGroup) {
				source += PIPE;

				continue;
			}

			source += BACKSLASH + char;

			continue;
		}

		if (char === STAR) {
			if (nextChar === PAREN_OPEN) {
				ext.push(char);

				continue;
			}

			// move over consecutive stars and store the previous and next characters

			/** @type {String} previous character in the glob pattern */
			var prevChar = glob[i - 1];

			/** @type {Number} truthy number when matching a globstar pattern */
			var isGlobstar;

			while (glob[i + 1] === STAR) {
				isGlobstar = ++i;
			}

			nextChar = glob[i + 1];

			if (
				!isGlobstar ||
				prevChar !== SLASH &&
				prevChar !== undefined ||
				nextChar !== SLASH &&
				nextChar !== undefined
			) {
				// not a globstar; match one path segment
				source += WILDCARD_SEGMENT;
			} else {
				// is a globstar; match zero or more path segments
				source += GLOBSTAR_SEGMENT;

				++i;
			}

			continue;
		}

		source += char;
	}

	return RegExp(CARET + source + DOLLAR, 'i');
}
