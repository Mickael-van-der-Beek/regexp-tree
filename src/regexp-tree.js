var helpers = require('./helpers');

module.exports = (function () {
	'use strict';

	function RegExpTree () {}

	RegExpTree.prototype.parse = function (regexp) {
		return this.parseGroup(regexp instanceof RegExp ? regexp.source : regexp);
	};

	RegExpTree.prototype.parseGroup = function (group) {
		var formattedGroup = {
			isGroup: true,
			sequences: []
		};

		var currChar = null;

		var hexadecimalBoundary = null;
		var unicodeBoundary = null;

		var groupStart = null;
		var setStart = null;

		var escape = null;

		for (var i = 0, len = group.length; i < len; i++) {
			currChar = group[i];

			if (escape === null && currChar === '\\') {
				escape = i;
			}
			else if (escape === null && currChar === '(' && groupStart === null) {
				groupStart = i;
			}
			else if (escape === null && currChar === ')' && groupStart !== null) {
				formattedGroup.sequences.push(
					this.parseGroup(
						group.substr(groupStart + 1, i - groupStart - 1)
					)
				);
				groupStart = null;
			}
			else if (escape === null && currChar === '[' && setStart === null && groupStart === null) {
				setStart = i;
			}
			else if (escape === null && currChar === ']' && setStart !== null) {
				formattedGroup.sequences.push(
					this.parseSet(
						group.substr(setStart + 1, i - setStart - 1)
					)
				);
				setStart = null;
			}
			else if (escape !== null && currChar === 'x' && hexadecimalBoundary === null) {
				hexadecimalBoundary = i + 2;
			}
			else if (escape !== null && currChar === 'u' && unicodeBoundary === null) {
				unicodeBoundary = i + 4;
			}
			else if (escape === null && helpers.isMetaCharacter(currChar) && setStart === null && groupStart === null) {
				throw 'Unescaped ' + currChar + ' character.';
			}
			else if (escape !== null && !helpers.isMetaCharacter(currChar)) {
				throw 'Escaping non meta-character ' + currChar + '.';
			}

			if (escape === null && hexadecimalBoundary === i) {
				currChar = group.substr(hexadecimalBoundary - 3, 4);
			}
			else if (escape === null && unicodeBoundary === i) {
				currChar = group.substr(unicodeBoundary - 1, 2);
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

			if (escape === null &&
				hexadecimalBoundary === null &&
				unicodeBoundary === null &&
				(groupStart === null && currChar !== ')') &&
				(setStart === null && currChar !== ']')
			) {
				if (formattedGroup.sequences[formattedGroup.sequences.length - 1] && typeof formattedGroup.sequences[formattedGroup.sequences.length - 1].sequences === 'string') {
					formattedGroup.sequences[formattedGroup.sequences.length - 1].sequences += currChar;
				}
				else {
					formattedGroup.sequences.push({
						isGroup: true,
						sequences: currChar
					});
				}
			}
		}

		return formattedGroup;
	};

	RegExpTree.prototype.parseSet = function (set) {
		var fromattedSet = {
			isSet: true,
			ranges: []
		};

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
					fromattedSet.ranges.push([currChar]);
				}
				else if (range !== null && range !== i) {
					fromattedSet.ranges[fromattedSet.ranges.length - 1].push(currChar);
					range = null;
				}
			}
		}

		return fromattedSet;
	};

	return RegExpTree;
})();
