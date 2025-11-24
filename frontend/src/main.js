// frontend/src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

// 创建Vue应用
const app = createApp(App)

// 使用状态管理
app.use(createPinia())
app.use(router)

// 挂载到页面
app.mount('#app')