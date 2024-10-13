<docs>
Provides a truth table that enumerates all combinations of context variable values and the associated expression value.
</docs>

<template>
  <div class="fs-4" :class="{ 'opacity-50': disabled }">
    Evaluation <span v-if="total > 1 && filtered.length > 1" class="fs-6">(n={{ total }})</span>
  </div>
  <table class="table table-sm" :class="{ 'opacity-50': disabled }">
    <thead>
      <tr>
        <th v-for="name in variables" v-bind:key="name" class="clickable" @click="changeSort(name)">
          {{ name }}
          <span v-if="name == this.sort.variable">
            <img src="/caret-down-fill.svg" v-if="this.sort.ascending" width="12" />
            <img src="/caret-up-fill.svg" v-if="!this.sort.ascending" width="12" />
          </span>
        </th>
        <th>result</th>
      </tr>
    </thead>
    <tbody>
      <template v-if="!disabled">
        <template v-if="variables.length > 0">
          <template v-if="total <= limit">
            <tr v-for="res in combinations" v-bind:key="res">
              <td v-for="name in variables" v-bind:key="name">
                {{ renderValue(res[name]) }}
              </td>
              <td>{{ renderValue(res._value) }}</td>
            </tr>
          </template>
          <tr v-else>
            <td :colspan="variables.length + 1">
              Too many combinations! The limit for this table is {{ limit }}. Select individual
              context variable values to reduce the combinatorial explosion.
            </td>
          </tr>
        </template>
        <template v-else>
          <tr v-if="Object.keys(expr).length > 0">
            <td>{{ renderValue(singleton) }}</td>
          </tr>
        </template>
      </template>
    </tbody>
  </table>
</template>

<script>
import Shared from './shared'
import { evaluate } from 'jse-eval'

export default {
  props: {
    context: {
      type: Array,
      required: true
    },
    expr: {
      type: Object,
      required: true
    },
    variables: {
      type: Array,
      required: true
    },
    limit: {
      type: Number,
      default: 400
    },
    disabled: {
      type: Boolean
    }
  },
  mixins: [Shared],
  data() {
    return {
      sort: {
        variable: null,
        ascending: true
      }
    }
  },
  computed: {
    total() {
      return this.context.reduce((acc, val) => this.values(val).length * acc, 1)
    },
    filtered() {
      // a view of context that excludes legacy variables
      return this.context.filter((val) => this.variables.includes(val.name))
    },
    combinations() {
      const r = []
      const dds = this.variables
      const helper = (obj, i) => {
        for (var j = 0, l = this.values(this.filtered[i]).length; j < l; j++) {
          var o = { ...obj } // clone obj
          o[dds[i]] = this.values(this.filtered[i])[j]
          if (i == this.filtered.length - 1) r.push(o)
          else helper(o, i + 1)
        }
      }
      // form an array of possible combination values of context.
      if (this.filtered.length > 0) {
        helper({}, 0)
        // evaluate expression values for that array
        for (let comb of r) {
          let val = evaluate(this.expr, comb)
          comb._value = val
        }
      }
      return r.sort(this.comparator)
    },
    singleton() {
      let res = 'n/a'
      if (this.expr && this.expr.length > 0) {
        try {
          res = evaluate(this.expr)
        } catch (err) {
          console.log('failed to evaluate', JSON.stringify(this.expr), err.message)
        }
      }
      return res
    }
  },
  methods: {
    values(contextvar) {
      return contextvar.selected && contextvar.selected.length > 0
        ? contextvar.selected
        : contextvar.values
    },
    comparator(left, right) {
      if (this.sort.ascending) {
        return left[this.sort.variable] > right[this.sort.variable]
          ? 1
          : left[this.sort.variable] == right[this.sort.variable]
            ? 0
            : -1
      } else {
        return left[this.sort.variable] < right[this.sort.variable]
          ? 1
          : left[this.sort.variable] == right[this.sort.variable]
            ? 0
            : -1
      }
    },
    changeSort(variable) {
      if (this.sort.variable == variable) {
        this.sort.ascending = !this.sort.ascending
      } else {
        this.sort.variable = variable
        this.sort.ascending = true
      }
    }
  },
  watch: {
    variables(newval, oldval) {
      if (!newval.includes(this.sort.variable)) {
        this.sort.variable = newval[0]
        this.sort.ascending = true
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
