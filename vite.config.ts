import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'node:path'
import viteCompress from 'vite-plugin-compression'
import vueDevTools from 'vite-plugin-vue-devtools'
import { visualizer } from "rollup-plugin-visualizer";
import { cdnRefreshInject } from './cdnRefreshInject'
const prod = process.env.NODE_ENV === 'production'
// https://vite.dev/config/
export default defineConfig({
  base: '/admin/',
  plugins: [
    vue(),
    vueDevTools(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      symbolId: 'icon-[name]'
    }),
    // false ? exGlobal({
    //   'vue': 'Vue',
    //   '@element-plus/icons-vue': 'ElementPlusIconsVue',
    //   'axios': 'axios',
    //   'element-plus': 'ElementPlus',
    //   'jsencrypt': 'JSEncrypt',
    //   'pinia': 'Pinia',
    //   'qs': 'Qs',
    //   'reconnecting-websocket': 'ReconnectingWebSocket',
    //   'vue-router': 'VueRouter',
    //   'element-plus/es/locale/lang/zh-cn': 'ElementPlusLocaleZhCn',
    // }) : null,
    prod ? cdnRefreshInject({
      noDeps: [
        { mod: 'axios', globVar: 'axios', cdns: ["https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/axios/1.7.7/axios.min.js", "https://cdnjs.loli.net/ajax/libs/axios/1.7.5/axios.min.js", "https://cdnjs.cloudflare.com/ajax/libs/axios/1.7.8/axios.min.js"] },
        { mod: 'jsencrypt', globVar: 'JSEncrypt', cdns: ["https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/jsencrypt/3.3.2/jsencrypt.min.js", "https://cdnjs.loli.net/ajax/libs/jsencrypt/3.3.2/jsencrypt.min.js", "https://cdnjs.cloudflare.com/ajax/libs/jsencrypt/3.3.2/jsencrypt.min.js"] },
        { mod: 'qs', globVar: 'Qs', cdns: ["https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/qs/6.13.0/qs.min.js", "https://cdnjs.loli.net/ajax/libs/qs/6.13.0/qs.min.js", "https://cdnjs.cloudflare.com/ajax/libs/qs/6.13.1/qs.min.js"] },
        { mod: 'reconnecting-websocket', globVar: 'ReconnectingWebSocket', cdns: ["https://code.bdstatic.com/npm/reconnecting-websocket@4.4.0/dist/reconnecting-websocket-iife.min.js", "https://unpkg.com/reconnecting-websocket@4.4.0/dist/reconnecting-websocket-iife.min.js"] },
      ],
      deps: [
        { mod: 'vue', globVar: 'Vue', cdns: ["https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/vue/3.5.4/vue.runtime.global.prod.min.js", "https://cdn.bootcdn.net/ajax/libs/vue/3.5.13/vue.runtime.global.prod.min.js", "https://cdnjs.cloudflare.com/ajax/libs/vue/3.5.13/vue.runtime.global.prod.min.js", "https://unpkg.com/vue@3.5.13/dist/vue.runtime.global.prod.js", "https://cdnjs.loli.net/ajax/libs/vue/3.4.38/vue.runtime.global.prod.min.js"] },
        { globVar: 'VueDemi', cdns: ["https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/vue-demi/0.14.10/index.iife.min.js", "https://cdnjs.loli.net/ajax/libs/vue-demi/0.14.10/index.iife.min.js", "https://cdnjs.cloudflare.com/ajax/libs/vue-demi/0.14.10/index.iife.min.js"] },
      ],
      depsRequired: [
        { mod: 'element-plus', globVar: 'ElementPlus', cdns: ["https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/element-plus/2.8.2/index.full.min.js", "https://cdnjs.loli.net/ajax/libs/element-plus/2.8.1/index.full.min.js", "https://cdnjs.cloudflare.com/ajax/libs/element-plus/2.9.1/index.full.min.js"] },
        { mod: '@element-plus/icons-vue', globVar: 'ElementPlusIconsVue', cdns: ["https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/element-plus-icons-vue/2.3.1/global.iife.min.js", "https://cdnjs.loli.net/ajax/libs/element-plus-icons-vue/2.3.1/global.iife.min.js", "https://cdnjs.cloudflare.com/ajax/libs/element-plus-icons-vue/2.3.1/global.iife.min.js"] },
        { mod: 'element-plus/es/locale/lang/zh-cn', globVar: 'ElementPlusLocaleZhCn', cdns: ["https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/element-plus/2.8.2/locale/zh-cn.min.js", "https://cdnjs.loli.net/ajax/libs/element-plus/2.8.1/locale/zh-cn.min.js", "https://cdnjs.cloudflare.com/ajax/libs/element-plus/2.9.1/locale/zh-cn.min.js"] },
        { mod: 'pinia', globVar: 'Pinia', cdns: ["https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/pinia/2.2.2/pinia.iife.prod.min.js", "https://cdnjs.loli.net/ajax/libs/pinia/2.2.2/pinia.iife.prod.min.js", "https://cdnjs.cloudflare.com/ajax/libs/pinia/2.3.0/pinia.iife.prod.min.js"] },
        { mod: 'vue-router', globVar: 'VueRouter', cdns: ["https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/vue-router/4.4.4/vue-router.global.prod.min.js", "https://cdnjs.loli.net/ajax/libs/vue-router/4.4.3/vue-router.global.prod.min.js", "https://cdnjs.cloudflare.com/ajax/libs/vue-router/4.5.0/vue-router.global.prod.min.js"] },
      ],
      styles: [{ id: 'element-plus', cdns: ["https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/element-plus/2.8.2/index.css", "https://cdnjs.loli.net/ajax/libs/element-plus/2.8.1/index.min.css", "https://cdnjs.cloudflare.com/ajax/libs/element-plus/2.9.1/index.min.css"] }]
    }, {
      preFetchModule: true
    }) : null,
    viteCompress({
      algorithm: 'gzip',
      ext: '.gz',
      filter: /\.(js|css|html|ico|json)$/,
      threshold: 1,
      deleteOriginFile: false,
    }),
    viteCompress({
      algorithm: 'brotliCompress',
      ext: '.br',
      filter: /\.(js|css|html|ico|json)$/,
      threshold: 1,
      deleteOriginFile: false,
    }),
    // visualizer({
    //   gzipSize: true,
    //   brotliSize: true,
    //   emitFile: false,
    //   filename: "test.html", //分析图生成的文件名
    //   open: true //如果存在本地服务端口，将在打包后自动展示
    // })
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    hmr: true,
    port: 15432,
    proxy: {
      '/api-admin': {
        target: 'http://1.95.36.194:6002',
        changeOrigin: true,
        rewrite(path) {
          return path.replace('\/api-admin', '')
        },
      }
    }
  },
  build: {
    rollupOptions: {
      external: ['vue-router', 'pinia', 'vue', 'axios', 'element-plus', 'jsencrypt', 'qs', 'reconnecting-websocket', '@element-plus/icons-vue', 'element-plus/dist/index.css', 'element-plus/es/locale/lang/zh-cn']
    }
  }
})
