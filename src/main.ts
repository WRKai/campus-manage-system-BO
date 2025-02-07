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
// #v-ifdef DEV
import 'element-plus/dist/index.css'
// #v-endif

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import pinia from './stores';
// svgs
import 'virtual:svg-icons-register'
// mock数据
import '@/mock/'
import '@/ws/mock'
// 样式
import './assets/base.css'
if (0) {
  console.log = console.error = console.warn = () => { }
}

const app = createApp(App)

app.use(pinia)
  .use(ElementPlus, { locale: zhCn })
  .use(router)

app.mount('#app')
