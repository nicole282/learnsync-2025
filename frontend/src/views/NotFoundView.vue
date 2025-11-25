<template>
  <div class="not-found-page">
    <div class="not-found-content">
      <div class="error-code">404</div>
      <h1 class="error-title">页面未找到</h1>
      <p class="error-description">
        抱歉，您访问的页面不存在。可能已被移动或删除。
      </p>
      <div class="action-buttons">
        <router-link to="/dashboard" class="btn btn-primary">
          返回首页
        </router-link>
        <button @click="$router.go(-1)" class="btn btn-outline">
          返回上页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// 404 页面不需要复杂的逻辑
</script>

<style lang="scss" scoped>
.not-found-page {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--space-xl);
}

.not-found-content {
  max-width: 500px;
}

.error-code {
  font-size: 6rem;
  font-weight: 700;
  color: var(--primary-color);
  line-height: 1;
  margin-bottom: var(--space-lg);

  @include mobile {
    font-size: 4rem;
  }
}

.error-title {
  font-size: var(--font-size-2xl);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-md);
}

.error-description {
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--space-xl);
}

.action-buttons {
  display: flex;
  gap: var(--space-md);
  justify-content: center;

  @include mobile {
    flex-direction: column;
    align-items: center;
  }
}
</style>
