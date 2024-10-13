<template>
  <span class="badge bg-secondary me-2 clickable opacity-50">
    <slot />
  </span>
</template>

<script>
export default {
  name: 'v-template'
}
</script>

<style scoped>
.clickable {
  cursor: pointer;
}
</style>
