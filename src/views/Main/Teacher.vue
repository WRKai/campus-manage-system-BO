<script setup lang="ts">
  import { pageTeachers, postAddTeacher, putAdminTeacher, type Teacher } from '@/apis/teacher';
  import { useDeptMajorStore, type Dept } from '@/stores/deptMajorStore';
  import { useUserStore } from '@/stores/userStore';
  import { createNumInpFn } from '@/utils';
  import { Search, Delete } from '@element-plus/icons-vue';
  import { ElButton, ElDrawer, ElForm, ElFormItem, ElInput, ElMessage, ElPagination, ElRadio, ElSelect, ElRadioGroup, ElTable, ElTableColumn, type FormInstance, type FormRules, ElOption, ElTooltip, ElSwitch, ElDatePicker, ElIcon } from 'element-plus';
  import { ref, watch } from 'vue';
  import SvgIcon from '@/components/SvgIcon.vue';
  import { createWs } from '@/ws';
  const deptMajorStore = useDeptMajorStore()
  const userStore = useUserStore()
  // 添加学生
  const deptMajorList = ref<Dept[]>([])
  async function initDeptMajor() {
    deptMajorList.value = await deptMajorStore.getList()
    createWs()
  }
  initDeptMajor()
  interface AddTeacher {
    id: string; // 教师号，类型为 long，对应 TypeScript 的 number
    sex?: string; // 性别，类型为 varchar(3)，对应 TypeScript 的 string，且为可选字段
    dept?: number; // 系别，类型为 long，对应 TypeScript 的 number
    admin?: number; // 是否管理员，类型为 tinyint，对应 TypeScript 的 number，默认值为 0
    entry_date?: string; // 入职日期，类型为 date，对应 TypeScript 的 string（或 Date 类型），且为可选字段
    title: string | null; // 职称，类型为 varchar(255)，对应 TypeScript 的 string，且为可选字段
    name: string; // 姓名，类型为 varchar(255)，对应 TypeScript 的 string
    // password: string | null; // 密码，类型为 varchar(255)，对应 TypeScript 的 string
    entryDate?: Date
  }
  const teacherAddFormVal = ref<AddTeacher>({
    id: '',
    name: '',
    dept: void 0,
    sex: '',
    admin: void 0,
    title: '',
    entryDate: void 0
  })
  const teacherAddFormRules = ref<FormRules<AddTeacher>>({
    id: [
      { required: true, message: '请输入UID', trigger: ['blur', 'change'] },
      { max: 12, message: '长度在 1 到 12 个数字', trigger: ['blur', 'change'] }
    ],
    name: [
      { required: true, message: '请输入姓名', trigger: ['blur', 'change'] },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: ['blur', 'change'] }
    ],
    dept: [
      { required: true, message: '请选择系别', trigger: ['blur', 'change'] },
    ],
    sex: [
      { required: true, message: '请选择性别', trigger: ['blur', 'change'] },
    ],
    admin: [
      { required: true, message: '请选择性别', trigger: ['blur', 'change'] },
    ],
  })
  const drawer = ref(false);
  const teacherAddFormRef = ref<FormInstance>();
  async function handleAddTeacher() {
    // TODO 给系别/专业选择加一个刷新按钮
    const vaild = await teacherAddFormRef.value?.validate()
    if (!vaild)
      return
    const res = {
      ...teacherAddFormVal.value,
      id: +teacherAddFormVal.value.id,
      dept: teacherAddFormVal.value.dept!,
      title: teacherAddFormVal.value.title || null,
      admin: teacherAddFormVal.value.admin ?? 0,
      entryDate: teacherAddFormVal.value.entryDate?.toISOString().substring(0, 10) ?? null
    }
    await postAddTeacher(res)
    drawer.value = false
    ElMessage.success('添加成功!')
    getTeachers()
    teacherAddFormRef.value?.resetFields()
    teacherAddFormVal.value.admin = void 0
  }
  // 展示学生
  interface TeacherVO {
    id: number; // 教师号，类型为 long，对应 TypeScript 的 number
    sex?: string; // 性别，类型为 varchar(3)，对应 TypeScript 的 string，且为可选字段
    dept: string; // 系别，类型为 long，对应 TypeScript 的 number
    admin: boolean; // 是否管理员，类型为 tinyint，对应 TypeScript 的 number，默认值为 0
    entry_date?: string; // 入职日期，类型为 date，对应 TypeScript 的 string（或 Date 类型），且为可选字段
    title: string | null; // 职称，类型为 varchar(255)，对应 TypeScript 的 string，且为可选字段
    name: string; // 姓名，类型为 varchar(255)，对应 TypeScript 的 string
  }
  const teachers = ref<TeacherVO[]>([])
  interface TeacherFilter {
    page: number;       // 当前页码
    pageSize: number;       // 当前页码
    total: number;      // 总条数
    id: string;         // 学号
    name: string;       // 姓名
    title?: string;       // 姓名
    admin?: number;       // 姓名
    sex: string;        // 性别
    dept?: number;      // 系别（可选，数字类型）
    entryDate?: Date; // 入职日期（可选，字符串类型）
  }
  const filterFormRef = ref<FormInstance>()
  const filter = ref<TeacherFilter>({
    page: 1,
    pageSize: 20,
    total: 0,
    id: '',
    name: '',
    dept: void 0,
    sex: '',
    admin: void 0,
    title: '',
    entryDate: void 0
  })
  async function getTeachers() {
    const queryObj = {
      page: filter.value.page,
      pageSize: filter.value.pageSize,
      dept: filter.value.dept || null,
      id: +filter.value.id || null,
      name: filter.value.name || null,
      sex: filter.value.sex || null,
      admin: filter.value.admin ?? null,
      title: filter.value.title || null,
      entryDate: filter.value.entryDate?.toISOString().substring(0, 10) ?? null
    }
    const res = await pageTeachers(queryObj)
    const depts = await deptMajorStore.getDepts()
    teachers.value = res.records.map(t => ({
      ...t,
      dept: depts?.get(t.dept!)!,
      title: t.title || '-',
      admin: !!t.admin
    }))
    filter.value.total = res.total
  }
  watch(() => filter.value.page, () => getTeachers(), { immediate: true })
  // 管理员切换处理
  const globalLoading = ref(false)
  async function handleAdminChange(id: number, admin: boolean) {
    globalLoading.value = true
    try {
      await putAdminTeacher(id, +!admin)
    } catch {
      return false
    }
    globalLoading.value = false
    return true
  }
  // 其它处理
  function disabledDate(d: Date) {
    return d.getTime() > Date.now()
  }
  const _fn1 = createNumInpFn(teacherAddFormVal.value, 'id');
  const _fn2 = createNumInpFn(filter.value, 'id');
</script>

<template>
  <div class="teacher-container">
    <header>
      <ElForm ref="filterFormRef" @submit.prevent="getTeachers" class="filter-form" :model="filter" inline>
        <ElFormItem label="系别" prop="dept">
          <ElSelect clearable v-model="filter.dept" size="small" class="smaller-form-item">
            <ElOption v-for="d in deptMajorList" :key="d.id" :value="d.id" :label="d.name" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem v-model="filter.sex" label="性别" prop="sex">
          <ElSelect clearable class="smaller-form-item" v-model="filter.sex" placeholder="无" size="small">
            <ElOption value="男" label="男"></ElOption>
            <ElOption value="女" label="女"></ElOption>
          </ElSelect>
        </ElFormItem>
        <ElFormItem v-model="filter.admin" label="权限" prop="admin">
          <ElSelect clearable class="smaller-form-item" v-model="filter.admin" placeholder="无" size="small">
            <ElOption :value="1" label="管理员"></ElOption>
            <ElOption :value="0" label="普通"></ElOption>
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="入职日期" prop="entryDate">
          <ElDatePicker disabled style="width: 4vw;" clearable v-model="filter.entryDate" size="small" type="date"
            placeholder="选择日期" :disabledDate />
        </ElFormItem>
        <ElFormItem label="UID" prop="id">
          <ElInput class="small-form-item" ref="studentAddInp" size="small" :model-value="filter.id"
            @update:model-value="_fn2">
          </ElInput>
        </ElFormItem>
        <ElFormItem label="姓名" prop="name">
          <ElInput class="smaller-form-item" size="small" v-model.trim="filter.name">
          </ElInput>
        </ElFormItem>
        <ElFormItem label="职称" prop="title">
          <ElInput class="smaller-form-item" size="small" v-model.trim="filter.title">
          </ElInput>
        </ElFormItem>
        <ElFormItem>
          <ElTooltip content="据条件筛选">
            <ElButton size="small" native-type="submit" circle :icon="Search" />
          </ElTooltip>
          <ElTooltip content="清空筛选条件">
            <ElButton size="small" type="danger" circle plain :icon="Delete" @click="filterFormRef?.resetFields()" />
          </ElTooltip>
        </ElFormItem>
      </ElForm>
      <ElTooltip placement="left" content="添加教师">
        <ElButton size="large" type="primary" circle @click="drawer = true">
          <template #icon>
            <ElIcon :size="30">
              <SvgIcon name="teacherAdd" />
            </ElIcon>
          </template>
        </ElButton>
      </ElTooltip>
    </header>
    <div ref="tableContainer" class="table">
      <ElTable class="data-table" :data="teachers" stripe style="width: 99%;flex: 1;">
        <ElTableColumn fixed prop="id" label="UID" />
        <ElTableColumn prop="name" label="姓名" />
        <ElTableColumn prop="sex" label="性别" />
        <ElTableColumn prop="dept" label="系别" />
        <ElTableColumn prop="title" label="职称" />
        <ElTableColumn prop="entryDate" label="入职日期" />
        <ElTableColumn prop="admin" label="管理员权限">
          <template #default="scope">
            <ElSwitch :disabled="userStore.getUser()?.id === scope.row.id" :loading="globalLoading"
              v-model="scope.row.admin" :before-change="() => handleAdminChange(scope.row.id, scope.row.admin)">
            </ElSwitch>
          </template>
        </ElTableColumn>
      </ElTable>
      <div class="pager">
        <ElPagination background v-model:current-page="filter.page" :default-page-size="20" :page-size="filter.pageSize"
          :total="filter.total" />
      </div>
    </div>
  </div>
  <ElDrawer v-model="drawer" title="添加教师" size="40%">
    <ElForm ref="teacherAddFormRef" @submit.prevent="handleAddTeacher" :rules="teacherAddFormRules"
      :model="teacherAddFormVal" label-width="auto">
      <ElFormItem size="large" label="系别" prop="dept">
        <ElSelect v-model="teacherAddFormVal.dept">
          <ElOption v-for="d in deptMajorList" :key="d.id" :value="d.id" :label="d.name" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="性别" prop="sex">
        <ElRadioGroup v-model="teacherAddFormVal.sex">
          <ElRadio value="男">男</ElRadio>
          <ElRadio value="女">女</ElRadio>
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem label="权限" prop="admin">
        <ElRadioGroup v-model="teacherAddFormVal.admin">
          <ElRadio :value="1">管理员</ElRadio>
          <ElRadio :value="0">普通</ElRadio>
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem label="入职日期" prop="entryDate">
        <ElDatePicker style="width: 100%;" v-model="teacherAddFormVal.entryDate" size="large" type="date"
          placeholder="选择日期" :disabledDate />
      </ElFormItem>
      <ElFormItem label="UID" prop="id">
        <ElInput ref="studentAddInp" size="large" :model-value="teacherAddFormVal.id" @update:model-value="_fn1">
        </ElInput>
      </ElFormItem>
      <ElFormItem label="姓名" prop="name">
        <ElInput size="large" v-model.trim="teacherAddFormVal.name">
        </ElInput>
      </ElFormItem>
      <ElFormItem label="职称" prop="title">
        <ElInput size="large" v-model.trim="teacherAddFormVal.title">
        </ElInput>
      </ElFormItem>
      <ElFormItem>
        <ElButton type="primary" size="large" native-type="submit">提交</ElButton>
      </ElFormItem>
    </ElForm>
  </ElDrawer>
</template>

<style lang="less" scoped>
  .teacher-container {
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
          width: 6vw !important;
        }

        .smaller-form-item {
          width: 4vw !important;
        }
      }
    }

    .table {
      height: calc(100vh - 75px);
      display: flex;
      flex-direction: column;

      .data-table {
        flex: 1;
      }

      .pager {
        height: 50px;
        padding: 9px;
      }
    }
  }
</style>
