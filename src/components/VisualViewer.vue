<docs>
  A compact visualisation of a javascript expression

  TODO: work out how to add top padding to BinaryExpression when it wraps
  TODO: work out how to size the first column as needed and put everything else to the right (for conditionals).
</docs>

<template>
  <div
    v-if="value.type == 'ConditionalExpression'"
    class="border p-1"
    :class="{ 'opacity-50': disabled, 'border-warning': !valid }"
  >
    <div class="row g-2">
      <div class="col-2 text-end"><span class="badge bg-secondary">IF</span></div>
      <div class="col text-start"><expr-viewer :value="value.test" /></div>
    </div>
    <div class="row g-2">
      <div class="col-2 text-end"><span class="badge bg-secondary">THEN</span></div>
      <div class="col text-start"><expr-viewer :value="value.consequent" /></div>
    </div>
    <div class="row g-2">
      <div class="col-2 text-end"><span class="badge bg-secondary">ELSE</span></div>
      <div class="col text-start"><expr-viewer :value="value.alternate" /></div>
    </div>
  </div>
  <div
    v-if="value.type == 'BinaryExpression'"
    class="border d-inline-block p-1"
    :class="{ 'opacity-50': disabled, 'border-warning': !valid }"
  >
    <expr-viewer :value="value.left" />
    <span class="badge bg-secondary mx-2">{{ mapOperator(value.operator) }}</span>
    <expr-viewer :value="value.right" />
  </div>
  <div
    v-if="value.type == 'UnaryExpression'"
    class="border d-inline-block p-1"
    :class="{ 'opacity-50': disabled, 'border-warning': !valid }"
  >
    <span v-if="value.operator !== '-'" class="badge bg-secondary mx-2">{{
      mapOperator(value.operator)
    }}</span>
    <span v-else>{{ value.operator }}</span>
    <expr-viewer :value="value.argument" />
  </div>
  <template v-if="value.type == 'ArrayExpression'">
    [
    <template v-for="key of Object.keys(value.elements)" :key="key">
      <expr-viewer :value="value.elements[key]" />
      <span v-if="key < value.elements.length - 1">, </span>
    </template>
    ]
  </template>
  <template v-if="value.type == 'Identifier'"
    ><em>{{ value.name }}</em></template
  >
  <template v-if="value.type == 'Literal'">{{
    value.raw
  }}</template>
  <template v-if="value.type == 'CallExpression'">
    <span class="fst-italic">{{ value.callee.name }}</span>
    (
    <template v-for="key of Object.keys(value.arguments)" :key="key">
      <expr-viewer :value="value.arguments[key]" />
      <span v-if="key < value.arguments.length - 1">, </span>
    </template>
    )
  </template>
</template>

<script>
export default {
  name: 'expr-viewer',
  props: {
    value: Object,
    disabled: Boolean
  },
  computed: {
    valid() {
      if (this.value.type) {
        switch (this.value.type) {
          case 'ConditionalExpression':
            return (
              Object.keys(this.value.test).includes('type') &&
              Object.keys(this.value.consequent).includes('type') &&
              Object.keys(this.value.alternate).includes('type')
            )
          case 'BinaryExpression':
            return (
              Object.keys(this.value.left).includes('type') &&
              Object.keys(this.value.right).includes('type')
            )
          case 'UnaryExpression':
            return Object.keys(this.value.argument).includes('type')
          default:
            return true
        }
      } else {
        return false
      }
    }
  },
  methods: {
    mapOperator(op) {
      return op == '!'
        ? 'NOT'
        : op == '||'
          ? 'OR'
          : op == '&&'
            ? 'AND'
            : op == '=='
              ? '='
              : op == '>='
                ? '≥'
                : op == '<='
                  ? '≤'
                  : op
    }
  }
}
</script>
