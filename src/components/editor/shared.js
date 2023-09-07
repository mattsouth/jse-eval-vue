import Row from './Row.vue'
import Block from './Block.vue'

export default {
  components: {
    'v-row': Row,
    'v-block': Block
  },
  props: {
    modelValue: Object,
    depth: {
      type: Number,
      default: 0
    },
    att: String
  },
  emits: ['update:modelValue', 'update-sub', 'delete-sub'],
  computed: {
    value: {
      get() {
        return (this.att ? this.modelValue[this.att] : this.modelValue)
      },
      set(value) {
        console.log('computed.value.set', value)
        this.$emit('update:model-value', value)
      }
    },
  },
  methods: {
    isLogical(op) {
      return op == "&&" || op == "||" || op == "!";
    },
    updateSub(evt) {
      let result = this.modelValue;
      result[evt.att] = evt.value;
      this.value = result;
    },
    deleteRow() {
      if (this.depth>0) {
        this.$emit('delete-sub', this.att);
      } else {
        this.value={}
      }
    },
    deleteSub(evt) {
      let result = this.modelValue;
      result[evt.att] = {};
      this.value = result;
    }
  }
}