# JSEP AST

Some notes on the abstract syntax tree (AST) produced by [jsep](https://github.com/EricSmekens/jsep).  jsep's AST is a subset of [ESTree](https://github.com/estree/estree) which covers the whole of javascript, not just expressions.

The [Annotated Source](https://ericsmekens.github.io/jsep/annotated_source/jsep.html) may be a useful reference, though it's based on an old version and talks about ``a && b`` being a LogicalExpression and not a BinaryExpression and that's not what I observe in practice.  The [typings](https://github.com/EricSmekens/jsep/blob/master/typings/tsd.d.ts) are also useful.

## Types

Each node in the AST has a type, these are the available types:

* 'Compound'
* 'SequenceExpression'
* 'Identifier'
* 'MemberExpression'
* 'Literal'
* 'ThisExpression'
* 'CallExpression'
* 'UnaryExpression'
* 'BinaryExpression'
* 'ArrayExpression'

see [jsep.js:895](https://github.com/EricSmekens/jsep/blob/0497757d90b81b172303ac8233548fbe5e4216aa/src/jsep.js#L895)

Note that the ternary plugin supports the 'ConditionalExpression' type and is built-in by default so is listed here.

### Compound

e.g. ``a b``

```
{
  "type": "Compound",
  "body": {
    "0": {
      "type": "Identifier",
      "name": "a"
    },
    "1": {
      "type": "Identifier",
      "name": "b"
    }
  }
}
```

Not sure when / how this is used.

### SequenceExpression

There are some references in the code but there arent any tests for this.  It may be a legacy type.

### Identifier

A variable, e.g. ``a``

```json
{
  "type": "Identifier",
  "name": "a"
}
```

### MemberExpression

A reference to an object attribute, e.g. ``test['a']``

```json
{
  "type": "MemberExpression",
  "computed": true,
  "object": {
    "type": "Identifier",
    "name": "test"
  },
  "property": {
    "type": "Literal",
    "value": "a",
    "raw": "'a'"
  }
}
```

Im not sure what the computed attribute indicates but I can see it set to true and false in the parser.

### Literal

A constant, e.g. ``3``

```json
{
  "type": "Literal",
  "value": 3,
  "raw": "3"
}
```

or ``'test'``

```json
{
  "type": "Literal",
  "value": "test",
  "raw": "'test'"
}
```

See also ``true``, ``false``, ``null`` and ``undefined``.

### ThisExpression

e.g. ``this``

```
{
  "type": "ThisExpression"
}
```

Which is often combined in a member expression, e.g. ``this.test``

```json
{
  "type": "MemberExpression",
  "computed": false,
  "object": {
    "type": "ThisExpression"
  },
  "property": {
    "type": "Identifier",
    "name": "test"
  }
}
```

### CallExpression

A call to a function, e.g. ``log('Hello World!')``

```json
{
  "type": "CallExpression",
  "arguments": {
    "0": {
      "type": "Literal",
      "value": "Hello World!",
      "raw": "'Hello World!'"
    }
  },
  "callee": {
    "type": "Identifier",
    "name": "log"
  }
}
```

Note that this demo cant handle a template literal.

### UnaryExpression

e.g. ``!a``

```json
{
  "type": "UnaryExpression",
  "operator": "!",
  "argument": {
    "type": "Identifier",
    "name": "a"
  },
  "prefix": true
}
```

Unary operators:
* '-'
* '!'
* '~'
* '+'

From the code I can see that the parser only ever returns ``prefix == true``.

### BinaryExpression

e.g. ``a && true``

```json
{
  "type": "BinaryExpression",
  "operator": "&&",
  "left": {
    "type": "Identifier",
    "name": "a"
  },
  "right": {
    "type": "Literal",
    "value": true,
    "raw": "true"
  }
}
```

#### List of operators

```javascript
// Also use a map for the binary operations but set their values to their
// binary precedence for quick reference (higher number = higher precedence)
// see [Order of operations](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence)
binary_ops: {
  '||': 1, '&&': 2, '|': 3, '^': 4, '&': 5,
  '==': 6, '!=': 6, '===': 6, '!==': 6,
  '<': 7, '>': 7, '<=': 7, '>=': 7,
  '<<': 8, '>>': 8, '>>>': 8,
  '+': 9, '-': 9,
  '*': 10, '/': 10, '%': 10
},
```
see [jsep.js:934](https://github.com/EricSmekens/jsep/blob/0497757d90b81b172303ac8233548fbe5e4216aa/src/jsep.js#L934C1-L944C4)

### ArrayExpression

e.g. ``[1,2]``

```json
{
  "type": "ArrayExpression",
  "elements": {
    "0": {
      "type": "Literal",
      "value": 1,
      "raw": "1"
    },
    "1": {
      "type": "Literal",
      "value": 2,
      "raw": "2"
    }
  }
}
```

empty array has ``elements: {}``

### ConditionalExpression

A bonus type, bundled with the ternary plugin by default.

e.g. ``test ? "yes" : "no"``

```
{
  "type": "ConditionalExpression",
  "test": {
    "type": "Identifier",
    "name": "test"
  },
  "consequent": {
    "type": "Literal",
    "value": "yes",
    "raw": "\"yes\""
  },
  "alternate": {
    "type": "Literal",
    "value": "no",
    "raw": "\"no\""
  }
}
```
## Brackets

An interesting facet of the AST is that it doesnt record brackets.  They affect the construction of the tree but they are not explicitly reflected in the tree so when reconstructing an expression from the tree some care needs to be taken with the interpretation of the tree.

In the following examples the brackets affect the structure of the tree.

``a + b + 4``

```json
{
  "type": "BinaryExpression",
  "operator": "+",
  "left": {
    "type": "BinaryExpression",
    "operator": "+",
    "left": {
      "type": "Identifier",
      "name": "a"
    },
    "right": {
      "type": "Identifier",
      "name": "b"
    }
  },
  "right": {
    "type": "Literal",
    "value": 4,
    "raw": "4"
  }
}
```

``a + (b + 4)``

```json
{
  "type": "BinaryExpression",
  "operator": "+",
  "left": {
    "type": "Identifier",
    "name": "a"
  },
  "right": {
    "type": "BinaryExpression",
    "operator": "+",
    "left": {
      "type": "Identifier",
      "name": "b"
    },
    "right": {
      "type": "Literal",
      "value": 4,
      "raw": "4"
    }
  }
}
```

There are some relevant issues/discussions about this on github:

* [A reverse of parse feature, nodes to expression](https://github.com/EricSmekens/jsep/issues/73)
* [How to represent manually added "extra" parenthesis in AST tree](https://github.com/EricSmekens/jsep/issues/242)
