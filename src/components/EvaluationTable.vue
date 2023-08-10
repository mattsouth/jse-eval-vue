<docs>
Provides a truth table that enumerates all combinations of context variable values and the associated expression value.
</docs>

<template>
  <div class="fs-4" :class="{'opacity-50': disabled}">Evaluation <span v-if="total>1" class="fs-6">(n={{total}})</span></div>
  <table class="table table-sm" :class="{'opacity-50': disabled}">
    <thead>
      <tr>
        <th v-for="name in variables" v-bind:key="name">{{ name }}</th>
        <th>result</th>
      </tr>
    </thead>
    <tbody>
      <template v-if="variables.length > 0">
        <template v-if="total<=limit">
          <tr v-for="res in combinations" v-bind:key="res">
            <td v-for="name in variables" v-bind:key="name">
              {{ renderValue(res[name]) }}
            </td>
            <td>{{ renderValue(res._value) }}</td>
          </tr>
        </template>
        <tr v-else><td :colspan="variables.length+1">
          Too many combinations!  The limit for this table is {{limit}}.  Select individual context variable values to reduce the combinatorial explosion.
        </td></tr>
      </template>
      <template v-else>
        <tr v-if="Object.keys(expr).length > 0">
          <td>{{ renderValue(singleton) }}</td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script>
import Shared from "./shared";
import { evaluate } from 'jse-eval';

export default {
  props: {
    context: {
      type: Array,
      required: true,
    },
    expr: {
      type: Object,
      required: true,
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
  computed: {
    total() {
      return this.context.reduce((acc, val) => this.values(val).length * acc, 1);
    },
    combinations() {
      const r = [];
      // a view of context that excludes legacy variables
      const filtered = this.context.filter((val) => this.variables.includes(val.name));
      const dds = this.variables;
      const helper = (obj, i) => {
        for (var j = 0, l = this.values(filtered[i]).length; j < l; j++) {
          var o = { ...obj }; // clone obj
          o[dds[i]] = this.values(filtered[i])[j];
          if (i == filtered.length - 1) r.push(o);
          else helper(o, i + 1);
        }
      }
      // form an array of possible combination values of context.
      if (filtered.length > 0) {
        helper({}, 0);
        // evaluate expression values for that array
        for (let comb of r) {
          let val = evaluate(this.expr, comb);
          comb._value = val;
        }
      }
      return r;
    },
    singleton() {
      return evaluate.apply(this.expr);
    }
  },
  methods: {
    values(contextvar) {
      return contextvar.selected && contextvar.selected.length>0 ? contextvar.selected : contextvar.values;
    }
  }
};
</script>
