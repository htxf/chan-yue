<!--
  ModeSelector - 阅读模式切换器
  阅读 / 禅听 两种模式
-->
<script setup>
defineProps({
  mode: String,
})

const emit = defineEmits(['update:mode'])

const modes = [
  { key: 'reading', label: '阅读', icon: '📖' },
  { key: 'listening', label: '禅听', icon: '🔔' },
]
</script>

<template>
  <nav class="mode-selector" id="mode-selector">
    <button
      v-for="m in modes"
      :key="m.key"
      :id="`mode-${m.key}`"
      class="mode-btn"
      :class="{ active: mode === m.key }"
      @click="emit('update:mode', m.key)"
    >
      <span class="mode-icon">{{ m.icon }}</span>
      <span class="mode-label">{{ m.label }}</span>
    </button>
  </nav>
</template>

<style scoped>
.mode-selector {
  display: flex;
  justify-content: center;
  gap: 4px;
  padding: 0 20px 24px;
  animation: fadeIn 1s ease 0.5s both;
}

.mode-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border: 1px solid transparent;
  border-radius: 20px;
  background: transparent;
  color: var(--text-muted);
  font-family: 'Noto Serif SC', serif;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.35s ease;
  letter-spacing: 1px;
}

.mode-btn:hover {
  color: var(--text-primary);
  background: rgba(212, 165, 116, 0.05);
}

.mode-btn.active {
  color: var(--gold);
  border-color: var(--gold-dim);
  background: rgba(212, 165, 116, 0.08);
}

.mode-icon {
  font-size: 14px;
  line-height: 1;
}

.mode-label {
  line-height: 1;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 640px) {
  .mode-btn {
    padding: 6px 14px;
    font-size: 12px;
  }
}
</style>
