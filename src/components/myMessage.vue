<template>
  <teleport to="#message">
    <div class="alert message-info fixed-top w-50 mx-auto d-flex justify-content-between mt-2"
         :class="classObject" v-if="isVisible">
      <span>{{ message }}</span>
      <button type="button" class="btn-close" aria-label="Close" @click.prevent="hide"></button>
    </div>
  </teleport>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, onUnmounted, PropType, ref } from 'vue'
import useDOMCreate from '@/hooks/useDOMCreate'

useDOMCreate('message')

export type MessageType = 'success' | 'error' | 'default'
const props = defineProps({
  message: String,
  type: {
    type: String as PropType<MessageType>,
    default: 'default'
  }
})

const isVisible = ref(true)
const classObject = {
  'alert-success': props.type === 'success',
  'alert-danger': props.type === 'error',
  'alert-primary': props.type === 'default'
}
// 添加自定义事件,消失的时候做一些事情
const emit = defineEmits(['close-message'])

// 创建方法
const hide = () => {
  isVisible.value = false
  emit('close-message', true)
}

</script>

<style>

</style>
