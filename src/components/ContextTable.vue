<docs>
Provides an editable list of context variables and their associated test values.

TODO: separate out the modal component?
</docs>

<template>
  <div class="fs-4 mt-2" :class="{'opacity-50': disabled}">Context</div>
  <table class="table" :class="{'opacity-50': disabled}">
    <thead>
      <tr>
        <th>variable</th>
        <th>value(s)</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="dd in context"
        v-bind:key="dd"
        :class="{
          'text-muted text-decoration-line-through': !variables.includes(
            dd.name
          ),
        }"
      >
        <td @click="openModal(dd)" class="clickable">{{ dd.name }}</td>
        <td>
          <span 
            class="badge rounded-pill me-2 clickable"
            :class="{
              'text-bg-info': (dd.selected && dd.selected.length==0),
              'text-bg-dark': (dd.selected && dd.selected.length>0 && dd.selected.includes(value)),
              'text-bg-light': (dd.selected && dd.selected.length>0 && !dd.selected.includes(value))
            }"
            v-for="value of dd.values"
            @click="$emit('toggle-value', {name: dd.name, value: value})">
            {{ renderValue(value) }}
          </span>
          <button
            v-if="!variables.includes(dd.name)"
            type="button"
            @click="removeVar(dd)"
            class="btn btn-light btn-sm float-end"
          >
            &times;
          </button>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="modal" tabindex="-1" ref="variableModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit variable: {{ current.name }}</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            :disabled="!emptyValue"
          ></button>
        </div>
        <div class="modal-body">
          <table class="table">
            <tbody>
              <tr
                v-for="(value, idx) in current.values"
                v-bind:key="idx"
                :class="{ 'table-active': idx == modalState.valueIdx }"
              >
                <td>
                  <span @click="selectContextValue(idx)" class="clickable">{{
                    renderValue(current.values[idx])
                  }}</span>
                  <button
                    v-if="value != null"
                    type="button"
                    @click="removeValue(idx)"
                    class="btn btn-light btn-sm float-end"
                  >
                    &times;
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <input
            type="text"
            :value="modalState.value"
            v-on:keyup.enter="enterUpdateContextValue"
            v-on:keyup="updateValue"
            class="my-2 form-control"
            ref="editedValue"
          />
          <div v-if="!modalState.valid" class="text-danger small">
            Invalid. Accepted values include false, true, numbers, "strings" and JSON objects.
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            @click="cancelUpdate"
            :disabled="emptyValue"
          >
            Cancel
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="buttonUpdateContextValue"
            :disabled="emptyValue"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap";
import Shared from "./shared";

let varModal = null;

export default {
  props: {
    context: {
      type: Array,
      required: true,
    },
    variables: {
      type: Array,
      required: true,
    },
    disabled: {
      type: Boolean
    }
  },
  mixins: [Shared],
  emits: ["update", "toggle-value"],
  mounted() {
    varModal = new Modal(this.$refs.variableModal);
  },
  data() {
    return {
      current: -1,
      modalState: {
        variableIdx: null,
        valueIdx: -1,
        valid: true,
        value: null,
      },
    };
  },
  computed: {
    emptyValue() {
      return (
        this.modalState.value == null ||
        (this.modalState.value.trim && this.modalState.value.trim().length == 0)
      );
    },
  },
  methods: {
    renderValues(vals) {
      return vals.map((val) => this.renderValue(val)).join(", ");
    },
    removeVar(dd) {
      const clone = [...this.context];
      clone.splice(this.context.indexOf(dd), 1);
      this.$emit("update", clone);
    },
    openModal(dd) {
      this.current = dd;
      this.modalState = {
        variableIdx: this.context.indexOf(dd),
        valueIdx: -1,
        valid: true,
      };
      varModal.show();
    },
    selectContextValue(idx) {
      if (this.modalState.valueIdx == idx) {
        this.modalState.valueIdx = -1;
        this.modalState.value = null;
      } else {
        this.modalState.valueIdx = idx;
        this.modalState.value = this.renderValue(
          this.context[this.modalState.variableIdx].values[idx]
        );
      }
    },
    enterUpdateContextValue(evt) {
      this.updateContextValue(evt.target.value);
    },
    buttonUpdateContextValue() {
      this.updateContextValue(this.modalState.value);
    },
    updateContextValue(rawval) {
      try {
        const value = JSON.parse(rawval);
        this.modalState.valid = true;
        const clone = [...this.context];
        if (this.modalState.valueIdx == -1) {
          clone[this.modalState.variableIdx].values.push(value);
        } else {
          clone[this.modalState.variableIdx].values[this.modalState.valueIdx] =
            value;
        }
        this.$emit("update", clone);
        this.modalState.valueIdx = -1;
        this.$refs["editedValue"].value = null; // needed for enter update
        this.modalState.value = null; // needed for button update
      } catch (e) {
        this.modalState.valid = false;
        console.info("invalid variable value: ", rawval, "\n", e.message);
      }
    },
    removeValue(idx) {
      const clone = [...this.context];
      clone[this.modalState.variableIdx].values.splice(idx, 1);
      this.$emit("update", clone);
      if (this.modalState.valueIdx == idx) {
        this.modalState.valueIdx = -1;
        this.modalState.valid = true;
      }
    },
    updateValue(evt) {
      this.modalState.value = evt.target.value;
    },
    cancelUpdate() {
      this.modalState.valueIdx = -1;
      this.modalState.value = null;
    },
  },
};
</script>

<style scoped>
.clickable {
  cursor: pointer;
}
</style>
