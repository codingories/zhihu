<template>
  <div class="create-post-page">
    <h4>{{ isEditMode ? '编辑文章' : '新建文章' }}</h4>
    <my-uploader action="/upload"
                 :before-upload="uploadCheck"
                 @file-uploaded="handleFileUploaded"
                 :uploaded="uploadedData"
                 class="d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4">
      <h2>点击上传头图</h2>
      <template #loading>
        <div class="d-flex">
          <div class="spinner-border text-secondary" role="status">
            <span class="visually-hidden">Loading</span>
          </div>
          <h2>正在上传</h2>
        </div>
      </template>
      <template #uploaded="dataProps">
        <img :src="dataProps.uploadedData.data.url" alt="">
      </template>
    </my-uploader>

    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">文章标题：</label>
        <validate-input
          :rules="titleRules" v-model="titleVal"
          placeholder="请输入文章标题"
          type="text"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">文章详情：</label>
        <validate-input
          type="textarea"
          rows="10"
          tag="textarea"
          placeholder="请输入文章详情"
          :rules="contentRules"
          v-model="contentVal"
        />
      </div>
      <template #submit>
        <button class="btn btn-primary btn-large">
          {{ isEditMode ? '编辑文章' : '新建文章' }}
        </button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts" setup>
import ValidateForm from '@/components/ValidateForm.vue'
import ValidateInput from '@/components/ValidateInput.vue'
import { ImageProps, RulesProp, ResponseType, PostProps } from '@/types/commonTypes'
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '@/store'
import MyUploader from '@/components/myUploader.vue'
import { beforeUploadCheck } from '@/helper'
import createMessage from '@/components/createMessage'
import { useRoute, useRouter } from 'vue-router'

const store = useStore<GlobalDataProps>()
const titleRules: RulesProp = [
  {
    type: 'required',
    message: '文章标题不能为空'
  }
]
const uploadedData = ref()
const router = useRouter()
const route = useRoute()
const isEditMode = !!route.query.id
const titleVal = ref('')
const contentVal = ref('')

onMounted(() => {
  if (isEditMode) {
    store.dispatch('fetchPost', route.query.id).then((rawData: ResponseType<PostProps>) => {
      const currentPost = rawData.data
      if (currentPost.image) {
        uploadedData.value = { data: currentPost.image }
      }
      titleVal.value = currentPost.title
      contentVal.value = currentPost.content || ''
    })
  }
})
const contentRules: RulesProp = [
  {
    type: 'required',
    message: '文章详情不能为空'
  }
]
let imageId = ''
const handleFileUploaded = (rawData: ResponseType<ImageProps>) => {
  if (rawData.data._id) {
    imageId = rawData.data._id
  }
}

const onFormSubmit = (result: boolean) => {
  if (result) {
    console.log(result)
    const {
      column,
      _id
    } = store.state.user
    if (column) {
      const newPost: PostProps = {
        title: titleVal.value,
        content: contentVal.value,
        column: column,
        author: _id
      }
      if (imageId) {
        newPost.image = imageId
      }
      const actionName = isEditMode ? 'updatePost' : 'createPost'
      const sendData = isEditMode ? { id: route.query.id, payload: newPost } : newPost
      store.dispatch(actionName, sendData).then(
        () => {
          createMessage('发表成功，2秒后跳转到文章', 'success', 2000)
          setTimeout(() => {
            router.push({
              name: 'column',
              params: { id: column }
            })
          }, 2000)
        }
      )
    }
  }
}

const uploadCheck = (file: File) => {
  const result = beforeUploadCheck(file, {
    format: ['image/jpeg', 'image/png'],
    size: 1
  })
  const {
    passed,
    error
  } = result
  if (error === 'format') {
    createMessage('上传图片只能是 JPG/PNG 格式!', 'error')
  }
  if (error === 'size') {
    createMessage('上传图片大小不能超过 1Mb!', 'error')
  }
  return passed
}

</script>
<script lang="ts">
export default {
  name: 'CreatePost'
}
</script>
<style>
.create-post-page .file-uploader-container {
  height: 200px;
  cursor: pointer;
}

.create-post-page .file-uploader-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
