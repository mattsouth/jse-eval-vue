<docs>
  A debounced input control.
</docs>

<template>
  <input v-model="text" :type="type" :disabled="disabled" :placeholder="placeholder" />
</template>

<script>
let timer

export default {
  name: 'v-input',
  props: {
    modelValue: String,
    timeout: {
      type: Number,
      default: 100
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: String,
    disabled: Boolean
  },
  events: ['update:modelValue', 'blur', 'keyup'],
  computed: {
    text: {
      get() {
        return this.modelValue
      },
      set(value) {
        clearTimeout(timer) // debounced
        timer = setTimeout(() => {
          this.$emit('update:modelValue', value)
        }, this.timeout)
      }
    }
  }
}
</script>
