<template>
  <form class="validate-form-container">
    <slot name="default"></slot>
    <div class="submit-area" @click.prevent="submitForm">
      <slot name="submit">
        <button type="submit" class="btn btn-primary">提交</button>
      </slot>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from 'vue'
// 新建一个监听器
import { emitter } from '@/mitt/mitter'

export default defineComponent({
  name: 'ValidateForm',
  emits: ['form-submit'],
  setup (props, context) {
    type ValidateFunc = () => boolean

    let funcArr: ValidateFunc[] = []
    const submitForm = () => {
      // 拿到内部验证并且出发事件，现mock
      // every, some会提前停止循环，every出现一个false最终结果就是false
      // some是有一个是true就提前停止运行
      // const result = funcArr.every(func => func())
      const result = funcArr.map(func => func()).every(result => result)
      context.emit('form-submit', result)
    }
    const callback = (func?: ValidateFunc) => {
      if (func) {
        funcArr.push(func)
      }
    }
    emitter.on('form-item-created', callback)
    onUnmounted(() => {
      emitter.off('form-item-created', callback)
      funcArr = []
    })
    return {
      submitForm
    }
  }
})

// const emit = defineEmits(['form-submit'])
// const submitForm = () => {
//   emit('form-submit', true)
// }
</script>

<style>

</style>
