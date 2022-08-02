<template>
<!--  {{ formData }}-->
<!--  <hr>-->
<!--  {{ email }}-->
  <div class="login-page mx-auto p-3 w-330">
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <validate-input
          :rules="emailRules" v-model="email"
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
          v-model="nickName"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">密码</label>
        <validate-input
          type="password"
          placeholder="请输入密码"
          :rules="passwordRules"
          v-model="password"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">重复密码</label>
        <validate-input
          type="password"
          placeholder="请再次输入密码"
          :rules="repeatPasswordRules"
          v-model="repeatPassword"
        />
      </div>
      <template #submit>
        <button type="submit" class="btn btn-primary btn-block btn-large">注册</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import ValidateInput from '../components/ValidateInput.vue'
import ValidateForm from '../components/ValidateForm.vue'
import { RulesProp } from '@/types/commonTypes'
import createMessage from '@/components/createMessage'
import axios from 'axios'

const formData = reactive({
  email: '',
  nickName: '',
  password: '',
  repeatPassword: ''
})

const {
  email,
  nickName,
  password,
  repeatPassword
} = toRefs(formData)

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

const onFormSubmit = (result: boolean) => {
  if (result) {
    const payload = {
      email: email.value,
      password: password.value,
      nickName: nickName.value
    }
    // 注册流程对全局没有任何改变，因此没有新建action。
    axios.post('/users/', payload).then(data => {
      createMessage('注册成功 2秒后跳转首页', 'success')
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }).catch(e => {
      console.log(e)
      createMessage(e, 'error')
    })
  }
}
</script>
<script lang="ts">
export default {
  name: 'myLogin'
}
</script>
