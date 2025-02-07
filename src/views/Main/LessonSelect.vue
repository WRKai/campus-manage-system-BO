<script setup lang="ts">
  import { getSelectTime, setSelectTime } from '@/apis/lessonSelect';
  import { transformDateTime } from '@/utils';
  import { Delete, Edit, Upload } from '@element-plus/icons-vue';
  import { ElDatePicker, ElButton, ElMessage } from 'element-plus';
  import { nextTick, ref } from 'vue';
  const val = ref<[Date, Date] | undefined>()
  async function init() {
    const res = await getSelectTime()
    val.value = [new Date(res.beginTime), new Date(res.endTime)]
  }
  init()

  const edit = ref(false)
  function handleEdit() {
    edit.value = true
    nextTick(() => {
      (document.querySelector("div.el-date-editor.el-date-editor--datetimerange") as HTMLElement)
        .click()
    })
  }
  async function handleSave() {
    await setSelectTime(
      transformDateTime(val.value![0]),
      transformDateTime(val.value![1])
    )
    ElMessage.success('修改成功!')
    edit.value = false
  }
  function handleDrop() {
    init()
    edit.value = false
  }
</script>

<template>
  <div class="lesson-select-container">
    <h2>当前选课开放时间</h2>
    <div class="picker">
      <ElDatePicker :readonly="!edit" v-model="val" type="datetimerange" range-separator="至" start-placeholder="起始时间"
        end-placeholder="结束时间" />
    </div>
    <div class="ops">
      <ElButton :icon="Edit" round type="primary" :disabled="edit" @click="handleEdit">修改</ElButton>
      <ElButton :icon="Upload" round type="primary" :disabled="!edit" @click="handleSave">保存并提交</ElButton>
      <ElButton :icon="Delete" plain round type="danger" :disabled="!edit" @click="handleDrop">放弃该修改</ElButton>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .lesson-select-container {
    height: 100%;
    width: 100%;
    padding-top: 15vh;
    display: flex;
    flex-direction: column;
    align-items: center;

    h2 {
      margin-bottom: 20px;
    }

    .ops {
      margin-top: 20px;
    }
  }
</style>
