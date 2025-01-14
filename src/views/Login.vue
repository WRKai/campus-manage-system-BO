<script setup lang="ts">
  import { ElForm, ElFormItem, ElInput, ElButton, type FormInstance, type FormRules } from 'element-plus';
  import { Key, User } from '@element-plus/icons-vue'
  import { ref } from 'vue';

  interface Login {
    id: string,
    password: string
  }
  const formRef = ref<FormInstance>()
  const formVal = ref<Login>({
    id: '',
    password: ''
  })
  const rules = ref<FormRules<Login>>({
    id: [
      { required: true, message: '请输入UID', trigger: 'blur' },
      { min: 2, max: 12, message: '用户名长度在 2 到 12 个字符', trigger: ['blur', 'change'] }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 3, max: 20, message: '密码长度应大于3个字符', trigger: ['blur', 'change'] }
    ],
  })
  function dealModelValue(val: string) {
    formVal.value.id = val.replaceAll(/[^\d]/g, '')
  }
  function login() {
    formRef.value?.validate(valid => {
      if (!valid)
        return
    })
  }
</script>

<template>
  <div class="login-form">
    <ElForm ref="formRef" :model="formVal" :rules class="form">
      <ElFormItem class="input" prop="id">
        <ElInput size="large" placeholder="UID" :model-value="formVal.id" @update:model-value="dealModelValue"
          :prefix-icon="User" />
      </ElFormItem>
      <ElFormItem class="input" prop="password">
        <ElInput size="large" placeholder="密码" v-model.trim="formVal.password" show-password type="password"
          :prefix-icon="Key" />
      </ElFormItem>
      <ElFormItem>
        <ElButton type="primary" size="large" @click="login">登录</ElButton>
      </ElFormItem>
    </ElForm>
  </div>
</template>

<style lang="less" scoped>
  .login-form {
    height: 60vh;
    width: 30vw;
    border-radius: 5px;
    box-shadow: 1px 1px 10px #ccc;
    position: absolute;
    top: 50%;
    right: 10%;
    transform: translateY(-50%);

    .form {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .input {
        width: 60%;
      }
    }
  }
</style>
