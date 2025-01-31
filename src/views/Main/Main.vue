<script setup lang="ts">
  import { ElMenu, ElMenuItem, ElIcon, ElNotification, ElLink, ElSubMenu, ElPopconfirm } from 'element-plus';
  import SvgIcon from '@/components/SvgIcon.vue';
  import { h, onMounted, onUnmounted, ref, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import eventEmitter from '@/utils/EventEmitter';
  import { PATH_MAIN_COURSE, PATH_MAIN_COURSE_MANAGE, PATH_MAIN_LESSON, PATH_MAIN_MAJORDEPT } from '@/router';
  import { User } from '@element-plus/icons-vue';
  import { useUserStore } from '@/stores/userStore';
  const route = useRoute()
  const router = useRouter()
  const userStore = useUserStore()
  const activeIdx = ref(PATH_MAIN_MAJORDEPT)
  const courseAddDot = ref(false)
  const lessonAddDot = ref(false)
  watch(() => [route.path, route.query], ([nval]) => {
    activeIdx.value = nval as string
    if (nval === PATH_MAIN_COURSE) {
      courseAddDot.value = false
    } else if (nval === PATH_MAIN_LESSON) {
      lessonAddDot.value = false
    }
  }, { immediate: true })
  // 监听ws消息事件
  // createWs()
  function handleNewCourseApply() {
    courseAddDot.value = true
    const notification = ElNotification({
      title: '新课程申请',
      message: h(ElLink, {
        type: 'primary',
        onClick: () => {
          router.push({ name: 'main-course', query: { t: Date.now() } })
          notification.close()
        }
      },
        () => '有新的课程申请, 点击查看'),
      icon: h(SvgIcon, { name: 'courseAdd' }),
      duration: 3333
    })
  }
  function handleNewLessonApply() {
    lessonAddDot.value = true
    const notification = ElNotification({
      title: '新课次申请',
      message: h(ElLink, {
        type: 'primary',
        onClick: () => {
          router.push({ name: 'main-lesson', query: { t: Date.now() } })
          notification.close()
        }
      },
        () => '有新的课次申请, 点击查看'),
      icon: h(SvgIcon, { name: 'lessonAdd' }),
      duration: 3333
    })
  }
  function logout() {
    userStore.clearToken()
    userStore.clearUser()
    router.push({ name: 'login' })
  }
  onMounted(() => {
    eventEmitter.listen('new-add-course-apply', handleNewCourseApply)
    eventEmitter.listen('new-add-lesson-apply', handleNewLessonApply)
  })
  onUnmounted(() => {
    eventEmitter.off('new-add-course-apply', handleNewCourseApply)
    eventEmitter.off('new-add-lesson-apply', handleNewLessonApply)
  })
</script>

<template>
  <div class="main-container">
    <ElMenu class="menu" :default-active="activeIdx" router>
      <ElMenuItem>
        <ElPopconfirm title="退出登录吗?" @confirm="logout">
          <template #reference>
            <div class="user">
              <ElIcon>
                <User></User>
              </ElIcon>
              <span>{{ userStore.getUser()?.name }}</span>
            </div>
          </template>
        </ElPopconfirm>
      </ElMenuItem>
      <ElMenuItem index="/main/majorDept">
        <ElIcon :size="38">
          <SvgIcon name="majorDept" />
        </ElIcon>
        <span>专业系别管理</span>
      </ElMenuItem>
      <ElMenuItem index="/main/student">
        <ElIcon>
          <SvgIcon name="student" />
        </ElIcon>
        <span>学生管理</span>
      </ElMenuItem>
      <ElMenuItem index="/main/teacher">
        <ElIcon :size="30">
          <SvgIcon name="teacher" />
        </ElIcon>
        <span>教师管理</span>
      </ElMenuItem>
      <ElSubMenu index="course">
        <template #title>
          <ElIcon :size="28">
            <SvgIcon name="course" />
          </ElIcon>
          <span :class="{ dot: lessonAddDot }">课程管理</span>
        </template>
        <ElMenuItem index="/main/course">
          <ElIcon :size="20">
            <SvgIcon name="courseCheck" />
          </ElIcon>
          <span :class="{ dot: courseAddDot }">课程申请</span>
        </ElMenuItem>
        <ElMenuItem :index="PATH_MAIN_COURSE_MANAGE">
          <ElIcon :size="20">
            <SvgIcon name="courseManage" />
          </ElIcon>
          <span>全校课程</span>
        </ElMenuItem>
      </ElSubMenu>
      <ElSubMenu index="lesson">
        <template #title>
          <ElIcon :size="30">
            <SvgIcon name="lesson" />
          </ElIcon>
          <span :class="{ dot: lessonAddDot }">课次管理</span>
        </template>
        <ElMenuItem index="/main/lesson">
          <ElIcon :size="22">
            <SvgIcon name="lessonCheck" />
          </ElIcon>
          <span :class="{ dot: lessonAddDot }">课次申请</span>
        </ElMenuItem>
        <ElMenuItem index="/main/lesson">
          <ElIcon :size="22">
            <SvgIcon name="lessonManage" />
          </ElIcon>
          <span :class="{ dot: lessonAddDot }">全校课次</span>
        </ElMenuItem>
      </ElSubMenu>
    </ElMenu>
    <RouterView />
  </div>
</template>

<style lang="less" scoped>
  .main-container {
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;

    .menu {
      width: fit-content;
      height: 100%;

      .user {
        color: #409EFF;
        border-bottom: 1px solid #dcdfe6;
        width: 100%;
        display: flex;
        align-items: center;

        span {
          font-weight: 700 !important;
        }
      }

      span.dot {
        position: relative;
        height: fit-content;

        &::after {
          content: '';
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #F56C6C;
          position: absolute;
          bottom: 60%;
          right: -10%
        }
      }
    }
  }
</style>
