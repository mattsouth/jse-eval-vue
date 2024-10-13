<template>
  <v-empty v-if="!value.type" v-model="value" :depth="depth" :att="att" />
  <component
    v-else
    v-bind:is="getComponent(value.type)"
    v-model="value"
    :depth="depth"
    :att="att"
  />
</template>

<script>
import Binary from './Binary.vue'
import Unary from './Unary.vue'
import Conditional from './Conditional.vue'
import Identifier from './Identifier.vue'
import Literal from './Literal.vue'
import Empty from './Empty.vue'
import Shared from './shared'

export default {
  name: 'v-editor',
  mixins: [Shared],
  components: {
    'v-empty': Empty,
    'v-binary': Binary,
    'v-unary': Unary,
    'v-conditional': Conditional,
    'v-identifier': Identifier,
    'v-literal': Literal
  },
  methods: {
    getComponent(type) {
      switch (type) {
        case 'UnaryExpression':
          return 'v-unary'
        case 'BinaryExpression':
          return 'v-binary'
        case 'ConditionalExpression':
          return 'v-conditional'
        case 'Identifier':
          return 'v-identifier'
        case 'Literal':
          return 'v-literal'
      }
    }
  }
}
</script>
