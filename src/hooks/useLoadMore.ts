import { computed, ComputedRef, ref } from 'vue'
import { useStore } from 'vuex'

interface LoadParams {
  currentPage: number;
  pageSize: number;
  columnId?: string;
}

const useLoadMore = (actionName: string, total: ComputedRef<number>, params: LoadParams = {
  currentPage: 2,
  pageSize: 5
}) => {
  console.log('LoadParams fuck', params)
  const store = useStore()
  const currentPage = ref(params.currentPage)
  const { currentPage: current, pageSize, columnId } = params
  const requestParams = computed(() => ({
    currentPage: currentPage.value,
    pageSize: params.pageSize,
    columnId: columnId
  }))
  const loadMorePage = () => {
    console.log('fuck actionName', actionName, requestParams.value)
    store.dispatch(actionName, requestParams.value).then(() => {
      currentPage.value++
    })
  }
  const isLastPage = computed(() => {
    console.log('total.value', total.value)
    console.log('params.pageSize', params.pageSize)
    return Math.ceil(total.value / params.pageSize) < currentPage.value
  })
  return {
    loadMorePage,
    isLastPage,
    currentPage
  }
}

export default useLoadMore
