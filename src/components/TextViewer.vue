<docs>
  A text expansion of a javascript expression
</docs>

<template>
  <pre class="text-start">{{expandedText}}</pre>
</template>

<script>

import Shared from './shared'

export default {
  name: 'text-viewer',
  props: {
    disabled: Boolean,
    value: Object
  },
  mixins: [Shared],
  computed: {
    expandedText() {
      return this.stringifyExpandedAst(this.value, 0)
    },
    text() {
      return this.stringifyAst(this.value, 0)
    }
  },
  methods: {
    // return expression over several lines to aid understanding
    // see https://github.com/EricSmekens/jsep/issues/73
    stringifyExpandedAst(node, depth, operator) {
      function bracketify(t, d) {
        return d == undefined || d == 0 ? t : '(\n' + t.split('\n').map((line) => "".padStart(2) + line).join('\n') + '\n)'
      }
      if (node) {
        if (node.type === 'BinaryExpression' || node.type === 'LogicalExpression') {
          if (['&&', '||'].includes(node.operator)) {
            if (operator && operator == node.operator) {
              // dont step in
              return this.stringifyExpandedAst(node.left, depth+1, node.operator) +
                ' ' +
                node.operator +
                '\n' +
                this.stringifyExpandedAst(node.right, depth+1, node.operator)
            } else {
              return bracketify(
                this.stringifyExpandedAst(node.left, depth+1, node.operator) +
                  ' ' +
                  node.operator +
                  '\n' +
                  this.stringifyExpandedAst(node.right, depth+1, node.operator)
                , depth
              )
            }
          } else { // e.g. "!=",  "==", "===", ">=", "<="
            return this.stringifyExpandedAst(node.left, depth) +
              ' ' +
              node.operator + ' ' +
              this.stringifyExpandedAst(node.right, depth)
          }
        }

        if (node.type === 'UnaryExpression') {
          return node.operator + this.stringifyExpandedAst(node.argument, depth + 1, true)
        }

        if (node.type === 'MemberExpression') {
          return (
            this.stringifyExpandedAst(node.object, depth + 1) +
            '[' +
            this.stringifyExpandedAst(node.property, depth + 1) +
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
            return node.value
          }
        }

        if (node.type === 'CallExpression') {
          return (
            this.stringifyExpandedAst(node.callee) +
            '(' +
            node.arguments.map((arg) => this.stringifyExpandedAst(arg, 0)).join(', ') +
            ')'
          )
        }

        if (node.type === 'ArrayExpression') {
          return '[' + node.elements.map((arg) => this.stringifyExpandedAst(arg, depth + 1)).join(', ') + ']'
        }

        if (node.type === 'Compound') {
          return Object.keys(node.body)
            .map((e) => this.stringifyExpandedAst(node.body[e], depth + 1))
            .join(' ')
        }

        if (node.type === 'ConditionalExpression') {
          return bracketify(
            this.stringifyExpandedAst(node.test, depth + 1) +
              ' ?\n' +
              this.stringifyExpandedAst(node.consequent, depth + 1) +
              ' :\n' +
              this.stringifyExpandedAst(node.alternate, depth + 1)
            , depth
          )
        }
      }
      return ''
    }
  }
}
</script>
