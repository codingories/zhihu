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
import { defineComponent, defineEmits, defineProps, PropType, onUnmounted } from 'vue'
// 新建一个监听器
import mitt from 'mitt'

// type ValidateFunc = (test: string) => void
// type Emits<EventType extends string | symbol, T> = {
//   on (type: EventType, handler: (arg: T) => void): void
//   off (type: EventType, handler: (arg: T) => void): void
//   emit (type: EventType, arg: T): void
// }
// type Emitter = Emits<'form-item-created', ValidateFunc>

// import { RulesProp } from '@/components/ValidateInput.vue'
// :Emitter
export const emitter = mitt()
export default defineComponent({
  name: 'ValidateForm',
  emits: ['form-submit'],
  setup (props, context) {
    const submitForm = () => {
      // 拿到内部验证并且出发事件，现mock
      context.emit('form-submit', true)
    }
    const callback = (test?: string) => {
      console.log('test', test)
    }
    emitter.on('form-item-created', callback)
    onUnmounted(() => {
      emitter.off('form-item-created', callback)
    })
    return {
      submitForm
    }
  },
  mounted () {

    // this.$on('item-created', () => {
    //
    // })
  }
})

// const emit = defineEmits(['form-submit'])
// const submitForm = () => {
//   emit('form-submit', true)
// }
</script>

<style>

</style>
