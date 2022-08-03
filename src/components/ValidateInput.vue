<template>
  <div class="validate-input-container pb-3">
    <input
      v-if="tag !=='textarea'"
      type="text" class="form-control"
      :class="{'is-invalid' : inputRef.error}"
      @blur="validateInput"
      v-model="inputRef.val"
      v-bind="$attrs"
    >
    <textarea
      v-else
      type="text" class="form-control"
      :class="{'is-invalid' : inputRef.error}"
      @blur="validateInput"
      v-model="inputRef.val"
      v-bind="$attrs"
    ></textarea>
    <span v-if="inputRef.error" class="invalid-feedback">{{ inputRef.message }}</span>
  </div>

</template>
<!--<script>-->
<!--import { defineComponent } from 'vue'-->

<!--export default defineComponent({-->
<!--  inheritAttrs: false-->
<!--})-->
<!--</script>-->
<script lang="ts" setup>
import { defineProps, PropType, reactive, defineEmits, defineExpose, onMounted, computed } from 'vue'
import { emitter } from '@/mitt/mitter'
import { RulesProp } from '@/types/commonTypes'

const emailReg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/

type TagType = 'input' | 'textarea'
const props = defineProps({
  rules: Array as PropType<RulesProp>,
  // 第一步加上modelValue
  modelValue: String,
  tag: {
    type: String as PropType<TagType>,
    default: 'input'
  }
})

const inputRef = reactive({
  val: computed({
    get: () => props.modelValue || '',
    set: val => {
      emit('update:modelValue', val)
    }
  }),
  error: false,
  message: ''
})

const emit = defineEmits(['update:modelValue'])

// inheritAttrs: false
//
onMounted(() => {
  emitter.emit('form-item-created', validateInput)
})

const validateInput = () => {
  if (props.rules) {
    const allPassed = props.rules.every(rule => {
      let passed = true
      inputRef.message = rule.message
      switch (rule.type) {
        case 'required':
          passed = (inputRef.val.trim() !== '')
          break
        case 'email':
          passed = emailReg.test(inputRef.val)
          break
        case 'custom':
          passed = rule.validator ? rule.validator() : true
          break
        default:
          break
      }
      return passed
    })
    inputRef.error = !allPassed
    return allPassed
  }
  return true
}
// const sonName = ref("JackSon");
defineExpose({
  validateInput
})
</script>

<!--<script>-->
<!--import { defineComponent } from 'vue'-->

<!--export default defineComponent({-->
<!--  inheritAttrs: false-->
<!--})-->
<!--</script>-->

<script lang="ts">
// 普通 <script>, 在模块范围下执行(只执行一次)
export default {
  inheritAttrs: false
}
</script>

<style>

</style>
