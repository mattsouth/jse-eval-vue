<docs>
  A visual query editor for javascript expressions.  Anticipates being used with the v-model binding.

  Creates a tree of expression components to match the estree modelValue tree
  and passes deletes and updates to the root of the tree before emitting update:modelValue.
</docs>

<template>
  <template v-if="!modelValue.type">
    <!-- a menu of expression templates -->
    <v-row hide-delete>
      <v-template
        @click="
          enterValue({ type: 'ConditionalExpression', test: {}, consequent: {}, alternate: {} })
        "
        >IF/THEN/ELSE</v-template
      >
      <v-template
        @click="enterValue({ type: 'BinaryExpression', operator: '<', left: {}, right: {} })"
        >&lt;</v-template
      >
      <v-template
        @click="enterValue({ type: 'BinaryExpression', operator: '<=', left: {}, right: {} })"
        >&le;</v-template
      >
      <v-template
        @click="enterValue({ type: 'BinaryExpression', operator: '===', left: {}, right: {} })"
        >=</v-template
      >
      <v-template
        @click="enterValue({ type: 'BinaryExpression', operator: '>=', left: {}, right: {} })"
        >&ge;</v-template
      >
      <v-template
        @click="enterValue({ type: 'BinaryExpression', operator: '>', left: {}, right: {} })"
        >&gt;</v-template
      >
      <v-template
        @click="enterValue({ type: 'BinaryExpression', operator: '!==', left: {}, right: {} })"
        >!=</v-template
      >
      <v-template
        @click="enterValue({ type: 'BinaryExpression', operator: '&&', left: {}, right: {} })"
        >AND</v-template
      >
      <v-template
        @click="enterValue({ type: 'BinaryExpression', operator: '||', left: {}, right: {} })"
        >OR</v-template
      >
      <v-template @click="enterValue({ type: 'UnaryExpression', operator: '!', argument: {} })"
        >NOT</v-template
      >
      <v-template
        @click="enterValue({ type: 'BinaryExpression', operator: '+', left: {}, right: {} })"
        >+</v-template
      >
      <v-template
        @click="enterValue({ type: 'BinaryExpression', operator: '-', left: {}, right: {} })"
        >-</v-template
      >
      <v-template
        @click="enterValue({ type: 'BinaryExpression', operator: '*', left: {}, right: {} })"
        >×</v-template
      >
      <v-template
        @click="enterValue({ type: 'BinaryExpression', operator: '/', left: {}, right: {} })"
        >÷</v-template
      >
    </v-row>
    <!-- and a text box for entering variables and constants -->
    <div class="text-start">
      <v-parsing-input @update:modelValue="enterValue($event)" />
    </div>
  </template>
  <!-- conditional expression -->
  <v-block v-if="modelValue.type == 'ConditionalExpression'" :depth="depth" :disabled="disabled">
    <v-row @delete="deleteRow" @delete-sub="deleteSub"
      ><span class="badge bg-secondary me-2">IF</span></v-row
    >
    <v-expr-viewer
      v-model="modelValue['test']"
      :depth="this.depth + 1"
      att="test"
      @delete-sub="deleteSub"
      @update-sub="updateSub"
    />
    <v-row hide-delete><span class="badge bg-secondary me-2">THEN</span></v-row>
    <v-expr-viewer
      v-model="modelValue['consequent']"
      :depth="this.depth + 1"
      att="consequent"
      @delete-sub="deleteSub"
      @update-sub="updateSub"
    />
    <v-row hide-delete><span class="badge bg-secondary me-2">ELSE</span></v-row>
    <v-expr-viewer
      v-model="modelValue['alternate']"
      :depth="this.depth + 1"
      att="alternate"
      @delete-sub="deleteSub"
      @update-sub="updateSub"
    />
  </v-block>
  <!-- binary expression -->
  <template v-if="modelValue.type == 'BinaryExpression'">
    <!-- first check for continuation of OR or AND which can be flattened -->
    <template v-if="isLogical(modelValue.operator) && modelValue.operator == operator">
      <div class="d-block" :class="{ 'opacity-50': disabled }">
        <v-expr-viewer
          v-model="modelValue['left']"
          :depth="this.depth"
          :operator="modelValue.operator"
          att="left"
          @delete="deleteRow"
          @delete-sub="deleteSub"
          @update-sub="updateSub"
        />
      </div>
      <div class="d-block" :class="{ 'opacity-50': disabled }">
        <v-expr-viewer
          v-model="modelValue['right']"
          :depth="this.depth"
          :operator="modelValue.operator"
          att="right"
          @delete="deleteRow"
          @delete-sub="deleteSub"
          @update-sub="updateSub"
        />
      </div>
    </template>
    <template v-else>
      <!-- then check for simple clauses which get shown in a single row -->
      <!-- <v-row v-if="isSimple(modelValue.left) && isSimple(modelValue.right)" @delete="deleteClause">
        <v-expr-viewer v-model="modelValue.left" :depth="this.depth + 1" :operator="modelValue.operator" />
        <span class="badge bg-secondary mx-2">{{ mapOperator(modelValue.operator) }}</span>
        <v-expr-viewer v-model="modelValue.right" :depth="this.depth + 1" :operator="modelValue.operator" />
      </v-row> -->
      <!-- otherwise show default representation -->
      <v-block :depth="depth" :disabled="disabled">
        <v-row @delete="deleteRow" @delete-sub="deleteSub" @update-sub="updateSub">
          <span class="badge bg-secondary">{{ mapOperator(modelValue.operator) }}</span>
          <button
            v-if="isLogical(modelValue.operator)"
            type="button"
            href="#"
            class="btn btn-light btn-sm opacity-50"
            style="
              --bs-btn-padding-y: 0.1rem;
              --bs-btn-padding-x: 0.5rem;
              --bs-btn-font-size: 0.75rem;
            "
            @click="addLogicalClause"
          >
            &plus;
          </button>
        </v-row>
        <div class="d-block">
          <v-expr-viewer
            v-model="modelValue['left']"
            att="left"
            :depth="this.depth + 1"
            :operator="modelValue.operator"
            @delete="deleteRow"
            @delete-sub="deleteSub"
            @update-sub="updateSub"
          />
        </div>
        <div class="d-block">
          <v-expr-viewer
            v-model="modelValue['right']"
            att="right"
            :depth="this.depth + 1"
            :operator="modelValue.operator"
            @delete="deleteRow"
            @delete-sub="deleteSub"
            @update-sub="updateSub"
          />
        </div>
      </v-block>
    </template>
  </template>
  <template v-if="modelValue.type == 'ArrayExpression'">
    <v-block :depth="depth" :disabled="disabled">
      <v-row @delete="deleteRow" @delete-sub="deleteSub" @update-sub="updateSub">
        <span class="badge bg-secondary">[]</span>
        <button
          type="button"
          href="#"
          class="btn btn-light btn-sm opacity-50"
          style="
            --bs-btn-padding-y: 0.1rem;
            --bs-btn-padding-x: 0.5rem;
            --bs-btn-font-size: 0.75rem;
          "
          @click="addArrayElement"
        >
          &plus;
        </button>
      </v-row>
      <template v-for="key of Object.keys(modelValue.elements)" :key="key">
        <v-expr-viewer
          v-model="modelValue.elements[key]"
          att="elements"
          :idx="key"
          :depth="this.depth + 1"
          @delete="deleteRow"
          @delete-sub="deleteSub"
          @update-sub="updateSub"
        />
      </template>
    </v-block>
  </template>
  <template v-if="modelValue.type == 'CallExpression'">
    <v-block :depth="depth" :disabled="disabled">
      <v-row @delete="deleteRow" @delete-sub="deleteSub" @update-sub="updateSub">
        <span class="fst-italic badge bg-secondary">{{ modelValue.callee.name }}()</span>
      </v-row>
      <template v-for="key of Object.keys(modelValue.arguments)" :key="key">
        <v-expr-viewer
          v-model="modelValue.arguments[key]"
          att="arguments"
          :idx="key"
          :depth="this.depth + 1"
          @delete="deleteRow"
          @delete-sub="deleteSub"
          @update-sub="updateSub"
        />
      </template>
    </v-block>
  </template>
  <template v-if="modelValue.type == 'UnaryExpression'">
    <v-block :depth="depth" :disabled="disabled">
      <v-row @delete="deleteRow" @delete-sub="deleteSub" @update-sub="updateSub">
        <span class="badge bg-secondary">{{ mapOperator(modelValue.operator) }}</span>
      </v-row>
      <div class="d-block">
        <v-expr-viewer
          v-model="modelValue['argument']"
          att="argument"
          :depth="this.depth + 1"
          @delete="deleteRow"
          @delete-sub="deleteSub"
          @update-sub="updateSub"
        />
      </div>
    </v-block>
  </template>
  <v-row
    v-if="modelValue.type == 'Identifier'"
    @delete="deleteRow"
    @delete-sub="deleteSub"
    @update-sub="updateSub"
  >
    <template v-if="modelValue.name !== 'undefined'">
      <span class="badge bg-info"
        ><em>{{ modelValue.name }}</em></span
      >
    </template>
    <span v-else
      ><em>{{ modelValue.name }}</em></span
    >
  </v-row>
  <v-row
    v-if="modelValue.type == 'Literal'"
    @delete="deleteRow"
    @delete-sub="deleteSub"
    @update-sub="updateSub"
    >{{ modelValue.raw }}</v-row
  >
</template>

<script>
import Row from './Row.vue'
import Block from './Block.vue'
import ExpressionTemplate from './ExpressionTemplate.vue'
import ParsingInput from './ParsingInput.vue'

export default {
  name: 'v-expr-viewer',
  components: {
    'v-row': Row,
    'v-block': Block,
    'v-template': ExpressionTemplate,
    'v-parsing-input': ParsingInput
  },
  props: {
    modelValue: Object,
    depth: {
      type: Number,
      default: 0
    },
    att: String,
    operator: {
      type: String,
      optional: true
    },
    disabled: Boolean,
    idx: {
      type: String,
      optional: true
    }
  },
  emits: ['delete', 'update:modelValue', 'delete-sub', 'update-sub'],
  methods: {
    mapOperator(op) {
      switch (op) {
        case '!':
          return 'NOT'
        case '||':
          return 'OR'
        case '&&':
          return 'AND'
        case '==':
        case '===':
          return '='
        case '!=':
        case '!==':
          return '!='
        case '>=':
          return '≥'
        case '<=':
          return '≤'
        case '*':
          return '×'
        case '/':
          return '÷'
        default:
          return op
      }
    },
    isSimple(estree) {
      return estree.type == 'Identifier' || estree.type == 'Literal'
    },
    isLogical(op) {
      return op == '&&' || op == '||' || op == '!'
    },
    enterValue(val) {
      if (this.att) {
        this.$emit('update-sub', { attribute: this.att, value: val, index: this.idx })
      } else {
        this.$emit('update:modelValue', val)
      }
    },
    updateSub(evt) {
      let result = this.modelValue
      if (evt.index) {
        result[evt.attribute][evt.index] = evt.value
      } else {
        result[evt.attribute] = evt.value
      }
      if (this.depth > 0) {
        this.$emit('update-sub', { attribute: this.att, value: result })
      } else {
        this.$emit('update:modelValue', result)
      }
    },
    deleteRow() {
      if (this.depth > 0) {
        this.$emit('delete-sub', { attribute: this.att, index: this.idx })
      } else {
        this.$emit('update:modelValue', {})
      }
    },
    deleteSub(evt) {
      let result = this.modelValue
      if (evt.index) {
        result[evt.attribute].splice(evt.index, 1)
      } else {
        result[evt.attribute] = {}
      }
      if (this.depth > 0) {
        this.$emit('update-sub', { attribute: this.att, value: result })
      } else {
        this.$emit('update:modelValue', result)
      }
    },
    addArrayElement() {
      let result = this.modelValue
      result.elements.push({})
      if (this.depth > 0) {
        this.$emit('update-sub', { attribute: this.att, value: result })
      } else {
        this.$emit('update:modelValue', result)
      }
    },
    addLogicalClause() {
      function addClause(estree) {
        // walk the tree until the operator changes
        if (estree.right.type == 'BinaryExpression' && estree.right.operator == estree.operator) {
          addClause(estree.right)
        } else {
          // then convert the final clause to another binary expression with the same operator
          // and the existing clause as its left attribute and an empty right attribute
          let clause = estree.right
          estree.right = {
            type: 'BinaryExpression',
            operator: estree.operator,
            left: clause,
            right: {}
          }
        }
      }
      let result = this.modelValue
      addClause(result)
      if (this.depth > 0) {
        this.$emit('update-sub', { attribute: this.att, value: result })
      } else {
        this.$emit('update:modelValue', result)
      }
    }
  }
}
</script>

<style scoped>
.clickable {
  cursor: pointer;
}
</style>
