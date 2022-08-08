<template>
  <div class="column-detail-page w-75 mx-auto">
    <div class="column-info row mb-4 border-bottom pb-4 align-items-center" v-if="column">
      <!--      {{ column }}-->
      <div class="col-3 text-center">
        <img :src="column.avatar && column.avatar.fitUrl" :alt="column.title" class="rounded-circle border w-100">
      </div>
      <div class="col-9">
        <h4>{{ column.title }}</h4>
        <p class="text-muted">{{ column.description }}</p>
      </div>
    </div>
    <post-list :list="list"></post-list>
    <hr>
<!--    {{ isLastPage }}-->
<!--    <hr>-->
    <button
      v-if="!isLastPage"
      @click="loadMorePage"
      class="btn btn-outline-primary mt-2 mb-5 mx-auto btn-block w-25 load-more d-flex justify-content-center"
    >加载更多
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import PostList from '@/components/PostList.vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '@/store'
import { computed, onMounted, reactive, watch } from 'vue'
import { generateFitUrl } from '@/helper'
import useLoadMore from '@/hooks/useLoadMore'

const store = useStore<GlobalDataProps>()
const route = useRoute()
const currentId = route.params.id
onMounted(() => {
  store.dispatch('fetchColumn', currentId)
  store.dispatch('fetchPosts', {
    columnId: currentId,
    pageSize: 3
  })
})
const column = computed(() => {
  const selectColumn = store.getters.getColumnById(currentId)
  if (selectColumn) {
    generateFitUrl(selectColumn, 100, 100)
  }
  return selectColumn
})
const loaded = reactive({
  currentPage: 0,
  total: 0
})

const params = {
  columnId: String(currentId),
  pageSize: 3,
  currentPage: loaded.currentPage ? loaded.currentPage + 1 : 2
}

const total = computed(() => loaded.total)
const list = computed(() => store.getters.getPostsByCid(currentId))
const {
  loadMorePage,
  isLastPage
} = useLoadMore(
  'fetchPosts',
  total,
  params
)
watch(store.state.posts.loadedColumns, () => {
  console.log('store.state.posts.loadedColumns', store.state.posts.loadedColumns)
  const {
    currentPage,
    total
  } = store.getters.getLoadedPost(currentId)
  loaded.currentPage = currentPage
  loaded.total = total
})
</script>

<script lang="ts">
export default {
  name: 'ColumnDetail'
}
</script>
<style>

</style>
