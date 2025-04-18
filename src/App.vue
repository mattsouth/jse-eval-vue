<docs>
  A tool for testing and sharing javascript expressions.
</docs>

<template>
  <div class="col-lg-12 mx-auto p-3">
    <header>
      <div class="float-end">
        <a href="https://github.com/mattsouth/jse-eval-vue"><img src="/github.svg" width="24" /></a>
      </div>
      <div class="fs-2">Javascript expressions</div>
      <p>
        This tool is for testing and sharing javascript expressions that are evaluated with the
        <a href="https://github.com/6utt3rfly/jse-eval">jse-eval</a> library. If you enter a
        javascript expression then it will be evaluated for you. If your expression has variables
        then you can supply values for those variables and see all combinations of those values
        evaluated. The share button provides you with a url for sharing your expression and sample
        variable values.
      </p>
    </header>
    <main>
      <div class="row">
        <div class="col-lg">
          <a role="button" class="btn btn-primary btn-sm float-end" :href="clearURL()"> Clear </a>
          <div class="fs-4 mb-1">Expression</div>
          <input
            class="form-control"
            type="text"
            v-model="text"
            placeholder="Enter a javascript expression"
            :disabled="!treeValid"
          />
          <div class="text-danger text-small mt-1" v-if="!valid">{{ validation }}</div>
          <div class="card text-center mt-3" :class="{ 'border-warning': !treeValid }">
            <div class="card-header">
              <span class="float-end">
                <a
                  tabindex="0"
                  role="button"
                  ref="popoverHelp"
                  class="btn btn-link btn-sm"
                  data-bs-container="body"
                  data-bs-trigger="focus"
                  data-bs-toggle="popover"
                  data-bs-placement="top"
                  data-bs-content="The Edit tab is an experimental visual expression editor.  The View tab shows a visualisation of the expression.  The JSON tab shows the underlying estree representation of the expression that both Edit and View are using."
                >
                  <img src="/question-circle.svg" alt="help" width="16" height="16" />
                </a>
              </span>
              <ul class="nav nav-tabs card-header-tabs">
                <li class="nav-item">
                  <a
                    class="nav-link"
                    :class="{ active: tab == 2, disabled: !textValid }"
                    :aria-current="tab == 1 ? true : null"
                    href="#"
                    @click="tab = 2"
                    :aria-disabled="!textValid"
                    >Edit</a
                  >
                </li>
                <li class="nav-item">
                  <a
                    class="nav-link"
                    :class="{ active: tab == 1, disabled: !textValid }"
                    :aria-current="tab == 1 ? true : null"
                    href="#"
                    @click="tab = 1"
                    :aria-disabled="!textValid"
                    >View</a
                  >
                </li>
                <li class="nav-item">
                  <a
                    class="nav-link"
                    :class="{ active: tab == 0, disabled: !textValid }"
                    :aria-current="tab == 0 ? true : null"
                    href="#"
                    @click="tab = 0"
                    :aria-disabled="!textValid"
                    >JSON</a
                  >
                </li>
                <li class="nav-item">
                  <a
                    class="nav-link"
                    :class="{ active: tab == 3, disabled: !textValid }"
                    :aria-current="tab == 3 ? true : null"
                    href="#"
                    @click="tab = 3"
                    :aria-disabled="!textValid"
                    >TEXT</a
                  >
                </li>
              </ul>
            </div>
            <div class="card-body">
              <json-viewer v-if="tab == 0" :value="cleanEstree" :disabled="!textValid" />
              <expr-viewer v-if="tab == 1" :value="estree" :disabled="!textValid" />
              <v-editor v-if="tab == 2" v-model="tree" :disabled="!textValid" />
              <text-viewer v-if="tab == 3" :value="estree" :disabled="!textValid" />
            </div>
          </div>
          <context-table
            :context="context"
            :variables="variables"
            @update="context = $event"
            :disabled="!valid"
            @toggle-value="addRemoveSelected"
          />
        </div>
        <div class="col-lg">
          <button
            type="button"
            class="btn btn-primary btn-sm float-end"
            :disabled="Object.keys(expr).length == 0"
            data-bs-toggle="modal"
            data-bs-target="#shareModal"
          >
            Share
          </button>
          <evaluation-table
            :expr="estree"
            :context="context"
            :variables="variables"
            :disabled="!valid"
          />
        </div>
      </div>
    </main>
  </div>

  <!-- Modal -->
  <div
    class="modal fade"
    id="shareModal"
    tabindex="-1"
    aria-labelledby="Share expression and variable values"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Share example via url</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p>Use this <a :href="shareURL()">url</a> to share this example.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ContextTable from './components/ContextTable.vue'
import EvaluationTable from './components/EvaluationTable.vue'
import JSONEditor from './components/JSONEditor.vue'
import VisualViewer from './components/VisualViewer.vue'
import VisualEditor from './components/VerboseVisualExpressionEditor.vue'
import TextViewer from './components/TextViewer.vue'
import { registerPlugin, parse } from 'jse-eval'
import Shared from './components/shared'
import { Popover } from 'bootstrap'

let timeout

// see https://github.com/EricSmekens/jsep#how-to-add-plugins
// indicates in the AST when an expression term has enclosing brackets
registerPlugin({
  name: 'brackets',
  init(jsep) {
    let start = -1
    jsep.hooks.add('gobble-token', function myPlugin(env) {
      start = env.context.index
    });
    jsep.hooks.add('after-token', function myPlugin(env) {
      let token = env.context.expr.substring(start, env.context.index)
      if (env.node && token.trim()==')') {
        env.node.brackets = true
      }
    });
  }
})

export default {
  name: 'App',
  data() {
    return {
      context: [], // an array of context variables
      expr: '', // expression text
      textValid: true,
      validation: '',
      estree: {}, // estree AST of text
      tab: 2 // selected estree view
    }
  },
  mixins: [Shared],
  components: {
    'context-table': ContextTable,
    'evaluation-table': EvaluationTable,
    'json-viewer': JSONEditor,
    'expr-viewer': VisualViewer,
    'v-editor': VisualEditor,
    'text-viewer': TextViewer
  },
  mounted() {
    // initial data can be passed in the querystring
    // see https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('context')) {
      this.context = JSON.parse(urlParams.get('context'))
    }
    if (urlParams.get('expr')) {
      this.text = urlParams.get('expr')
    }
    new Popover(this.$refs.popoverHelp)
  },
  computed: {
    text: {
      get() {
        return this.expr
      },
      set(value) {
        clearTimeout(timeout) // debounced
        timeout = setTimeout(() => {
          try {
            const json = parse(value)
            if (!this.textValid) {
              this.textValid = true
              this.validation = ''
            }
            if (value != this.expr) {
              this.expr = value
              this.estree = json
            }
          } catch (e) {
            this.expr = value
            if (this.textValid) {
              this.textValid = false
            }
            this.validation = e.message
          }
        }, 400)
      }
    },
    tree: {
      get() {
        return this.estree
      },
      set(value) {
        this.estree = value
        if (this.treeValid) {
          this.expr = this.stringifyAst(value)
          this.updateVariables() // estree.watch not invoked for some reason
        }
      }
    },
    variables() {
      function helper(estree, vals) {
        if (estree != null && estree.type) {
          switch (estree.type) {
            case 'Literal':
              break
            case 'Identifier':
              if (estree.name != 'undefined') {
                vals.add(estree.name)
              }
              break
            case 'BinaryExpression':
              helper(estree.left, vals)
              helper(estree.right, vals)
              break
            case 'UnaryExpression':
              helper(estree.argument, vals)
              break
            case 'ConditionalExpression':
              helper(estree.test, vals)
              helper(estree.consequent, vals)
              helper(estree.alternate, vals)
              break
            case 'Compound':
              for (let key of Object.keys(estree.body)) {
                helper(estree.body[key], vals)
              }
              break
            case 'ArrayExpression':
              for (let key of Object.keys(estree.elements)) {
                helper(estree.elements[key], vals)
              }
              break
            case 'CallExpression':
              for (let key of Object.keys(estree.arguments)) {
                helper(estree.arguments[key], vals)
              }
              break
            default:
              console.error('unhandled', JSON.stringify(estree))
          }
        }
        return vals
      }
      return Array.from(helper(this.estree, new Set()))
    },
    cleanEstree() {
      return this.clean(this.estree)
    },
    valid() {
      return this.textValid && this.treeValid
    },
    treeValid() {
      return this.checkTreeValid(this.estree)
    }
  },
  methods: {
    shareURL() {
      return (
        import.meta.env.BASE_URL +
        '?expr=' +
        encodeURIComponent(this.expr) +
        '&context=' +
        encodeURIComponent(
          JSON.stringify(this.context.filter((val) => this.variables.includes(val.name)))
        )
      )
    },
    clearURL() {
      return import.meta.env.BASE_URL
    },
    addRemoveSelected(evt) {
      let elem = this.context.find((val) => val.name == evt.name)
      let idx = elem.selected.indexOf(evt.value)
      if (idx > -1) {
        elem.selected.splice(idx, 1)
      } else {
        elem.selected.push(evt.value)
      }
    },
    // return cloned and cleaned object by removing _value keys
    clean(obj) {
      let result = {}
      if (obj) {
        Object.keys(obj).forEach((key) => {
          if (key != '_value') {
            if (typeof obj[key] === 'object') {
              result[key] = this.clean(obj[key])
            } else {
              result[key] = obj[key]
            }
          }
        })
      }
      return result
    },
    updateVariables() {
      // trim / extend context based on the new expression
      const dds = []
      const old = []
      for (const [idx, dd] of this.context.entries()) {
        dds.push(dd.name)
        if (!this.variables.includes(dd.name) && dd.values.length == 1 && dd.values[0] === null) {
          old.push(idx)
        }
      }
      for (const dd of this.variables.filter((x) => !dds.includes(x))) {
        // add new variables to the context
        this.context.push({ name: dd, values: [undefined, null], selected: [] })
      }
      for (const idx of old) {
        // remove context variables without values
        this.context.splice(idx, 1)
      }
    },
    checkTreeValid(t, d = 0) {
      if (t && t.type) {
        switch (t.type) {
          case 'ConditionalExpression':
            return (
              this.checkTreeValid(t.test, d + 1) &&
              this.checkTreeValid(t.consequent, d + 1) &&
              this.checkTreeValid(t.alternate, d + 1)
            )
          case 'BinaryExpression':
            return this.checkTreeValid(t.left, d + 1) && this.checkTreeValid(t.right, d + 1)
          case 'UnaryExpression':
            return this.checkTreeValid(t.argument, d + 1)
          case 'ArrayExpression':
            return t.elements.every((el) => this.checkTreeValid(el, d + 1))
          case 'Literal':
            return true
          case 'Identifier':
            return true
          case 'Compound':
            return true
          default:
            return false
        }
      } else {
        return d == 0
      }
    }
  },
  watch: {
    estree() {
      this.updateVariables()
    }
  }
}
</script>
