<script setup lang="ts">
  import { ElButton, ElDrawer, ElTree, ElForm, ElInput, ElFormItem, type FormInstance, ElMessage, ElSelect, ElOption, type InputInstance } from 'element-plus';
  import { Plus, Refresh } from '@element-plus/icons-vue';
  import { ref } from 'vue';
  import { useDeptMajorStore, type Dept } from '@/stores/deptMajorStore';
  const deptMajorStore = useDeptMajorStore();
  const data = ref<Dept[]>([]);
  const deptAddInp = ref<InputInstance>()
  async function init() {
    data.value = await deptMajorStore.getList()
  }
  init()
  // 添加系别
  const deptAddVis = ref(false)
  const deptAddFormRef = ref<FormInstance>()
  const deptAddFormVal = ref({ name: '' })
  const deptAddFormRules = ref({
    name: [
      { required: true, message: '请输入系名', trigger: ['blur', 'change'] },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: ['blur', 'change'] }]
  })
  async function deptAdd() {
    const valid = await deptAddFormRef.value?.validate()
    if (!valid)
      return
    await deptMajorStore.addDept(deptAddFormVal.value.name
      + deptAddFormVal.value.name.endsWith('系') ? '' : '系')
    deptAddFormRef.value?.resetFields()
    deptAddVis.value = false
    ElMessage.success('添加成功!')
  }
  // 添加专业
  const majorAddVis = ref(false)
  const majorAddFormRef = ref<FormInstance>()
  const majorAddFormVal = ref<{ name: string, deptId?: number }>({ name: '', deptId: void 0 })
  const majorAddFormRules = ref({
    name: [
      { required: true, message: '请输入系名', trigger: ['blur', 'change'] },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: ['blur', 'change'] }],
    deptId: [
      { required: true, message: '请选择所属系', trigger: ['blur', 'change'] }
    ],
  })
  async function majorAdd() {
    const valid = await majorAddFormRef.value?.validate()
    if (!valid)
      return
    await deptMajorStore.addMajor(majorAddFormVal.value)
    majorAddFormRef.value?.resetFields()
    majorAddVis.value = false
    ElMessage.success('添加成功!')
  }
  // 添加点击事件
  function handleDeptAdd() {
    deptAddVis.value = true
  }
  function handleMajorAdd() {
    majorAddVis.value = true
  }
</script>

<template>
  <div class="major-dept-container">
    <header>
      <ElButton @click="deptMajorStore.fetchDepts" :icon="Refresh" circle />
      <ElButton :icon="Plus" @click="handleDeptAdd">添加系别</ElButton>
      <ElButton type="primary" :icon="Plus" @click="handleMajorAdd">添加专业</ElButton>
    </header>
    <div class="table">
      <ElTree :data :props="{ label: 'name', children: 'majors' }" />
    </div>
  </div>
  <ElDrawer v-model="deptAddVis" class="dept-add" title="添加系别" size="40%" @opened="() => deptAddInp?.focus()">
    <ElForm ref="deptAddFormRef" :rules="deptAddFormRules" :model="deptAddFormVal" @submit.prevent="deptAdd">
      <ElFormItem prop="name" label="系名">
        <ElInput ref="deptAddInp" size="large" v-model.trim="deptAddFormVal.name">
          <template #append>{{ deptAddFormVal.name.endsWith('系') ? ' ' : '系' }}</template>
        </ElInput>
      </ElFormItem>
      <ElFormItem>
        <ElButton size="large" type="primary" native-type="submit">提交</ElButton>
      </ElFormItem>
    </ElForm>
  </ElDrawer>
  <ElDrawer v-model="majorAddVis" class="major-add" title="添加专业" size="40%">
    <ElForm ref="majorAddFormRef" :rules="majorAddFormRules" :model="majorAddFormVal" @submit.prevent="majorAdd">
      <ElFormItem prop="deptId" label="所属系">
        <ElSelect size="large" v-model="majorAddFormVal.deptId" placeholder="请选择所属系">
          <ElOption v-for="d in data" :key="d.id" :label="d.name" :value="d.id" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem prop="name" label="专业名">
        <ElInput size="large" v-model.trim="majorAddFormVal.name" />
      </ElFormItem>
      <ElFormItem>
        <ElButton size="large" type="primary" native-type="submit">提交</ElButton>
      </ElFormItem>
    </ElForm>
  </ElDrawer>
</template>

<style lang="less" scoped>
  .major-dept-container {
    width: 100%;

    header {
      display: block;
      padding: 20px;
      box-sizing: border-box;
      height: 75px;
      width: 100%;
      border-bottom: 1px solid #dcdfe6;
    }

    .table {
      padding: 20px;
      height: calc(100% - 75px);
      overflow-y: scroll;
    }
  }
</style>
