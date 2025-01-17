<script setup lang="ts">
  import { ElMenu, ElMenuItem, ElIcon } from 'element-plus';
  import SvgIcon from '@/components/SvgIcon.vue';
  import { ref, watch } from 'vue';
  import { useRoute } from 'vue-router';

  const route = useRoute()
  const activeIdx = ref('/main/majorDept')
  watch(() => route.path,
    nval => activeIdx.value = nval,
    { immediate: true })
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
    </ElMenu>
    <RouterView />
  </div>
</template>

<style lang="less" scoped>
  .main-container {
    display: flex;
    width: 100%;
    height: 100%;

    .menu {
      width: fit-content;
      height: 100%;
    }
  }
</style>
