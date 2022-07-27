import Message from './myMessage.vue'
import { MessageType } from '@/types/commonTypes'
import { createApp } from 'vue'

const createMessage = (message: string, type: MessageType, timeout = 2000) => {
  // 难点如何用函数来创建一个组件, main.ts中有createApp，
  // 参考文档: https://vuejs.org/api/application.html#createapp
  const messageInstance = createApp(Message, {
    message,
    type
  })
  // 挂在到某个节点,main.ts也有
  const mountNode = document.createElement('div')
  document.body.appendChild(mountNode)
  messageInstance.mount(mountNode)
  setTimeout(() => {
    messageInstance.unmount()
    document.body.removeChild(mountNode)
  }, timeout)
}

export default createMessage
