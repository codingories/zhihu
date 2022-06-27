<template>
  <div class="validate-input-container pb-3">
    <!--    {{ inputRef }}-->
    <!--    v-model="inputRef.val"-->

    <input
      type="text" class="form-control"
      :class="{'is-invalid' : inputRef.error}"
      @blur="validateInput"
      :value="inputRef.val"
      @input="updateValue"
      v-bind="$attrs"
    >
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
import { defineProps, PropType, reactive, defineEmits, ref, defineExpose, onMounted } from 'vue'
import { emitter } from '@/components/ValidateForm.vue'
// $attrs

const emailReg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/

interface RuleProp {
  type: 'required' | 'email';
  message: string;
}

export type RulesProp = RuleProp[];

const props = defineProps({
  rules: Array as PropType<RulesProp>,
  // 第一步加上modelValue
  modelValue: String
})

const inputRef = reactive({
  val: props.modelValue || '',
  error: false,
  message: ''
})

const emit = defineEmits(['update:modelValue'])

const updateValue = (e: KeyboardEvent) => {
  console.log('(e.target as HTMLElement).nodeValue', (e.target as HTMLInputElement).value)
  const targetValue = (e.target as HTMLInputElement).value
  inputRef.val = targetValue
  emit('update:modelValue', targetValue)
}

// inheritAttrs: false
//
onMounted(() => {
  emitter.emit('form-item-created', inputRef.val)
})

// inheritAttrs
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
