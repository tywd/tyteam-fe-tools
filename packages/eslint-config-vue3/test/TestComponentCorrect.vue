<template>
  <!-- 违反规则：组件名使用 kebab-case 而非 PascalCase -->
  <TestComponent></TestComponent>

  <!-- 违反规则：属性值未使用双引号 -->
  <div class="test">
    {{ message }}
  </div>

  <!-- 违反规则：使用 v-html 指令 -->
  <!-- <div v-html="htmlContent"></div> -->

  <!-- 若确实需要渲染 HTML（如富文本），可使用更安全的方案（如过滤危险标签 / 属性）： -->
  <!-- 替换 v-html 为安全渲染（需引入过滤库如 DOMPurify） -->
  <div v-text="sanitizedHtml"></div>
</template>

<script setup>
// 违反规则：prop 未指定类型
const props = defineProps({
  userName: String // 违反规则：prop 名使用 kebab-case 而非 camelCase
});

const message = 'hello';

import DOMPurify from 'dompurify';
const htmlContent = '<span>some html</span>';
const sanitizedHtml = DOMPurify.sanitize(htmlContent); // 过滤危险内容
</script>

<!-- 违反规则：组件缺少 name 属性 -->