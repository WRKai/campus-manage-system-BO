<script setup lang="ts">
  import { ElInput } from 'element-plus';
  import { ref, watch } from 'vue';

  // const { prefix, modelValue } = defineProps<{ modelValue: string, prefix?: number, disabled?: boolean }>()

  // const from = ref(prefix?.toString() ?? '')
  // const to = ref('')
  // const order = ref('1')

  // function dealModelValue() {
  //   if (from.value.length == 4) {
  //     emit('update:modelValue', order.value === '1' ? `${from.value}-09` : `${to.value}-03`)
  //   }
  //   else if (from.value.length < 4) {
  //     emit('update:modelValue', to.value = '')
  //   }
  // }

  // function dealFrom(num: string) {
  //   if (num.length > 4)
  //     return
  //   from.value = (num = num.replaceAll(/[^\d]/g, ''))
  //   if (num.length == 4)
  //     to.value = (+num + 1).toString()
  //   dealModelValue()
  // }

  // function dealOrder(num: string) {
  //   num = num.replaceAll(/[^\d]/g, '')
  //   const val = +num
  //   if (val < 1 || val > 2)
  //     return
  //   order.value = num
  //   dealModelValue()
  // }

  // const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()


  // new API
  const { prefix } = defineProps<{ prefix?: number, disabled?: boolean }>()
  defineExpose({
    clear() {
      from.value = ''
      to.value = ''
      order.value = '1'
      modelValue.value = ''
    }
  })


  const from = ref(prefix?.toString() ?? '')
  const to = ref('')
  const order = ref('1')

  const modelValue = defineModel()

  function dealModelValue() {
    if (from.value.length == 4) {
      // emit('update:modelValue', order.value === '1' ? `${from.value}-09` : `${to.value}-03`)
      modelValue.value = order.value === '1' ? `${from.value}-09` : `${to.value}-03`
    }
    else if (from.value.length < 4) {
      // emit('update:modelValue', to.value = '')
      modelValue.value = to.value = ''
    }
  }

  function dealFrom(num: string) {
    if (num.length > 4)
      return
    from.value = (num = num.replaceAll(/[^\d]/g, ''))
    if (num.length == 4)
      to.value = (+num + 1).toString()
    dealModelValue()
  }

  function dealOrder(num: string) {
    num = num.replaceAll(/[^\d]/g, '')
    const val = +num
    if (val < 1 || val > 2)
      return
    order.value = num
    dealModelValue()
  }
</script>

<template>
  <div class="term-select-container">
    <ElInput :disabled size="small" class="inp" :model-value="from" @update:model-value="dealFrom" />
    <div class="text">-</div>
    <ElInput :disabled size="small" class="inp banned" readonly v-model="to" />
    <div class="text">学年第</div>
    <ElInput :disabled size="small" class="small-inp" :model-value="order" @update:model-value="dealOrder" min="1"
      max="2" type="number" />
    <div class="text">学期</div>
  </div>
</template>

<style lang="less" scoped>
  .term-select-container {
    height: fit-content;
    width: fit-content;
    display: flex;
    align-items: center;

    .inp {
      width: 60px;

      &.banned {
        :deep(.el-input__inner) {
          cursor: not-allowed;
        }
      }
    }

    .small-inp {
      width: 50px;
    }

    .text {
      width: fit-content;
    }
  }
</style>
