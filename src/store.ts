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

export interface GlobalDataProps {
  error: GlobalErrorProps;
  token: string;
  loading: boolean;
  columns: { data: ListProps<ColumnProps>, isLoaded: boolean };
  posts: { data: ListProps<PostProps>, loadedColumns: Array<string> };
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
      isLoaded: false
    },
    posts: {
      data: {},
      loadedColumns: []
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
      state.columns.data = arrToObj(rawData.data.list)
      state.columns.isLoaded = true
    },
    fetchColumn (state, rawData) {
      state.columns.data[rawData.data._id] = rawData.data
    },
    fetchPosts (state, {
      data: rawData,
      extraData: columnId
    }) {
      state.posts.data = { ...state.posts.data, ...arrToObj(rawData.data.list) }
      state.posts.loadedColumns.push(columnId)
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
    }) {
      if (!state.columns.isLoaded) {
        return asyncAndCommit('/columns?currentPage=1&pageSize=5', 'fetchColumns', commit)
      }
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
    }, cid) {
      if (!state.posts.loadedColumns.includes(cid)) {
        return asyncAndCommit(`/columns/${cid}/posts`, 'fetchPosts', commit, { method: 'get' }, cid)
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
    fetchPost ({ state, commit }, id) {
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
      console.log('state.columns', state.columns)
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
    }
  }
})

export default store
