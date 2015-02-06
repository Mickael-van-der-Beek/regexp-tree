var RegExpTree = require('../src/regexp-tree');
var regExpTree = new RegExpTree();

var assert = require('assert');

describe('RegExp Tree module tests', function () {
	'use strict';

	it('Simple group', function () {
		var group = /abc/;
		assert.deepEqual(
			regExpTree.parse(group),
			{
				isGroup: true,
				sequences: [{
					isGroup: true,
					sequences: 'abc'
				}]
			}
		);
	});

	it('Simple set', function () {
		var group = /[a-c]/;
		assert.deepEqual(
			regExpTree.parse(group),
			{
				isGroup: true,
				sequences: [{
					isSet: true,
					ranges: [
						['a', 'c']
					]
				}]
			}
		);
	});

	it('Mixed set and group', function () {
		var group = /a[b-df-h]g/;
		assert.deepEqual(
			regExpTree.parse(group),
			{
				isGroup: true,
				sequences: [{
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
				}]
			}
		);
	});

	it('Multiple sets', function () {
		var group = /[a-c][e-g]/;
		assert.deepEqual(
			regExpTree.parse(group),
			{
				isGroup: true,
				sequences: [{
					isSet: true,
					ranges: [
						['a', 'c']
					]
				},
				{
					isSet: true,
					ranges: [
						['e', 'g']
					]
				}]
			}
		);
	});
});
