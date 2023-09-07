<template>
  <v-row 
    v-if="value.type == 'Identifier'"
    @delete="deleteRow"
    @delete-sub="deleteSub"
    @update-sub="updateSub" > 
    <template v-if="value.name !== 'undefined'">
      <span class="badge bg-info"><em>{{ value.name }}</em></span>
    </template>
    <span v-else><em>{{ value.name }}</em></span>
  </v-row>    
</template>

<script>
  import Shared from './shared';
  
  export default {
    name: 'v-conditional',
    mixins: [ Shared ],
    emits: [ 'update-sub' ],
    methods: {
      mapOperator(op) {
        return op == "||" ? "OR" : (op == "&&" ? "AND" : (op == "==" ? "=" : (op == ">=" ? "≥" : (op == "<=" ? "≤" : op))));
      },
    }
  }
</script>