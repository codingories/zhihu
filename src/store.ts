import { createStore } from 'vuex'
// testData
import { PostProps, testPosts } from '@/testData'
import axios from 'axios'

interface UserProps {
  isLogin: boolean;
  name?: string;
  id?: number;
  columnId?: number;
}

interface ImageProps {
  _id?: string;
  url?: string;
}

export interface ColumnProps {
  _id: string
  title: string
  avatar?: ImageProps
  description: string
}

export interface GlobalDataProps {
  columns: ColumnProps[],
  posts: PostProps[]
  user: UserProps
}

const store = createStore<GlobalDataProps>({
  state: {
    columns: [],
    posts: testPosts,
    user: {
      isLogin: true,
      name: 'Ories',
      columnId: 1
    }
  },
  mutations: {
    login (state) {
      state.user = {
        ...state.user,
        isLogin: true,
        name: 'Ories'
      }
    },
    createPost (state, newPost) {
      state.posts.push(newPost)
    },
    fetchColumns (state, rawData) {
      console.log('rawData', rawData)
      state.columns = rawData.data.list
    }
  },
  actions: {
    // actions接收一个和store拥有相同属性和方法的context对象
    fetchColumns (context) {
      axios.get('/api/columns?currentPage=1&pageSize=5').then(res => {
        context.commit('fetchColumns', res.data)
      })
    }
  },
  getters: {
    biggerColumnsLen (state) {
      return state.columns.filter(c => +c._id > 2).length
    },
    getColumnById: (state) => (id: string) => {
      return state.columns.find(c => c._id === id)
    },
    getPostsByCid: (state) => (cid: number) => {
      return state.posts.filter(post => post.columnId === cid)
    }
  }
})

export default store
