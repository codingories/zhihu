<template>
  <div class="login-page mx-auto p-3 w-330">
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <validate-input
          :rules="emailRules" v-model="emailVal"
          placeholder="请输入邮箱地址"
          type="text"
          ref="inputRef"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">昵称</label>
        <validate-input
          type="password"
          placeholder="请输入昵称"
          :rules="nameRules"
          v-model="passwordVal"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">密码</label>
        <validate-input
          type="password"
          placeholder="请输入密码"
          :rules="passwordRules"
          v-model="passwordVal"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">重复密码</label>
        <validate-input
          type="password"
          placeholder="请再次输入密码"
          :rules="repeatPasswordRules"
          v-model="passwordVal"
        />
      </div>
      <template #submit>
        <button type="submit" class="btn btn-primary btn-block btn-large">注册</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import ValidateInput from '../components/ValidateInput.vue'
import ValidateForm from '../components/ValidateForm.vue'
import { RulesProp } from '@/types/commonTypes'
import { useStore } from 'vuex'
import createMessage from '@/components/createMessage'

const store = useStore()

const formData = reactive({
  email: '',
  nickName: '',
  password: '',
  repeatPassword: ''
})

const emailVal = ref('')
const router = useRouter()
const emailRules: RulesProp = [
  {
    type: 'required',
    message: '电子邮箱地址不能为空'
  },
  {
    type: 'email',
    message: '请输入正确的电子邮箱格式'
  }
]
const nameRules: RulesProp = [
  {
    type: 'required',
    message: '昵称不能为空'
  }
]
const repeatPasswordRules: RulesProp = [
  {
    type: 'required',
    message: '重复密码不能为空'
  },
  {
    type: 'custom',
    validator: () => {
      return formData.password === formData.repeatPassword
    },
    message: '密码不相同'
  }
]
const passwordRules: RulesProp = [
  {
    type: 'required',
    message: '密码不能为空'
  }
]
const passwordVal = ref('')

const onFormSubmit = (result: boolean) => {
  if (result) {
    const payload = {
      email: emailVal.value,
      password: passwordVal.value
    }
    store.dispatch('loginAndFetch', payload).then(
      data => {
        createMessage('登出成功 2秒后跳转首页', 'success')
        setTimeout(() => {
          router.push('/')
        }, 2000)
      }
    ).catch(e => {
      console.log('fuck', e)
    })
  }
}
</script>
<script lang="ts">
export default {
  name: 'myLogin'
}
</script>
