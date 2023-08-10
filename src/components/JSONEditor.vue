<docs>
A version of the ace-editor that edits a Json Logic object.
</docs>

<template>
  <v-ace-editor
    v-model:value="text"
    @init="handleInit"
    lang="json"
    theme="textmate"
    :options="{ tabSize: 2, useWorker: true }"
    style="height: 300px; border-radius: .25rem; border: 1px solid #ced4da;"
  />
  <div class="text-secondary small mb-2">JsonLogic</div>
</template>

<script>
import { VAceEditor } from "vue3-ace-editor";
import ace from "ace-builds";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-textmate";
import workerJsonUrl from "file-loader?esModule=false!ace-builds/src-noconflict/worker-json.js";

ace.config.setModuleUrl("ace/mode/json_worker", workerJsonUrl);

export default {
  props: {
    value: Object,
  },
  data: function () {
    return {
      jsonValid: true,
    };
  },
  components: {
    VAceEditor,
  },
  emits: ['update', 'valid'],
  computed: {
    text: {
      // JSON text for atom editor
      get: function () {
        return JSON.stringify(this.value, null, 2);
      },
      set: function (text) {
        if (text.length > 0) {
          let json;
          try {
            if (text !== this.text) {
              json = JSON.parse(text);
              this.jsonValid = true;
              this.$emit("update", json);
            }
          } catch (e) {
            // assumes exception caused by hand editing the JSON
            this.jsonValid = false;
          }
        }
      },
      jsonInvalid() {
          return !this.jsonValid;
      }
    },
    style() {
      return (
        "height: 300px; border: " +
        (this.jsonValid ? "grey" : "red") +
        " 1px dashed"
      );
    },
  },
  methods: {
      handleInit(editor) {
          const _this = this;
          editor.getSession().on("changeAnnotation", function() {
             const valid = (editor.getSession().getAnnotations()==0);
             if (valid != this.jsonValid) {
                 _this.$emit('valid', valid);
                 _this.jsonValid = valid;
             }
          });
      }
  }
};
</script>
