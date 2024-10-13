<template>
  <v-block :depth="depth">
    <v-row @delete="deleteRow" @delete-sub="deleteSub"
      ><span class="badge bg-secondary me-2">IF</span></v-row
    >
    <v-editor
      v-model="value"
      ref="test"
      :depth="this.depth + 1"
      att="test"
      @delete-sub="deleteSub"
      @update-sub="updateSub"
    />
    <v-row hide-delete><span class="badge bg-secondary me-2">THEN</span></v-row>
    <v-editor
      v-model="value"
      ref="consequent"
      :depth="this.depth + 1"
      att="consequent"
      @delete-sub="deleteSub"
      @update-sub="updateSub"
    />
    <v-row hide-delete><span class="badge bg-secondary me-2">ELSE</span></v-row>
    <v-editor
      v-model="value"
      ref="alternate"
      :depth="this.depth + 1"
      att="alternate"
      @delete-sub="deleteSub"
      @update-sub="updateSub"
    />
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
  emits: ['update-sub']
}
</script>
