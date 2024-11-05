// some shared functionality that can be added with mixins propertyS
export default {
  methods: {
    renderValue(val) {
      if (val == null) {
        return 'null'
      } else {
        if (typeof val == 'string') {
          return '"' + val + '"'
        } else if (typeof val == 'object') {
          return JSON.stringify(val)
        } else {
          return val.toString()
        }
      }
    },
    // render estree on a single line
    // see https://github.com/EricSmekens/jsep/issues/73
    // (altered so that brackets arent added at depth 0)
    // and null is handled
    stringifyAst(node, depth) {
      // t is a string, add brackets around it if d>0 (dont bracket the root expression)
      const bracketify = (t, d) => {
        return d == undefined || d == 0 ? t : '(' + t + ')'
      }
      if (node) {
        if (node.type === 'BinaryExpression' || node.type === 'LogicalExpression') {
          return bracketify(
            this.stringifyAst(node.left, depth + 1) +
              ' ' +
              node.operator +
              ' ' +
              this.stringifyAst(node.right, depth + 1)
            , depth
          )
        }

        if (node.type === 'UnaryExpression') {
          return node.operator + this.stringifyAst(node.argument, depth + 1)
        }

        if (node.type === 'MemberExpression') {
          return (
            this.stringifyAst(node.object, depth + 1) +
            '[' +
            this.stringifyAst(node.property, depth + 1) +
            ']'
          )
        }

        if (node.type === 'Identifier') {
          return node.name
        }

        if (node.type === 'Literal') {
          if (typeof node.value === 'string') {
            return '"' + node.value + '"'
          } else {
            return '' + node.value
          }
        }

        if (node.type === 'CallExpression') {
          return (
            this.stringifyAst(node.callee, depth + 1) +
            '(' +
            node.arguments.map(this.stringifyAst, depth + 1).join(', ') +
            ')'
          )
        }

        if (node.type === 'ArrayExpression') {
          return '[' + node.elements.map(this.stringifyAst).join(', ') + ']'
        }

        if (node.type === 'Compound') {
          return Object.keys(node.body)
            .map((e) => this.stringifyAst(node.body[e], depth + 1))
            .join(' ')
        }

        if (node.type === 'ConditionalExpression') {
          return bracketify(
            this.stringifyAst(node.test, depth + 1) +
              ' ? ' +
              this.stringifyAst(node.consequent, depth + 1) +
              ' : ' +
              this.stringifyAst(node.alternate, depth + 1),
            depth
          )
        }
      }
      return ''
    }
  }
}
