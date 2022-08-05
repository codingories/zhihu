<template>
  <nav class="navbar navbar-dark bg-primary justify-content-between mb-4 px-4">
    <router-link class="navbar-brand" to="/">希望专栏</router-link>
    <ul v-if="!user.isLogin" class="list-inline mb-0">
      <li class="list-inline-item">
        <router-link :to="'/login'" class="btn btn-outline-light my-2">登陆</router-link>
      </li>
      <li class="list-inline-item">
        <router-link :to="'/signup'" class="btn btn-outline-light my-2">注册</router-link>
      </li>
    </ul>
    <ul v-else class="list-inline mb-0">
      <li class="list-inline-item">
        <drop-down :title="`你好 ${user.nickName}`">
          <dropdown-item>
            <router-link :to="'/create'" class="dropdown-item">新建文章</router-link>
          </dropdown-item>
          <dropdown-item>
            <router-link :to="`/column/${user.column}`" class="dropdown-item">我的专栏</router-link>
          </dropdown-item>

          <dropdown-item disabled><a class="dropdown-item" href="#">编辑资料</a></dropdown-item>
          <dropdown-item><a class="dropdown-item" href="#">退出登录</a></dropdown-item>
        </drop-down>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts" setup>
import { PropType, defineProps } from 'vue'
import DropDown from '@/components/Dropdown.vue'
import DropdownItem from '@/components/DropdownItem.vue'
import { UserProps } from '@/types/commonTypes'

defineProps({
  user: {
    type: Object as PropType<UserProps>,
    required: true
  }
})

// export default defineComponent({
//   name: 'GlobalHeader',
//   components: { DropdownItem, DropDown },
//   props: {
//     user: {
//       type: Object as PropType<UserProps>,
//       required: true
//     }
//   }
// })
</script>
