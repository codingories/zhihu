<template>
  <div class="user-profile-component">
    <div class="d-flex align-items-center">
      <img :src="fitUrl" :alt="user.nickName" class="rounded-circle img-thumbnail">
      <div class="detail ml-2">
        <h6 class="d-block mb-0">{{ user.nickName }}</h6>
        <span class="text-truncate text-muted d-block">{{ user.description }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, PropType, defineProps } from 'vue'
import { UserProps } from '@/types/commonTypes'

const props = defineProps({
  user: {
    type: Object as PropType<UserProps>,
    required: true
  }
})

const fitUrl = computed(() => {
  let url = ''
  if (props.user.avatar && props.user.avatar.url) {
    url = props.user.avatar.url
  } else {
    url = require('@/assets/avatar.jpg')
  }
  return url
})
</script>

<style scoped>
.user-profile-component img {
  width: 50px;
  height: 50px;
  /* border: 1px solid #ccc;
  border-radius: 50px; */
}
</style>
