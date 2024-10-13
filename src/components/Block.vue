<template>
  <div class="border-start border-2 ps-2 mb-1 text-start"
    :class="'border-' + color(this.depth) + (disabled ? ' opacity-50' : '')">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'v-block',
  props: {
    depth: Number,
    disabled: Boolean
  },
  data() {
    return {
      colors: ['primary', 'info', 'success', 'warning', 'danger'],
    }
  },
  methods: {
    color(idx) {
      return this.colors[idx % this.colors.length];
    }
  }
}
</script>
