<template>
  <div class="sub-home">
    <h3><%= projectName %>首页</h3>
    <p>这是一个基于Webpack+Vue3+TypeScript的<%= projectName %>子应用</p>

    <div class="global-state">
      <h4>全局状态展示</h4>
      <p>当前用户：{{ userInfo.name || '未登录' }}</p>
      <button @click="changeGlobalState">修改全局用户信息</button>
    </div>
    <nav>
      <router-link to="/"> <%= projectName %>首页</router-link> &nbsp; &nbsp;
      <router-link to="/project/virtual-list"><%= projectName %>虚拟列表</router-link>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue'

// 获取主应用传递的全局状态方法
const { appContext } = getCurrentInstance()!
const props = appContext.config.globalProperties.$props || {}
const { setGlobalState, onGlobalStateChange } = props

// 本地状态
const userInfo = ref({ name: '' })

// 监听全局状态
onMounted(() => {
  if (onGlobalStateChange) {
    onGlobalStateChange((state: any) => {
      userInfo.value = state.userInfo
    }, true)
  }
})

// 修改全局状态
const changeGlobalState = () => {
  if (setGlobalState) {
    setGlobalState({
      userInfo: {
        name: '张三',
        token: 'sub-app-token-123'
      }
    })
  }
}
</script>

<style scoped>
.sub-home {
  line-height: 1.8;
}

.global-state {
  margin-top: 2rem;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

button {
  margin-top: 0.5rem;
  padding: 0.3rem 0.8rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>