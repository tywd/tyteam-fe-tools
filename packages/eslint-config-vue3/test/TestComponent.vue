<template>
  <!-- 违反规则：组件名使用 kebab-case 而非 PascalCase -->
  <test-component></test-component>

  <!-- 违反规则：属性值未使用双引号 -->
  <div class='test'>
    {{ message }}
  </div>

  <!-- 违反规则：使用 v-html 指令 -->
  <div v-html="htmlContent"></div>
</template>

<script setup>
// 违反规则：prop 未指定类型
const props = defineProps({
  _username: String // 违反规则：prop 名使用 kebab-case 而非 camelCase
});

const message = 'hello';
const htmlContent = '<span>unsafe</span>';
</script>

<!-- 违反规则：组件缺少 name 属性 -->