<template>
  <div class="file-uploader">
    <div class="file-uploader-container" @click.prevent="triggerUpload">
      <slot v-if="fileStatus === 'loading'" name="loading">
        <button class="btn btn-primary disabled">正在上传...</button>
      </slot>
      <slot v-else-if="fileStatus === 'success'" name="uploaded" :uploadedData="uploadedData">
        <button class="btn btn-primary">上传成功</button>
      </slot>
      <slot v-else name="default">
        <button class="btn btn-primary">点击上传</button>
      </slot>
    </div>
    <input type="file" class="file-input d-none" ref="fileInput" @change="handleFileChange">
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, PropType, ref } from 'vue'
import axios from 'axios'

const fileInput = ref<null | HTMLInputElement>(null)
// 拿到dom节点，触发点击
const triggerUpload = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}
// 创建上传状态
type UploadStatus = 'ready' | 'loading' | 'success' | 'error'
type CheckFunction = (file: File) => boolean;
const fileStatus = ref<UploadStatus>('ready')
const uploadedData = ref<any>()
// 添加状态
const props = defineProps(
  {
    action: {
      required: true,
      type: String
    },
    beforeUpload: {
      type: Function as PropType<CheckFunction>
    }
  }
)

const emit = defineEmits(['file-uploaded', 'file-uploaded-error'])

// 加onChange的时候触发的事件
const handleFileChange = (e: Event) => {
  const currentTarget = e.target as HTMLInputElement
  if (currentTarget.files) {
    const files = Array.from(currentTarget.files)
    if (props.beforeUpload) {
      const result = props.beforeUpload(files[0])
      if (!result) {
        return
      }
    }
    fileStatus.value = 'loading'
    const formData = new FormData()
    formData.append('file', files[0])
    axios.post(props.action, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(
      resp => {
        emit('file-uploaded', resp.data)
        uploadedData.value = resp.data
        fileStatus.value = 'success'
      }
    ).catch((error) => {
      emit('file-uploaded-error', error)
      fileStatus.value = 'error'
    }).finally(() => {
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    })
  }
}
</script>

<style>

</style>
