<template>
  <div id="app" class="container">
    <GlobalHeader :user="currentUser"></GlobalHeader>
    <router-view></router-view>
    <footer class="text-center py-4 text-secondary bg-light mt-6">
      <small>
        <ul class="list-inline mb-0">
          <li class="list-inline-item">© 2020 者也专栏</li>
          <li class="list-inline-item">课程</li>
          <li class="list-inline-item">文档</li>
          <li class="list-inline-item">联系</li>
          <li class="list-inline-item">更多</li>
        </ul>
      </small>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import ColumnList, { ColumnProps } from '@/components/ColumnList.vue'
import GlobalHeader from '@/components/GlobalHeader.vue'
// import ValidateInput from '@/components/ValidateInput.vue'
// import ValidateForm from '@/components/ValidateForm.vue'

const currentUser = {
  isLogin: true,
  name: 'Ories1',
  id: 1
}

const list: ColumnProps[] = [
  {
    id: 1,
    title: 'test1的专栏',
    description: '这是test1专栏',
    avatar: 'https://www.baidu.com/img/flexible/logo/pc/result@2.png'
  },
  {
    id: 2,
    title: 'test2的专栏',
    description: '这是test2专栏这是test2专栏这是test2专栏这是test2专栏这是test2专栏'
    // avatar: 'https://www.baidu.com/img/flexible/logo/pc/result@2.png'
  },
  {
    id: 3,
    title: 'test3的专栏',
    description: '这是test3专栏这是test3专栏这是test3专栏这是test3专栏这是test3专栏这是test3专栏这是test3专栏这是test3专栏这是test3专栏这是test3专栏这是test3专栏这是test3专栏',
    avatar: 'https://cn.vuejs.org/images/logo.svg'
  },
  {
    id: 4,
    title: 'test4的专栏',
    description: '这是test4专栏',
    avatar: 'https://www.baidu.com/img/flexible/logo/pc/result@2.png'
  }
]

const emailReg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/

export default defineComponent({
  name: 'App',
  components: {
    // ValidateForm,
    // ValidateInput,
    GlobalHeader
    // ColumnList
  },
  setup () {
    const inputRef = ref<any>(null)

    const emailVal = ref('')

    const emailRules = [
      {
        type: 'required',
        message: '电子邮箱地址不能为空'
      },
      {
        type: 'email',
        message: '请输入正确的电子邮箱格式'
      }]

    const passwordRules = [
      {
        type: 'required',
        message: '密码不能为空'
      }]

    const emailRef = reactive({
      val: '',
      error: false,
      message: ''
    })
    const validateEmail = () => {
      if (emailRef.val.trim() === '') {
        emailRef.error = true
        emailRef.message = 'can not be empty'
      } else if (!emailReg.test(emailRef.val)) {
        emailRef.error = true
        emailRef.message = 'should be valid email'
      }
    }
    const onFormSubmit = (result: boolean) => {
      console.log('result', inputRef.value.validateInput())
    }
    return {
      // list: list,
      currentUser: currentUser,
      emailRef,
      validateEmail,
      emailRules,
      emailVal,
      onFormSubmit,
      inputRef: inputRef,
      passwordRules
    }
  }

})

// const emailRef = reactive({
//   val: '',
//   error: false,
//   message: ''
// })
//
// const validateEmail = () => {
//   if (emailRef.val.trim() === '') {
//     emailRef.error = true
//     emailRef.message = 'can not be empty'
//   } else if (!emailReg.test(emailRef.val)) {
//     emailRef.error = true
//     emailRef.message = 'should be valid email'
//   }
// }
</script>

<style>

</style>
