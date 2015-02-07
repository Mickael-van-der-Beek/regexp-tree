RegExp-Tree
===========

Decomposes RegExp groups and sets into character range trees.

Only a subset of the JavaScript RegExp API syntax is implemented yet.
Currently, the following tokens are supported:

- [ ] Character Classes
	- [ ] .
	- [ ] \d
	- [ ] \D
	- [ ] \w
	- [ ] \W
	- [ ] \s
	- [ ] \S
	- [ ] \t
	- [ ] \r
	- [ ] \n
	- [ ] \v
	- [ ] \f
	- [ ] [\b]
	- [ ] \0
	- [ ] \cX
	- [x] \xhh
	- [x] \uhhhh
	- [x] \
- [ ] Character Sets
	- [x] [xyz]
	- [ ] [^xyz]
- [ ] Boundaries
	- [ ] ^
	- [ ] $
	- [ ] \b
	- [ ] \B
- [ ] Grouping and back references
	- [x] \(x)
	- [ ] \n
	- [ ] \(?:x)
- [ ] Quantifiers
	- [ ] x*
	- [ ] x+
	- [ ] x*? x+?
	- [ ] x?
	- [ ] x(?=y)
	- [ ] x(?!y)
	- [ ] x|y
	- [ ] x{n}
	- [ ] x{n,}
	- [ ] x{n,m}
