<template>
  <v-row v-if="atomic" @delete="$emit('delete', $event)">
    <slot />
  </v-row>
  <slot v-else/>
</template>

<script>
import Row from './Row.vue'
export default {
  props: {
    atomic: {
      type: Boolean,
      default: false
    }
  },
  components: {
    'v-row': Row
  },
  emits: ['delete']
}
</script>