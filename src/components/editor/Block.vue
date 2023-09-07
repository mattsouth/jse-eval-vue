<template>
  <div class="border-start border-2 ps-2 mb-1 text-start"
    :class="'border-' + color(this.depth)">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'v-block',
  props: {
    depth: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      colors: ['primary', 'info', 'success', 'warning', 'danger'],      
    }
  },
  methods: {
    color(idx) {
      return this.colors[idx % this.colors.length];
    },
  }
}
</script>