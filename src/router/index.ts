import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Main from '../views/Main/Main.vue'
import { useUserStore } from '@/stores/userStore'

export const PATH_LOGIN = '/login'
export const PATH_MAIN = '/main'
export const PATH_MAIN_MAJORDEPT = '/main/majorDept'
export const PATH_MAIN_STUDENT = '/main/student'
export const PATH_MAIN_TEACHER = '/main/teacher'
export const PATH_MAIN_COURSE = '/main/course'
export const PATH_MAIN_LESSON = '/main/lesson'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'ROOT',
      redirect: PATH_LOGIN
    },
    {
      path: PATH_LOGIN,
      name: 'login',
      component: Login,
      meta: {
        noAuth: true
      }
    },
    {
      path: PATH_MAIN,
      name: 'main',
      component: Main,
      redirect: PATH_MAIN_MAJORDEPT,
      children: [
        {
          path: PATH_MAIN_MAJORDEPT,
          name: 'main-majorDept',
          component: () => import('../views/Main/MajorDept.vue')
        },
        {
          path: PATH_MAIN_STUDENT,
          name: 'main-student',
          component: () => import('../views/Main/Student.vue')
        },
        {
          path: PATH_MAIN_TEACHER,
          name: 'main-teacher',
          component: () => import('../views/Main/Teacher.vue')
        },
        {
          path: PATH_MAIN_COURSE,
          name: 'main-course',
          component: () => import('../views/Main/Course.vue')
        },
        {
          path: PATH_MAIN_LESSON,
          name: 'main-lesson',
          component: () => import('../views/Main/Lesson.vue')
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
