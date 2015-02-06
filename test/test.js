var RegExpTree = require('../src/regexp-tree');
var regExpTree = new RegExpTree();

var assert = require('assert');

describe('RegExp Tree module tests', function () {
	'use strict';

	it('Simple range', function () {
		var group = /a[b-df-h]g/;
		assert.deepEqual(
			regExpTree.parse(group),
			[
				{
					isGroup: true,
					sequences: 'a'
				},
				{
					isSet: true,
					ranges: [
						['b', 'd'],
						['f', 'h']
					]
				},
				{
					isGroup: true,
					sequences: 'g'
				}
			]
		);
	});
});
