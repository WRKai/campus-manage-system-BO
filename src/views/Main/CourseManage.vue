<script setup lang="ts">
  import { getCourses, type Course, type GetCoursesParams } from '@/apis/course';
  import { ElTable, ElTableColumn, ElButton, ElForm, ElFormItem, ElInput, ElTooltip, type FormInstance } from 'element-plus'
  import { Search, Delete } from '@element-plus/icons-vue';
  import { ref } from 'vue';
  import type { StringifyVals } from '@/utils';
  import { createWs } from '@/ws';
  const data = ref<Course[]>([])
  async function init() {
    data.value = await getCourses()
    createWs()
  }
  init()
  const filterFormRef = ref<FormInstance>()
  type Filter = StringifyVals<GetCoursesParams>
  const filter = ref<Filter>({
    name: '',
    credit: ''
  })
  async function submitFilter() {
    const credit = filter.value.credit ? +filter.value.credit : void 0
    data.value = await getCourses({ name: filter.value.name || void 0, credit })
  }
  function clear() {
    filterFormRef.value?.resetFields()
  }
</script>

<template>
  <div class="course-manage-container">
    <header>
      <ElForm ref="filterFormRef" @submit.prevent="submitFilter" class="filter-form" :model="filter" inline>
        <ElFormItem prop="name" label="课程名">
          <ElInput size="small" class="small-form-item" v-model="filter.name" placeholder="课程名" clearable />
        </ElFormItem>
        <ElFormItem prop="credit" label="学分">
          <ElInput size="small" class="small-form-item" v-model="filter.credit" type="number" min="0" max="10"
            step="0.5" placeholder="学分" />
        </ElFormItem>
        <ElFormItem>
          <ElTooltip content="据条件筛选">
            <ElButton size="small" native-type="submit" circle :icon="Search" />
          </ElTooltip>
          <ElTooltip content="清空筛选条件">
            <ElButton size="small" type="danger" circle plain :icon="Delete" @click="clear" />
          </ElTooltip>
        </ElFormItem>
      </ElForm>
    </header>
    <div class="table">
      <ElTable class="data-table" :data stripe>
        <ElTableColumn fixed prop="id" label="课程号" />
        <ElTableColumn prop="name" label="课程名" />
        <ElTableColumn prop="credit" label="学分" />
      </ElTable>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .course-manage-container {
    width: 100%;

    header {
      display: flex;
      justify-content: space-between;
      box-sizing: border-box;
      height: 75px;
      padding: 20px;
      width: 100%;
      border-bottom: 1px solid #dcdfe6;

      .filter-form {
        :deep(.el-form-item) {
          margin: 0;
          margin-right: 1vw;
        }

        .small-form-item {
          width: 8vw;
        }

      }
    }

    .table {
      height: calc(100vh - 75px);
      display: flex;
      flex-direction: column;

      .data-table {
        flex: 1;
        width: 100%;
      }
    }
  }
</style>
