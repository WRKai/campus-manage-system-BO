<script setup lang="ts">
  import { getCourseApply, putHandleCourseApply } from '@/apis/course';
  import { useCourseStore, type CourseMap } from '@/stores/courseStore';
  import { useDeptMajorStore } from '@/stores/deptMajorStore';
  import { Refresh } from '@element-plus/icons-vue';
  import { ElButton, ElLink, ElMessage, ElTable, ElTableColumn } from 'element-plus';
  import { ref, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  const deptMajorStore = useDeptMajorStore()
  const courseStore = useCourseStore()
  const route = useRoute()
  const router = useRouter()
  let majorMap: Map<number, string> | null = null
  let courseMap: CourseMap | null = null
  async function init() {
    majorMap = await deptMajorStore.getMajors()
    courseMap = await courseStore.getCourseMap()
    getApplies()
  }
  init()
  // 获取申请
  interface ApplyVO {
    uid: string
    name: string
    credit: number
    preCourses: string
    majors: string
  }
  const data = ref<ApplyVO[]>()
  async function getApplies() {
    const res = await getCourseApply()
    data.value = res.map(e => ({
      ...e,
      preCourses: e.preIds?.map(e => courseMap?.get(e)?.name || '').join('、') || '-',
      majors: e.majors.map(e => `${majorMap?.get(e.majorId) || ''}(${e.required ? '必修' : '选修'})`
      ).join('、')
    }))
  }

  async function handleApply(uid: string, apply: number) {
    console.log(uid, apply)
    await putHandleCourseApply({ uid, apply })
    ElMessage.success('操作成功!')
    refreshApplies()
  }

  function refreshApplies() {
    router.push({ query: { t: Date.now() } })
  }

  watch(() => route.query, () => getApplies())
</script>

<template>
  <div class="course-container">
    <header>
      <ElButton @click="refreshApplies" :icon="Refresh" circle />
    </header>
    <ElTable show-overflow-tooltip :data stripe class="table">
      <ElTableColumn fixed label="课程名称" prop="name" />
      <ElTableColumn label="学分" prop="credit" width="80" />
      <ElTableColumn label="先修课程" prop="preCourses" />
      <ElTableColumn label="面向专业" prop="majors" />
      <ElTableColumn fixed="right" label="操作" width="100">
        <template #default="scope">
          <ElLink type="success" style="margin-right: 10px;" @click="handleApply(scope.row.uid, 1)">通过</ElLink>
          <ElLink type="danger" @click="handleApply(scope.row.uid, 0)">驳回</ElLink>
        </template>
      </ElTableColumn>
    </ElTable>
  </div>
</template>

<style lang="less" scoped>
  .course-container {
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
