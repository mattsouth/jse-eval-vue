<template>
  <v-row @delete="deleteRow" @delete-sub="deleteSub" @update-sub="updateSub">
    {{ value.raw }}
  </v-row>
</template>

<script>
import Shared from './shared'

export default {
  name: 'v-literal',
  mixins: [Shared]
}
</script>
