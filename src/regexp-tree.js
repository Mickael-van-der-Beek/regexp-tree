var helpers = require('./helpers');

module.exports = (function () {
	'use strict';

	function RegExpTree () {}

	RegExpTree.prototype.parseGroup = function (group) {
		console.log('++0.1');
		var tree = [];

		var currChar = null;

		var hexadecimalBoundary = null;
		var unicodeBoundary = null;

		var groupStart = null;
		var setStart = null;

		var escape = null;

		for (var i = 0, len = group.length; i < len; i++) {
			currChar = group[i];

			console.log('++1');
			console.log('CHAR=', currChar);
			console.log('TREE=', tree);

			if (escape === null && currChar === '\\') {
				console.log('++2');
				escape = i;
			}
			else if (escape === null && currChar === '(' && groupStart === null) {
				console.log('++3');
				groupStart = i;
			}
			else if (escape === null && currChar === ')' && groupStart !== null) {
				console.log('++4');
				tree.push(
					this.parseGroup(
						group.substr(setStart + 1, i - setStart - 1)
					)
				);
				groupStart = null;
			}
			else if (escape === null && currChar === '[' && setStart === null && groupStart === null) {
				console.log('++5');
				setStart = i;
			}
			else if (escape === null && currChar === ']' && setStart !== null) {
				console.log('++6');
				tree.push(
					this.parseSet(
						group.substr(setStart + 1, i - setStart - 1)
					)
				);
				setStart = null;
			}
			else if (escape !== null && currChar === 'x' && hexadecimalBoundary === null) {
				console.log('++7');
				hexadecimalBoundary = i + 2;
			}
			else if (escape !== null && currChar === 'u' && unicodeBoundary === null) {
				console.log('++8');
				unicodeBoundary = i + 4;
			}
			else if (escape === null && helpers.isMetaCharacter(currChar) && setStart === null && groupStart === null) {
				console.log('++9');
				throw 'Unescaped ' + currChar + ' character.';
			}
			else if (escape !== null && !helpers.isMetaCharacter(currChar)) {
				console.log('++10');
				throw 'Escaping non meta-character ' + currChar + '.';
			}

			if (escape === null && hexadecimalBoundary === i) {
				console.log('++11');
				currChar = group.substr(hexadecimalBoundary - 3, 4);
			}
			else if (escape === null && unicodeBoundary === i) {
				console.log('++12');
				currChar = group.substr(unicodeBoundary - 1, 2);
			}

			if (escape === null && unicodeBoundary === i || hexadecimalBoundary === i) {
				console.log('++13');
				if (!helpers.isHexadecimal(currChar)) {
					throw currChar + ' is invalid hexadecimal character.';
				}
				currChar = String.fromCharCode(parseInt(currChar, 16));
				unicodeBoundary = null;
			}

			if (escape !== null && escape + 1 === i) {
				console.log('++14');
				escape = null;
			}

			if (escape === null &&
				hexadecimalBoundary === null &&
				unicodeBoundary === null &&
				(groupStart === null && currChar !== ')') &&
				(setStart === null && currChar !== ']')
			) {
				console.log('++15');
				tree.push(currChar);
			}
		}

		return tree;
	};

	RegExpTree.prototype.parseSet = function (set) {
		console.log('++0.2');
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

			if (escape !== null && escape + 1 === i) {
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
