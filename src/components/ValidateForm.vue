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
// import mitt from 'mitt'
import { defineComponent, defineEmits, defineProps, onUnmounted, PropType } from 'vue'
import { emitter } from '@/mitt/mitter'
// import { RulesProp } from '@/components/ValidateInput.vue'

// export const emitter = mitt()
// import emitter from "@mitt/mitter.ts"

export default defineComponent({
  name: 'ValidateForm',
  emits: ['form-submit'],
  setup (props, context) {
    const callback = (test?: string) => {
      console.log('test', test)
    }
    emitter.on('form-item-created', callback)
    onUnmounted(() => {
      emitter.off('form-item-created', callback)
    })
    const submitForm = () => {
      // 拿到内部验证并且出发事件，现mock
      context.emit('form-submit', true)
    }
    return {
      submitForm
    }
  }
  // mounted() {
  //   this.$on('item-created', () => {
  //
  //   })
  // }
})

// const emit = defineEmits(['form-submit'])
// const submitForm = () => {
//   emit('form-submit', true)
// }
</script>

<style>

</style>
