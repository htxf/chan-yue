<script setup>
</script>

<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" :key="$route.name" />
    </transition>
  </router-view>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
  backface-visibility: hidden;
  transform: translateZ(0);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
