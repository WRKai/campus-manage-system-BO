const _ResizeObserver = window.ResizeObserver
window.ResizeObserver = class extends _ResizeObserver {
  constructor(cb: Function) {
    super(entries => {
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
if (import.meta.env.DEV) {
  import('element-plus/dist/index.css')
} else {
  // console.log = console.error = console.warn = () => { }
}
// svgs
import 'virtual:svg-icons-register'
import pinia from './stores';

// mock数据
// import '@/mock/'
// import '@/ws/mock'


const app = createApp(App)

app.use(pinia)
  .use(ElementPlus, { locale: zhCn })
  .use(router)

app.mount('#app')
