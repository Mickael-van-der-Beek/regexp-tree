module.exports = (function () {
	'use strict';

	return {

		isHexadecimal: function (str) {
			return /^[0-9a-zA-Z]+$/.test(str);
		},

		isMetaCharacter: function (str) {
			return str.length === 1 && !!~this.metaCharacters.indexOf(str);
		},

		metaCharacters: [
			'(',
			')',

			'[',
			']',

			'{',
			'}',

			'*',
			'+',

			'?',

			'.',

			'\\',

			'|',

			'^',

			'$',

			'-',

			',',

			'&',

			'#',

			'\s'
		]

		/*
		[
			// order matters for these
			'-',
			'[',
			']',
			// order doesn't matter for any of these
			'/',
			'{',
			'}',
			'(',
			')',
			'*',
			'+',
			'?',
			'.',
			'\\',
			'^',
			'$',
			'|',
			// from there on not obligatory but advised
			'~',
			'!',
			'@',
			'#',
			'%',
			'&',
			'´',
			'`',
			'/',
			'=',
			'_',
			':',
			';',
			'"',
			'\'',
			'<',
			'>',
			','
		]
		*/
	};
})();
