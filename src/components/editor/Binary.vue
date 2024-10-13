<template>
  <!-- first check for continuation of OR or AND which can be flattened -->
  <template v-if="isLogical(value.operator) && value.operator == modelValue.operator">
    <div class="d-block">
      <v-editor
        v-model="value"
        :depth="this.depth"
        att="left"
        @delete="deleteRow"
        @delete-sub="deleteSub"
        @update-sub="updateSub"
      />
    </div>
    <div class="d-block">
      <v-editor
        v-model="value"
        :depth="this.depth"
        att="right"
        @delete="deleteRow"
        @delete-sub="deleteSub"
        @update-sub="updateSub"
      />
    </div>
  </template>
  <!-- otherwise default to new block with an operator and two clauses -->
  <v-block v-else :depth="depth">
    <v-row @delete="deleteRow" @delete-sub="deleteSub" @update-sub="updateSub">
      <span class="badge bg-secondary">{{ mapOperator(value.operator) }}</span>
    </v-row>
    <div class="d-block">
      <v-editor
        v-model="value"
        att="left"
        :depth="this.depth + 1"
        :operator="value.operator"
        @delete="deleteRow"
        @delete-sub="deleteSub"
        @update-sub="updateSub"
      />
    </div>
    <div class="d-block">
      <v-editor
        v-model="value"
        att="right"
        :depth="this.depth + 1"
        :operator="value.operator"
        @delete="deleteRow"
        @delete-sub="deleteSub"
        @update-sub="updateSub"
      />
    </div>
  </v-block>
</template>

<script>
import Shared from './shared'

export default {
  name: 'v-conditional',
  mixins: [Shared],
  components: {
    'v-editor': () => import('./VisualEditor.vue')
  },
  methods: {
    mapOperator(op) {
      return op == '||'
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
