import { Commit, createStore } from 'vuex'
import axios, { AxiosRequestConfig } from 'axios'
import { ColumnProps, PostProps, UserProps } from '@/types/commonTypes'
import { arrToObj, objToArr } from '@/helper'

axios.defaults.baseURL = '/api'

export interface GlobalErrorProps {
  status: boolean;
  message?: string;
}

interface ListProps<P> {
  [id: string]: P;
}

export interface LoadedPostProps {
  columnId?: string;
  currentPage?: number;
  total?: number;
}

export interface GlobalDataProps {
  error: GlobalErrorProps;
  token: string;
  loading: boolean;
  columns: { data: ListProps<ColumnProps>, currentPage: number, total: number };
  posts: { data: ListProps<PostProps>, loadedColumns: ListProps<LoadedPostProps>; };
  user: UserProps;
}

const asyncAndCommit = async (url: string, mutationName: string, commit: Commit,
  config: AxiosRequestConfig = { method: 'get' }, extraData?: any) => {
  const { data } = await axios(url, config)
  if (extraData) {
    commit(mutationName, {
      data,
      extraData
    })
  } else {
    commit(mutationName, data)
  }
  return data
}

const store = createStore<GlobalDataProps>({
  state: {
    error: { status: false },
    token: localStorage.getItem('token') || '',
    loading: false,
    columns: {
      data: {},
      currentPage: 0,
      total: 0
    },
    posts: {
      data: {},
      loadedColumns: {}
    },
    user: {
      isLogin: false
    }
  },
  mutations: {
    createPost (state, newPost) {
      state.posts.data[newPost._id] = newPost
    },
    fetchColumns (state, rawData) {
      const { data } = state.columns
      const {
        list,
        count,
        currentPage
      } = rawData.data
      state.columns = {
        data: { ...data, ...arrToObj(list) },
        total: count,
        currentPage: currentPage * 1
      }
      // state.columns.data = arrToObj(rawData.data.list)
      // state.columns.isLoaded = true
    },
    fetchColumn (state, rawData) {
      state.columns.data[rawData.data._id] = rawData.data
    },
    // fetchPosts (state, {
    //   data: rawData,
    //   extraData: columnId
    // }) {
    //   state.posts.data = { ...state.posts.data, ...arrToObj(rawData.data.list) }
    //   state.posts.loadedColumns.push(columnId)
    // },
    fetchPosts (state, {
      data: rawData,
      extraData: columnId
    }) {
      const { data } = state.posts
      const {
        list,
        count,
        currentPage
      } = rawData.data
      state.posts.data = { ...data, ...arrToObj(list) }
      state.posts.loadedColumns[columnId] = {
        columnId: columnId,
        total: count,
        currentPage: currentPage * 1
      }
    },
    fetchPost (state, rawData) {
      state.posts.data[rawData.data._id] = rawData.data
    },
    deletePost (state, { data }) {
      delete state.posts.data[data._id]
    },
    setLoading (state, status) {
      state.loading = status
    },
    setError (state, e: GlobalErrorProps) {
      state.error = e
    },
    login (state, rawData) {
      const { token } = rawData.data
      state.token = token
      localStorage.setItem('token', token)
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    },

    logout (state) {
      state.token = ''
      localStorage.removeItem('token')
      axios.defaults.headers.common.Authorization = ''
    },
    fetchCurrentUser (state, rawData) {
      state.user = { isLogin: true, ...rawData.data }
    },
    updatePost (state, { data }) {
      state.posts.data[data._id] = data
    }
  },
  actions: {
    fetchColumns ({
      state,
      commit
    }, params = {}) {
      const {
        currentPage = 1,
        pageSize = 6
      } = params
      if (state.columns.currentPage < currentPage) {
        return asyncAndCommit(`/columns?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchColumns', commit)
      }
      // if (!state.columns.isLoaded) {
      //   return asyncAndCommit('/columns?currentPage=1&pageSize=5', 'fetchColumns', commit)
      // }
    },
    async fetchColumn ({
      state,
      commit
    }, cid) {
      if (!state.columns.data[cid]) {
        return asyncAndCommit(`/columns/${cid}`, 'fetchColumn', commit)
      }
    },
    async fetchPosts ({
      state,
      commit
    }, params = {}) {
      const {
        columnId,
        currentPage = 1,
        pageSize = 3
      } = params
      const loadedPost = state.posts.loadedColumns[columnId]
      // 如果loadedPost存在 不为 undefined
      if (!loadedPost) {
        return asyncAndCommit(`/columns/${columnId}/posts?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchPosts', commit, { method: 'get' }, columnId)
      } else {
        const loadedPostCurrentPage = loadedPost.currentPage || 0
        if (loadedPostCurrentPage < currentPage) {
          return asyncAndCommit(`/columns/${columnId}/posts?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchPosts', commit, { method: 'get' }, columnId)
        }
      }
    },
    fetchCurrentUser ({ commit }) {
      return asyncAndCommit('/user/current', 'fetchCurrentUser', commit)
    },
    login ({ commit }, payload) {
      return asyncAndCommit('/user/login', 'login', commit, {
        method: 'post',
        data: payload
      })
    },
    fetchPost ({
      state,
      commit
    }, id) {
      const currentPost = state.posts.data[id]
      // 加上取过id但是没content的情况也要请求
      if (!currentPost || !currentPost.content) {
        return asyncAndCommit(`/posts/${id}`, 'fetchPost', commit)
      } else {
        return Promise.resolve({ data: currentPost })
      }
    },
    updatePost ({ commit }, {
      id,
      payload
    }) {
      return asyncAndCommit(`/posts/${id}`, 'updatePost', commit, {
        method: 'patch',
        data: payload
      })
    },
    loginAndFetch ({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser')
      })
    },
    createPost ({ commit }, payload) {
      return asyncAndCommit('/posts', 'createPost', commit, {
        method: 'post',
        data: payload
      })
    },
    deletePost ({ commit }, id) {
      return asyncAndCommit(`/posts/${id}`, 'deletePost', commit, {
        method: 'delete'
      })
    }
  },
  getters: {
    getColumns: (state) => {
      return objToArr(state.columns.data)
    },
    getColumnById: (state) => (id: string) => {
      return state.columns.data[id]
    },
    getPostsByCid: (state) => (cid: string) => {
      return objToArr(state.posts.data).filter(post => post.column === cid)
    },
    getCurrentPost: (state) => (id: string) => {
      return state.posts.data[id]
    },
    // 根据columnId 获得已加载的记录
    getLoadedPost: (state) => (id: string) => {
      return state.posts.loadedColumns[id]
    }
  }
})

export default store
