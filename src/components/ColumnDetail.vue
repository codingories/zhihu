<template>
  <h1>
    ColumnDetail
    <pre>{{route}}</pre>
  </h1>

</template>

<script lang="ts" setup>
// 为了得到路由信息，我们需要使用useRoute

import { useRoute } from 'vue-router'

const route = useRoute()
</script>
<script lang="ts">
export default {
  name: 'ColumnDetail'
}
</script>
<style>

</style>
