var helpers = require('./helpers');

module.exports = (function () {
	'use strict';

	function RegExpTree () {}

	RegExpTree.prototype.parseSet = function (set) {
		var tree = [];

		var currChar = null;

		var hexadecimalBoundary = null;
		var unicodeBoundary = null;

		var escape = null;
		var range = null;

		for (var i = 0, len = set.length; i < len; i++) {
			currChar = set[i];

			if (escape === null && currChar === '\\') {
				escape = i;
			}
			else if (escape !== null && currChar === 'x' && hexadecimalBoundary === null) {
				hexadecimalBoundary = i + 2;
			}
			else if (escape !== null && currChar === 'u' && unicodeBoundary === null) {
				unicodeBoundary = i + 4;
			}
			else if (escape === null && currChar === '-' && range === null) {
				range = i;
			}
			else if (escape === null && helpers.isMetaCharacter(currChar)) {
				throw 'Unescaped ' + currChar + ' character.';
			}
			else if (escape !== null && !helpers.isMetaCharacter(currChar)) {
				throw 'Escaping non meta-character ' + currChar + '.';
			}

			if (escape === null && hexadecimalBoundary === i) {
				currChar = set.substr(hexadecimalBoundary - 3, 4);
			}
			else if (escape === null && unicodeBoundary === i) {
				currChar = set.substr(unicodeBoundary - 1, 2);
			}

			if (escape === null && unicodeBoundary === i || hexadecimalBoundary === i) {
				if (!helpers.isHexadecimal(currChar)) {
					throw currChar + ' is invalid hexadecimal character.';
				}
				currChar = String.fromCharCode(parseInt(currChar, 16));
				unicodeBoundary = null;
			}

			if (escape + 1 === i) {
				escape = null;
			}

			if (escape === null && hexadecimalBoundary === null && unicodeBoundary === null) {
				if (range === null) {
					tree.push([currChar]);
				}
				else if (range !== null && range !== i) {
					tree[tree.length - 1].push(currChar);
					range = null;
				}
			}
		}

		return tree;
	};

	return RegExpTree;
})();
