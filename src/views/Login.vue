<script setup lang="ts">
  import { ElForm, ElFormItem, ElInput, ElButton, type FormInstance, type FormRules, ElMessage } from 'element-plus';
  import { Key, User } from '@element-plus/icons-vue'
  import { ref } from 'vue';
  import { userLogin } from '@/apis/login';
  import { createNumInpFn, rsaEncrypt } from '@/utils';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '@/stores/userStore';
  import logo from '@/assets/logo.jpg'
  import bottomImg from '@/assets/bottom.jpg'
  const router = useRouter()
  const userStore = useUserStore()
  // 登录按钮状态
  const loginBtnLoading = ref(false)
  const loginBtnDisabled = ref(false)

  // 表单
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
      { required: true, message: '请输入学工号', trigger: 'blur' },
      { max: 12, message: '长度在 1 到 12 个数字', trigger: ['blur', 'change'] }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 3, max: 20, message: '密码长度应大于 3 个字符', trigger: ['blur', 'change'] }
    ],
  })
  function login() {
    formRef.value?.validate(async valid => {
      if (!valid)
        return
      loginBtnLoading.value = true
      try {
        const res = await userLogin({
          id: +formVal.value.id,
          password: rsaEncrypt(formVal.value.password)
        })
        userStore.setUser(res.info)
        userStore.setToken(res.token)
      } catch {
        loginBtnLoading.value = false
        return
      }
      loginBtnLoading.value = false
      loginBtnDisabled.value = true
      ElMessage.success('登录成功')
      setTimeout(() => {
        router.push({ name: 'main' })
      }, 1111);
    })
  }
  // 其它处理
  const _fn = createNumInpFn(formVal.value, 'id')
</script>

<template>
  <div class="login-container">
    <div class="login-form">
      <div class="left-part">
        <img style="height: 20vh;" :src="logo" alt="logo">
        <h1>教务后台管理系统</h1>
        <img style="align-self: flex-start;" :src="bottomImg" alt="bottom">
      </div>
      <div class="right-part">
        <ElForm ref="formRef" :model="formVal" :rules class="form" @submit.prevent="login">
          <ElFormItem class="input" prop="id">
            <ElInput size="large" placeholder="学工号" :model-value="formVal.id" @update:model-value="_fn"
              :prefix-icon="User" />
          </ElFormItem>
          <ElFormItem class="input" prop="password">
            <ElInput size="large" placeholder="密码" v-model.trim="formVal.password" show-password type="password"
              :prefix-icon="Key" />
          </ElFormItem>
          <ElFormItem class="input">
            <ElButton style="width: 100%;" type="primary" size="large" native-type="submit" :loading="loginBtnLoading"
              :disabled="loginBtnDisabled">登录</ElButton>
          </ElFormItem>
        </ElForm>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .login-container {
    height: 100%;
    width: 100%;
    background-image: linear-gradient(to right bottom, #0F6A7B, #98D4DE, );


    .login-form {
      border-radius: 50px 10px 50px 10px;
      overflow: hidden;
      display: flex;
      height: 70vh;
      width: 60vw;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;

      .left-part {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        flex: 1;
        width: 100px;
        height: 100%;
      }

      .right-part {
        flex: 1;
        background-color: rgb(235.9, 245.3, 255);
        border-radius: 50% 0 0 50% / 100% 0 0 100%;

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
    }
  }
</style>
