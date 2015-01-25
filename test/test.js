var RegExpTree = require('../src/regexp-tree');
var regExpTree = new RegExpTree();

var tree;

// var trees = [
// 	'5',
// 	'a-b',
// 	'a-bc',
// 	// '^a-bc',
// 	'\\u0061-\\u0063\\u0065-\\u0067',
// 	'a-\\u0061',
// 	'a\\-\\u0061',
// 	'\\u0061',
// 	'\\\\',
// 	'\\]',
// 	'\\a',
// 	'a--\\u0061'
// ].forEach(function (set) {
// 	tree = regExpTree.parseSet(set);
// 	console.log('\nSET=', set);
// 	console.log('TREE=', tree, '\n');
// });

var trees = [
	'(ab)',
	'(a[c-d])',
].forEach(function (group) {
	tree = regExpTree.parseGroup(group);
	console.log('\nGROUP=', group);
	console.log('TREE=', require('util').inspect(tree, {
		depth: 30,
		colors: true
	}));
});

