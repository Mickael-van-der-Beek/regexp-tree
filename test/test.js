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

	it('Unicode decoded group', function () {
		var group = /\u0061\u0062\u0063/;
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

	it('Unicode decoded set', function () {
		var group = /[\u0061-\u0063]/;
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

	it('Mixed-unicode decoded set', function () {
		var group = /[a-\u0063][\u0061-c]/;
		assert.deepEqual(
			regExpTree.parse(group),
			{
				isGroup: true,
				sequences: [{
					isSet: true,
					ranges: [
						['a', 'c']
					]
				}, {
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

	it('Multiple groups', function () {
		var group = /(abc)(efg)/;
		assert.deepEqual(
			regExpTree.parse(group),
			{
				isGroup: true,
				sequences: [{
					isGroup: true,
					sequences: [{
						isGroup: true,
						sequences: 'abc'
					}]
				}, {
					isGroup: true,
					sequences: [{
						isGroup: true,
						sequences: 'efg'
					}]
				}]
			}
		);
	});

	it('Group with escaped chars', function () {
		var group = /(ab\)c)(e\(fg)/;
		assert.deepEqual(
			regExpTree.parse(group),
			{
				isGroup: true,
				sequences: [{
					isGroup: true,
					sequences: [{
						isGroup: true,
						sequences: 'ab)c'
					}]
				}, {
					isGroup: true,
					sequences: [{
						isGroup: true,
						sequences: 'e(fg'
					}]
				}]
			}
		);
	});

	it('Set with escaped chars', function () {
		var group = /[a-c\[][\]e-g]/;
		assert.deepEqual(
			regExpTree.parse(group),
			{
				isGroup: true,
				sequences: [{
					isSet: true,
					ranges: [
						['a', 'c'],
						['[']
					]
				}, {
					isSet: true,
					ranges: [
						['\]'],
						['e', 'g']
					]
				}]
			}
		);
	});

	it('Set with trailling escaped chars', function () {
		var group = /[a-c]\]\[[e-g]/;
		assert.deepEqual(
			regExpTree.parse(group),
			{
				isGroup: true,
				sequences: [{
					isSet: true,
					ranges: [
						['a', 'c']
					]
				}, {
					isGroup: true,
					sequences: ']['
				}, {
					isSet: true,
					ranges: [
						['e', 'g']
					]
				}]
			}
		);
	});

	it('Group with escaped back-slash', function () {
		var group = /(ab\\\)c)(e\\\(fg)/;
		assert.deepEqual(
			regExpTree.parse(group),
			{
				isGroup: true,
				sequences: [{
					isGroup: true,
					sequences: [{
						isGroup: true,
						sequences: 'ab\\)c'
					}]
				}, {
					isGroup: true,
					sequences: [{
						isGroup: true,
						sequences: 'e\\(fg'
					}]
				}]
			}
		);
	});

	it('Set range with back-slash as boundary', function () {
		var group = /[\\-c][\u0000-\\]/;
		assert.deepEqual(
			regExpTree.parse(group),
			{
				isGroup: true,
				sequences: [{
					isSet: true,
					ranges: [
						['\\', 'c']
					]
				}, {
					isSet: true,
					ranges: [
						['\u0000', '\\']
					]
				}]
			}
		);
	});
});
