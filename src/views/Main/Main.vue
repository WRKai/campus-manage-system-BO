<script setup lang="ts">
  import { ElMenu, ElMenuItem, ElIcon, ElNotification, ElLink } from 'element-plus';
  import SvgIcon from '@/components/SvgIcon.vue';
  import { h, onMounted, onUnmounted, ref, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { createWs } from '@/ws/'
  import eventEmitter from '@/utils/EventEmitter';
  import { PATH_MAIN_COURSE, PATH_MAIN_LESSON, PATH_MAIN_MAJORDEPT } from '@/router';
  const route = useRoute()
  const router = useRouter()
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
  createWs()
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
      <ElMenuItem index="/main/majorDept">
        <ElIcon :size="40">
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
      <ElMenuItem index="/main/course">
        <ElIcon :size="20">
          <SvgIcon name="courseAdd" />
        </ElIcon>
        <span :class="{ dot: courseAddDot }">课程申请管理</span>
      </ElMenuItem>
      <ElMenuItem index="/main/lesson">
        <ElIcon :size="20">
          <SvgIcon name="lessonAdd" />
        </ElIcon>
        <span :class="{ dot: lessonAddDot }">课次申请管理</span>
      </ElMenuItem>
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
