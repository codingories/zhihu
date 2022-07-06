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
import { computed, defineComponent, reactive, ref } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import GlobalHeader from '@/components/GlobalHeader.vue'
import { useStore } from 'vuex'

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
    const store = useStore()
    console.log('store', store)
    const currentUser = computed(() => store.state.user)

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
</script>

<style>

</style>
