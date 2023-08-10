<docs>
  A tool for testing and sharing javascript expressions.
</docs>
  
<template>
  <div class="col-lg-12 mx-auto p-3">
    <header>
      <div class="fs-2">jse-eval demo</div>
      <p>
        This tool is for testing and sharing javascript expressions.
        If you enter a valid javascript expression it
        will be analysed and any variables will be added to the context.
        Tap or click a variable in the Context section to edit the values.
        Combinations of values will be evaluated for your inspection.
        Context variables with values that are not found in the expression 
        will be kept but shown crossed out.
      </p>
    </header>
    <main>
      <div class="row">
        <div class="col-lg">
          <a role="button" class="btn btn-primary btn-sm float-end" href="/">
            Clear
          </a>
          <div class="fs-4 mb-1">Expression</div>
          <input class="form-control" type="text" v-model="text" placeholder="Enter a javascript expression"/>
          <div class="text-danger text-small mt-1" v-if="!valid">{{ validation }}</div>
          <context-table :context="context" :variables="variables" @update="context = $event" :disabled="!valid" @toggle-value="addRemoveSelected"/>
        </div>
        <div class="col-lg">
          <button type="button" class="btn btn-primary btn-sm float-end" :disabled="Object.keys(expr).length == 0"
            data-bs-toggle="modal" data-bs-target="#shareModal">
            Share
          </button>
          <evaluation-table :expr="estree" :context="context" :variables="variables" :disabled="!valid" />
        </div>
      </div>
    </main>
  </div>

  <!-- Modal -->
  <div class="modal fade" id="shareModal" tabindex="-1" aria-labelledby="Share expression and variable values"
    aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">
            Share example via url
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>Use this <a :href="shareURL()">url</a> to share this example.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import ContextTable from "./components/ContextTable.vue";
import EvaluationTable from "./components/EvaluationTable.vue";
import { parse } from 'jse-eval';
import Shared from "./components/shared";

let timeout;

export default {
  name: "App",
  data() {
    return {
      context: [], // an array of context variables
      expr: '', // expression text
      valid: true,
      validation: '',
      estree: {} // an estree AST
    };
  },
  mixins: [Shared],
  components: {
    "context-table": ContextTable,
    "evaluation-table": EvaluationTable,
  },
  mounted() {
    // initial data can be passed in the querystring
    // see https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("context")) {
      this.context = JSON.parse(urlParams.get("context"));
    }
    if (urlParams.get("expr")) {
      this.text = urlParams.get("expr");
    }
  },
  computed: {
    text: {
      get() {
        return this.expr;
      },
      set(value) {
        clearTimeout(timeout); // debounced
        timeout = setTimeout(() => {
          try {
            const json = parse(value);
            if (!this.valid) {
              this.valid = true;
              this.validation = "";
            }
            if (value != this.expr) {
              this.expr = value;
              this.estree = json;
            }
          } catch (e) {
            this.expr = value;
            if (this.valid) {
              this.valid = false;
            }
            this.validation = e.message;
          }
        }, 400);
      }
    },
    variables() {
      function helper(estree, vals) {
        if (estree != null && estree.type) {
          switch (estree.type) {
            case "Literal":
              break;
            case "Identifier":
              if (estree.name!='undefined') {
                vals.add(estree.name);
              }
              break;
            case "BinaryExpression":
              helper(estree.left, vals);
              helper(estree.right, vals);
              break;
            case "UnaryExpression":
              helper(estree.argument, vals);
              break;
            case "ConditionalExpression":
              helper(estree.test, vals);
              helper(estree.consequent, vals);
              helper(estree.alternate, vals);
              break;
            default:
              console.log('unhandled', JSON.stringify(estree))
          }
        }
        return vals;
      }
      return Array.from(helper(this.estree, new Set()));
    },
  },
  methods: {
    shareURL() {
      return (
        import.meta.env.BASE_URL +
        "?expr=" +
        encodeURIComponent(this.expr) +
        "&context=" +
        encodeURIComponent(JSON.stringify(this.context.filter((val) => this.variables.includes(val.name))))
      );
    },
    addRemoveSelected(evt) {
      let elem = this.context.find((val) => val.name==evt.name);
      let idx = elem.selected.indexOf(evt.value);
      if (idx>-1) {
        elem.selected.splice(idx, 1)
      } else {
        elem.selected.push(evt.value);
      }
    }
  },
  watch: {
    estree() {
      // trim / extend context based on the new expression
      const dds = [];
      const old = [];
      for (const [idx, dd] of this.context.entries()) {
        dds.push(dd.name);
        if (!this.variables.includes(dd.name) && dd.values.length == 1 && dd.values[0] === null) {
          old.push(idx);
        }
      }
      for (const dd of this.variables.filter((x) => !dds.includes(x))) {
        // add new variables to the context
        this.context.push({ name: dd, values: [null], selected: [] });
      }
      for (const idx of old) {
        // remove context variables without values
        this.context.splice(idx, 1);
      }
    },
  },
};
</script>
  