<script setup lang="ts">
  import { ElInput } from 'element-plus'
  import { ref } from 'vue';
  const modelValue = defineModel<[number, number]>()
  const start = ref('')
  const end = ref('')
  function handleUpdateStart(v: string) {
    start.value = (v = v.replaceAll(/[^\d]/g, ''))
    if (v && end.value)
      modelValue.value = [+v, +end.value]
  }
  function handleUpdateEnd(v: string) {
    end.value = (v = v.replaceAll(/[^\d]/g, ''))
    if (v && start.value)
      modelValue.value = [+start.value, +v]
  }
</script>

<template>
  <div class="week-range-select-container">
    <div class="text">第</div>
    <ElInput size="small" min="1" :model-value="start" @update:model-value="handleUpdateStart" class="inp"
      type="number" />
    <div class="text">周-第</div>
    <ElInput size="small" min="1" :model-value="end" @update:model-value="handleUpdateEnd" class="inp" type="number" />
    <div class="text">周</div>
  </div>
</template>

<style lang="less" scoped>
  .week-range-select-container {
    height: fit-content;
    width: fit-content;
    display: flex;
    align-items: center;

    .inp {
      width: 60px;
    }

    .small-inp {
      width: 50px;
    }

    .text {
      width: fit-content;
    }
  }
</style>
