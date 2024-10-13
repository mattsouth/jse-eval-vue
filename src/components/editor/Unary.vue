<template>
  <v-block :depth="depth">
    <v-row @delete="deleteRow" @delete-sub="deleteSub" @update-sub="updateSub">
      <span class="badge bg-secondary">
        {{ mapOperator(value.operator) }}
      </span>
    </v-row>
    <div class="d-block">
      <v-editor
        v-model="value"
        att="argument"
        :depth="this.depth + 1"
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
  name: 'v-unary',
  mixins: [Shared],
  components: {
    'v-editor': () => import('./VisualEditor.vue')
  },
  methods: {
    mapOperator(op) {
      return op == '!' ? 'NOT' : op
    }
  }
}
</script>
