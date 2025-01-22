<script setup lang="ts">
  import { getLessonApply } from '@/apis/lesson';
  import { pageTeachers } from '@/apis/teacher';
  import { useCourseStore, type CourseMap } from '@/stores/courseStore';
  import { useTeacherCacheStore } from '@/stores/teacherCacheStore';
  import { ref, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { ElButton, ElLink, ElTable, ElTableColumn } from 'element-plus';
  import { Refresh } from '@element-plus/icons-vue';
  const teacherCache = useTeacherCacheStore()
  const courseStore = useCourseStore()
  const route = useRoute()
  const router = useRouter()
  let courseMap: CourseMap | null = null

  async function init() {
    courseMap = await courseStore.getCourseMap()
    getApplies()
  }
  init()

  interface ApplyVO {
    uid: number;
    courseName: string; // 这个课次对应的课程
    targetGrade: number;
    teacherName: string;
  }

  const data = ref<ApplyVO[]>([])

  async function getApplies() {
    const res = await getLessonApply()
    data.value = await Promise.all(res.map(async e => ({
      ...e,
      courseName: courseMap?.get(e.courseId)?.name!,
      teacherName: teacherCache.get(e.teacherId)! ?? await pageTeachers({ id: e.teacherId }).then(res => res.records[0].name)
    })))
  }

  watch(() => route.query, () => getApplies())
</script>

<template>
  <div class="lesson-container">
    <header>
      <ElButton @click="router.push({ query: { t: Date.now() } })" :icon="Refresh" circle />
    </header>
    <ElTable :data stripe class="table">
      <ElTableColumn fixed label="课程名称" prop="courseName" />
      <ElTableColumn label="面向年级" prop="targetGrade" />
      <ElTableColumn label="申请教师" prop="teacherName" />
      <ElTableColumn fixed="right" label="操作" width="80">
        <template #default="scope">
          <ElLink type="primary">查看</ElLink>
        </template>
      </ElTableColumn>
    </ElTable>
  </div>
</template>

<style lang="less" scoped>
  .lesson-container {
    width: 100%;
    height: 100%;

    header {
      display: flex;
      justify-content: space-between;
      box-sizing: border-box;
      height: 75px;
      padding: 20px;
      width: 100%;
      border-bottom: 1px solid #dcdfe6;
    }

    .table {
      height: calc(100vh - 75px);
    }
  }
</style>
