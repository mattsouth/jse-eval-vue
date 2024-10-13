<docs>
  A v-input component whose v-model is an estree object.
  If the text for the input cannot be parsed then the update event is not sent and a message is shown to the user.
</docs>

<template>
  <input
    class="form-control"
    type="text"
    v-model="text"
    :placeholder="placeholder"
    :disabled="disabled"
    @blur="updateModel"
    @keyup.enter="updateModel"
  />
  <div class="text-danger text-small mt-1" v-if="!valid">{{ validation }}</div>
</template>

<script>
import Shared from './shared'
import { parse } from 'jse-eval'

export default {
  name: 'v-parsing-input',
  props: {
    modelValue: Object,
    disabled: Boolean,
    placeholder: String
  },
  mixins: [Shared],
  emits: ['valid', 'update:modelValue'],
  data() {
    return {
      estree: this.modelValue,
      estext: this.stringifyAst(this.modelValue),
      valid: true,
      validation: ''
    }
  },
  computed: {
    text: {
      get() {
        return this.estext
      },
      set(text) {
        try {
          const tree = parse(text)
          // parsed successfully
          if (!this.valid) {
            this.valid = true
            this.validation = null
            this.$emit('valid', true)
          }
          this.estree = tree
        } catch (e) {
          if (this.valid) {
            this.valid = false
            this.$emit('valid', false)
          }
          this.validation = e.message
        }
        this.estext = text
      }
    }
  },
  methods: {
    updateModel() {
      if (this.valid) {
        this.$emit('update:modelValue', this.estree)
      }
    }
  },
  watch: {
    modelValue(newval) {
      this.estree = newval
      this.estext = this.stringifyAst(newval)
    }
  }
}
</script>
