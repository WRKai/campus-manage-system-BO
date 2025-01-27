const _ResizeObserver = window.ResizeObserver
window.ResizeObserver = class extends _ResizeObserver {
  // @ts-ignore
  constructor(cb) {
    super(entries => {
      // 使用requestAnimationFrame来延迟执行回调函数
      requestAnimationFrame(() => {
        cb(entries);
      });
    });
  }
}
import './assets/base.css'

import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
// svgs
import 'virtual:svg-icons-register'
import pinia from './stores';

// mock数据
// import '@/mock/'
// import '@/ws/mock'

if (import.meta.env.PROD) {
  // console.log = console.error = console.warn = () => { }
}

const app = createApp(App)

app.use(pinia)
  .use(ElementPlus, { locale: zhCn })
  .use(router)

app.mount('#app')
