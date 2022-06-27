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

<script lang="ts" >
import { defineComponent, defineEmits, defineProps, PropType } from 'vue'
// import { RulesProp } from '@/components/ValidateInput.vue'

export default defineComponent({
  name: 'ValidateForm',
  emits: ['form-submit'],
  setup (props, context) {
    const submitForm = () => {
      // 拿到内部验证并且出发事件，现mock
      context.emit('form-submit', true)
    }
    return {
      submitForm
    }
  },
  mounted() {
    this.$on('item-created', () => {

    })
  }
})

// const emit = defineEmits(['form-submit'])
// const submitForm = () => {
//   emit('form-submit', true)
// }
</script>

<style>

</style>
