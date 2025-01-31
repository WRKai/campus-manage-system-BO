<script setup lang="ts">
  import { pageStudents, postAddStudent, type Student } from '@/apis/student';
  import { useDeptMajorStore, type Dept } from '@/stores/deptMajorStore';
  import { createNumInpFn, type StringifyVals } from '@/utils';
  import { Plus, Search, Delete } from '@element-plus/icons-vue';
  import { ElButton, ElCascader, ElDrawer, ElForm, ElFormItem, ElInput, ElMessage, ElPagination, ElRadio, ElSelect, ElRadioGroup, ElTable, ElTableColumn, type FormInstance, type FormRules, ElOption, ElTooltip, ElIcon } from 'element-plus';
  import { ref, watch } from 'vue';
  import SvgIcon from '@/components/SvgIcon.vue';
  import { createWs } from '@/ws';
  const deptMajorStore = useDeptMajorStore()
  // 添加学生
  const deptMajorList = ref<Dept[]>([])
  async function initDeptMajor() {
    deptMajorList.value = await deptMajorStore.getList()
    createWs()
  }
  initDeptMajor()
  interface AddStu {
    id: string; // 学号，类型为 long，对应 TypeScript 的 number
    name: string; // 姓名，类型为 varchar(255)，对应 TypeScript 的 string
    sex?: string; // 性别，类型为 varchar(3)，对应 TypeScript 的 string，且为可选字段
    grade: string; // 年级，类型为 smallint，对应 TypeScript 的 number
    deptMajor?: number[];
    credit: string; // 学分，类型为 int，对应 TypeScript 的 number
  }
  const studentAddFormVal = ref<AddStu>({
    id: '',
    name: '',
    grade: '',
    deptMajor: [],
    credit: '',
    sex: ''
  })
  const studentAddFormRules = ref<FormRules<AddStu>>({
    id: [
      { required: true, message: '请输入UID', trigger: ['blur', 'change'] },
      { min: 2, max: 12, message: '长度在 2 到 12 个数字', trigger: ['blur', 'change'] }
    ],
    name: [
      { required: true, message: '请输入姓名', trigger: ['blur', 'change'] },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: ['blur', 'change'] }
    ],
    grade: [
      { required: true, message: '请输入年级', trigger: ['blur', 'change'] },
      { len: 4, message: '长度为 4 个数字', trigger: ['blur', 'change'] }
    ],
    credit: [
      { required: true, message: '请输入学分', trigger: ['blur', 'change'] },
    ],
    sex: [
      { required: true, message: '请选择性别', trigger: ['blur', 'change'] },
    ],
    deptMajor: [
      { required: true, message: '请选择系别/专业', trigger: ['blur', 'change'] },
      {
        validator: (_, val: number[], cb) => {
          if (val && val.length === 2 && val.every(v => v))
            cb()
          else
            cb(new Error('请选择系别/专业'))
        }, message: '请选择系别/专业', trigger: ['blur', 'change']
      },
    ]
  })
  const drawer = ref(false);
  const studentAddFormRef = ref<FormInstance>();
  async function handleAddStu() {
    // TODO 给系别/专业选择加一个刷新按钮
    const valid = await studentAddFormRef.value?.validate()
    if (!valid)
      return
    const res = {
      ...studentAddFormVal.value,
      id: +studentAddFormVal.value.id,
      dept: studentAddFormVal.value.deptMajor![0],
      major: studentAddFormVal.value.deptMajor![1],
      grade: +studentAddFormVal.value.grade,
      credit: +studentAddFormVal.value.credit,
    }
    await postAddStudent(res)
    drawer.value = false
    ElMessage.success('添加成功!')
    getStudents()
    studentAddFormRef.value?.resetFields()
  }
  // 展示学生
  const students = ref<StringifyVals<Student, 'dept' | 'major'>[]>([])
  interface StudentFilter {
    page: number;       // 当前页码
    pageSize: number;   // 当前页码
    total: number;      // 总条数
    id: string;         // 学号
    name: string;       // 姓名
    grade: string;      // 年级
    credit: string;     // 学分
    sex: string;        // 性别
    dept?: number;      // 系别（可选，数字类型）
    major?: number;     // 专业（可选，数字类型）
  }
  const filterFormRef = ref<FormInstance>()
  const filter = ref<StudentFilter>({
    page: 1,
    pageSize: 20,
    total: 0,
    id: '',
    name: '',
    grade: '',
    credit: '',
    sex: '',
    dept: void 0,
    major: void 0
  })
  async function getStudents() {
    const queryObj = {
      page: filter.value.page,
      pageSize: filter.value.pageSize,
      dept: filter.value.dept || null,
      major: filter.value.major || null,
      id: +filter.value.id || null,
      name: filter.value.name || null,
      grade: +filter.value.grade || null,
      credit: +filter.value.credit || null,
      sex: filter.value.sex || null
    }
    const res = await pageStudents(queryObj)
    const depts = await deptMajorStore.getDepts()
    const majors = await deptMajorStore.getMajors()
    students.value = res.records.map(stu => ({
      ...stu,
      dept: depts?.get(stu.dept!),
      major: majors?.get(stu.major!)
    }))
    filter.value.total = res.total
  }
  getStudents()
  watch(() => filter.value.page, () => getStudents())
  // 其它处理
  const _fn1 = createNumInpFn(studentAddFormVal.value, 'id');
  const _fn2 = createNumInpFn(filter.value, 'id');
</script>

<template>
  <div class="student-container">
    <header>
      <ElForm ref="filterFormRef" @submit.prevent="getStudents" class="filter-form" :model="filter" inline>
        <ElFormItem label="系别" prop="dept">
          <ElSelect clearable @change="filter.major = void 0" v-model="filter.dept" size="small"
            class="small-form-item">
            <ElOption v-for="d in deptMajorList" :key="d.id" :value="d.id" :label="d.name" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="专业" prop="major">
          <ElSelect clearable v-model="filter.major" size="small" class="small-form-item"
            :placeholder="filter.dept ? '请选择' : '无系别'">
            <ElOption v-if="filter.dept" v-for="m in (deptMajorList.find(d => d.id === filter.dept)?.majors ?? [])"
              :key="m.id" :value="m.id" :label="m.name" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem v-model="filter.sex" label="性别" prop="sex">
          <ElSelect clearable class="smaller-form-item" v-model="filter.sex" placeholder="无" size="small">
            <ElOption value="男">男</ElOption>
            <ElOption value="女">女</ElOption>
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="学号" prop="id">
          <ElInput class="small-form-item" ref="studentAddInp" size="small" :model-value="filter.id"
            @update:model-value="_fn2">
          </ElInput>
        </ElFormItem>
        <ElFormItem label="姓名" prop="name">
          <ElInput class="small-form-item" size="small" v-model.trim="filter.name">
          </ElInput>
        </ElFormItem>
        <ElFormItem label="年级" prop="grade">
          <ElInput class="smaller-form-item" size="small" type="number" v-model.trim="filter.grade">
          </ElInput>
        </ElFormItem>
        <ElFormItem label="学分" prop="credit">
          <ElInput class="smaller-form-item" size="small" type="number" step="0.5" v-model.trim="filter.credit">
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
      <ElTooltip placement="left" content="添加学生">
        <ElButton size="large" type="primary" circle @click="drawer = true">
          <template #icon>
            <ElIcon :size="18">
              <SvgIcon name="studentAdd" />
            </ElIcon>
          </template>
        </ElButton>
      </ElTooltip>
    </header>
    <div class="table">
      <ElTable class="data-table" :data="students" stripe>
        <ElTableColumn fixed prop="id" label="学号" />
        <ElTableColumn prop="name" label="姓名" />
        <ElTableColumn prop="sex" label="性别" />
        <ElTableColumn prop="grade" label="年级" />
        <ElTableColumn prop="dept" label="系别" />
        <ElTableColumn prop="major" label="专业" />
        <ElTableColumn prop="credit" label="学分" />
      </ElTable>
      <div class="pager">
        <ElPagination background v-model:current-page="filter.page" :default-page-size="20" :page-size="filter.pageSize"
          :total="filter.total" />
      </div>
    </div>
  </div>
  <ElDrawer v-model="drawer" title="添加学生" size="40%">
    <ElForm ref="studentAddFormRef" @submit.prevent="handleAddStu" :rules="studentAddFormRules"
      :model="studentAddFormVal" label-width="auto">
      <ElFormItem label="系别/专业" prop="deptMajor">
        <ElCascader style="width: 100%;" size="large" :options="deptMajorList"
          :props="{ value: 'id', label: 'name', children: 'majors' }" v-model="studentAddFormVal.deptMajor"
          placeholder="请选择系别与专业" />
      </ElFormItem>
      <ElFormItem label="性别" prop="sex">
        <ElRadioGroup v-model="studentAddFormVal.sex">
          <ElRadio value="男">男</ElRadio>
          <ElRadio value="女">女</ElRadio>
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem label="学号" prop="id">
        <ElInput ref="studentAddInp" size="large" :model-value="studentAddFormVal.id" @update:model-value="_fn1">
        </ElInput>
      </ElFormItem>
      <ElFormItem label="姓名" prop="name">
        <ElInput size="large" v-model.trim="studentAddFormVal.name">
        </ElInput>
      </ElFormItem>
      <ElFormItem label="年级" prop="grade">
        <ElInput size="large" type="number" v-model.trim="studentAddFormVal.grade">
        </ElInput>
      </ElFormItem>
      <ElFormItem label="学分" prop="credit">
        <ElInput size="large" type="number" step="0.5" v-model.trim="studentAddFormVal.credit">
        </ElInput>
      </ElFormItem>
      <ElFormItem>
        <ElButton type="primary" size="large" native-type="submit">提交</ElButton>
      </ElFormItem>
    </ElForm>
  </ElDrawer>
</template>

<style lang="less" scoped>
  .student-container {
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
          width: 6.5vw;
        }

        .smaller-form-item {
          width: 4.5vw;
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

      .pager {
        height: 50px;
        padding: 9px;
      }
    }
  }
</style>
