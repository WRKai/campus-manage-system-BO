import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Main from '../views/Main/Main.vue'
import { useUserStore } from '@/stores/userStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'ROOT',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        noAuth: true
      }
    },
    {
      path: '/main',
      name: 'main',
      component: Main,
      redirect: '/main/majorDept',
      children: [
        {
          path: '/main/majorDept',
          name: 'main-majorDept',
          component: () => import('../views/Main/MajorDept.vue')
        },
        {
          path: '/main/student',
          name: 'main-student',
          component: () => import('../views/Main/Student.vue')
        },
        {
          path: '/main/teacher',
          name: 'main-teacher',
          component: () => import('../views/Main/Teacher.vue')
        },
      ]
    }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue'),
    // },
  ],
})
router.beforeEach((to, _from, next) => {
  if (to.meta.noAuth) {
    if (useUserStore().getToken()) {
      next('/main')
    } else {
      next()
    }
  } else {
    if (useUserStore().getToken()) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
