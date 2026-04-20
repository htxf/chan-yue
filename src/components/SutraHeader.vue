<script setup>
defineProps({
  title: Array, // [{text, pinyin}]
  author: Array,
})
</script>

<template>
  <header class="sutra-header">
    <div class="ornament">◈</div>
    <h1 class="sutra-title">
      <ruby v-for="(char, i) in title" :key="`t-${i}`">
        {{ char.text }}<rt v-if="char.pinyin">{{ char.pinyin }}</rt>
      </ruby>
    </h1>
    <p class="sutra-author">
      <ruby v-for="(char, i) in author" :key="`a-${i}`">
        <template v-if="char.text !== ' '">{{ char.text }}</template>
        <span v-else>&nbsp;&nbsp;</span>
        <rt v-if="char.pinyin">{{ char.pinyin }}</rt>
      </ruby>
    </p>
    <div class="divider">
      <span class="divider-dot"></span>
      <span class="divider-line"></span>
      <span class="divider-dot"></span>
    </div>
  </header>
</template>

<style scoped>
.sutra-header {
  padding: 60px 20px 40px;
  text-align: center;
  animation: headerFadeIn 1.2s ease both;
}

.ornament {
  font-size: 20px;
  color: var(--gold);
  opacity: 0.4;
  margin-bottom: 16px;
  letter-spacing: 16px;
}

.sutra-title {
  font-family: 'Noto Serif SC', 'SimSun', serif;
  font-weight: 900;
  font-size: 36px;
  letter-spacing: 12px;
  color: var(--text-primary);
  margin: 0 0 16px;
  line-height: 1.8;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2px;
}

.sutra-title ruby {
  margin-right: 6px;
}

.sutra-title rt {
  font-family: var(--font-pinyin);
  font-size: 13px;
  font-weight: 400;
  color: var(--text-primary);
  opacity: 0.85;
  padding-bottom: 2px;
  letter-spacing: 0;
}

.sutra-author {
  font-family: 'Noto Serif SC', 'KaiTi', serif;
  font-size: 15px;
  color: var(--text-muted);
  letter-spacing: 4px;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 2px;
}

.sutra-author ruby {
  margin-right: 2px;
}

.sutra-author rt {
  font-family: var(--font-pinyin);
  font-size: 10px;
  color: var(--text-muted);
  opacity: 1;
  padding-bottom: 2px;
  letter-spacing: 0;
}

.divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 32px;
}

.divider-line {
  width: 80px;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--gold-dim),
    transparent
  );
}

.divider-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--gold-dim);
}

@keyframes headerFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 640px) {
  .sutra-title {
    font-size: 26px;
    letter-spacing: 6px;
  }
  .sutra-header {
    padding: 40px 16px 28px;
  }
}
</style>
