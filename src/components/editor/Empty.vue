<template>
  <!-- present a menu of expression templates -->
  <v-row>
    <v-template @click="value={type: 'ConditionalExpression', test: {}, consequent: {}, alternate: {}}">IF/THEN/ELSE</v-template>
    <v-template @click="value={type: 'BinaryExpression', left: {}, right: {}, operator:'<'}">&lt;</v-template>
    <v-template @click="value={type: 'BinaryExpression', left: {}, right: {}, operator:'<='}">&le;</v-template>
    <v-template @click="value={type: 'BinaryExpression', left: {}, right: {}, operator:'=='}">=</v-template>
    <v-template @click="value={type: 'BinaryExpression', left: {}, right: {}, operator:'>='}">&ge;</v-template>
    <v-template @click="value={type: 'BinaryExpression', left: {}, right: {}, operator:'>'}">&gt;</v-template>
    <v-template @click="value={type: 'BinaryExpression', left: {}, right: {}, operator:'&&'}">AND</v-template>
    <v-template @click="value={type: 'BinaryExpression', left: {}, right: {}, operator:'||'}">OR</v-template>
    <v-template @click="value={type: 'BinaryExpression', argument: {}, operator:'!'}">NOT</v-template>
  </v-row>
  <!-- and a text box for entering variables and constants -->
  <div>
    <input type="text" class="form-control mb-1" v-on:keyup.enter="enterValue"/>
  </div>  
</template>

<script>
import { parse } from 'jse-eval';
import Shared from './shared';
import Template from './Template.vue';

export default {
  name: 'v-empty',
  mixins: [ Shared ],
  components: {
    'v-template': Template
  },
  methods: {
    enterValue(evt) {
      if (this.att) {
        this.$emit('update-sub', {att: this.att, value: parse(evt.target.value)})
      } else {
        this.value = parse(evt.target.value);
      }
    },    
  }
}
</script>