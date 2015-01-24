module.exports = (function () {
	'use strict';

	function RegExpTree () {}

	RegExpTree.prototype.stringifyRegExp = function (regexp) {
		if (regexp instanceof RegExp) {
			regexp = regexp.toString();
		}
		return !(regexp instanceof String) ? null : regexp;
	};

	RegExpTree.prototype.parse = function (regexp) {
		if ((regexp = this.stringifyRegExp(regexp)) === null) {
			return null;
		}

		var tree = [];

		var prevChar;
		var currChar;

		var quantifierStart = null;
		var quantifierEnd = null;

		var groupStart = null;
		var groupEnd = null;

		var setStart = null;
		var setEnd = null;

		var escape = false;

		for (var i = 0, len = regexp.length; i < len; i++) {
			prevChar = regexp[i - 1];
			currChar = regexp[i];

			if (escape) {
				escape = false;
			}
			/*
			 * Match "escape sequence" start
			 */
			else if (!escape && currChar === '\\') {
				escape = true;
			}
			/*
			 * Match "group" start and end
			 */
			else if (!escape && currChar === '(') {
				groupStart = i; 
			}
			else if (!escape && groupStart !== null && currChar === ')') {
				groupEnd = i;
				tree.push(
					this.parseGroup(
						regexp.substr(groupStart, groupEnd - groupStart)
					)
				);
				groupStart = null;
				groupEnd = null;
			}
			/*
			 * Match "set" start and end
			 */
			else if (!escape && currChar === '[') {
				setStart = i; 
			}
			else if (!escape && setStart !== null && currChar === ']') {
				setEnd = i;
				tree.push(
					this.parseSet(
						regexp.substr(setStart, setEnd - setStart)
					)
				);
				setStart = null;
				setEnd = null;
			}
			/*
			 * Match "quantifier" start and end
			 */
			else if ((prevChar === ')' || prevChar === ']') && currChar === '{') {
				quantifierStart = i; 
			}
			else if (!escape && quantifierStart !== null && currChar === '}') {
				quantifierEnd = i;
				tree.push(
					this.parseQuantifier(
						regexp.substr(quantifierStart, quantifierEnd - quantifierStart),
						tree.pop()
					)
				);
				quantifierStart = null;
				quantifierEnd = null;
			}
		}
	};

	RegExpTree.prototype.parseGroup = function (group) {};

	RegExpTree.prototype.parseSet = function (set) {
		var tree = [];

		var prevChar;
		var currChar;

		var unicodeStart = null;
		var unicodeEnd = null;

		var rangeStart = null;
		var rangeEnd = null;

		var escape = false;

		for (var i = 0, len = set.length; i < len; i++) {
			prevChar = set[i - 1];
			currChar = set[i];

			if (escape) {
				escape = false;
			}
			/*
			 * Match "escape sequence" start
			 */
			else if (!escape && currChar === '\\') {
				escape = true;
			}
			else if (escape && currChar === 'u') {
				unicodeStart = i + 1;
			}
			else if (unicodeStart !== null && i + 1 - unicodeStart === 4) {
				unicodeEnd = i;
				currChar = String.fromCharCode(
					parseInt(
						set.substr(unicodeStart, unicodeEnd - unicodeStart),
						16
					)
				);
				unicodeStart = null;
				unicodeEnd = null;
			}
		}
	};

	RegExpTree.prototype.parseQuantifier = function (quantifer) {};

	return RegExpTree;
})();
