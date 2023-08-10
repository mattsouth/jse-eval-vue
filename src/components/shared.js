// some shared functionality that can be added with mixins propertyS
export default {
  methods: {
    renderValue(val) {
      if (val == null) {
        return "null";
      } else {
        if (typeof val == "string") {
          return '"' + val + '"';
        } else if (typeof val == "object") {
          return JSON.stringify(val);
        } else {
          return val.toString();
        }
      }
    },
    // see https://github.com/EricSmekens/jsep/issues/73
    stringifyAst(node) {
      if (node.type === 'BinaryExpression' || node.type === 'LogicalExpression') {
        return '(' + this.stringifyAst(node.left) + ' ' + node.operator + ' ' + this.stringifyAst(node.right) + ')'
      }

      if (node.type === 'UnaryExpression') {
        return node.operator + this.stringifyAst(node.argument)
      }

      if (node.type === 'MemberExpression') {
        return this.stringifyAst(node.object) + '[' + this.stringifyAst(node.property) + ']'
      }

      if (node.type === 'Identifier') {
        return node.name
      }

      if (node.type === 'Literal') {
        if (typeof node.value === 'string') {
          return '"' + node.value + '"'
        }

        return '' + node.value
      }

      if (node.type === 'CallExpression') {
        return this.stringifyAst(node.callee) + '(' + node.arguments.map(this.stringifyAst).join(', ') + ')'
      }

      if (node.type === 'ArrayExpression') {
        return '[' + node.elements.map(this.stringifyAst).join(', ') + ']'
      }

      if (node.type === 'Compound') {
        return node.body.map(e => this.stringifyAst(e)).join(' ')
      }

      if (node.type === 'ConditionalExpression') {
        return this.stringifyAst(node.test) + ' ? ' + this.stringifyAst(node.consequent) + ' : ' + this.stringifyAst(node.alternate)
      }
      return '';
    }
  }
}
