<template>
  <div class="d-block bg-light mb-1 position-relative text-start">
    <slot />
    <button v-if="!hideDelete"
      type="button"
      href="#"
      class="btn btn-light btn-sm position-absolute end-0 opacity-50"
      style="--bs-btn-padding-y: 0.1rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;"
      @click="$emit('delete', $event)">
      &times;
    </button>
  </div>
</template>

<script>
export default {
  name: 'v-row',
  props: {
    hideDelete: Boolean
  },
  emits: ['delete']
}
</script>