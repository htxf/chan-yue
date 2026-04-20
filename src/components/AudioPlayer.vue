<!--
  AudioPlayer - 底部固定音频播放控制条
  磨砂玻璃效果，极简禅风设计
-->
<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentTime: Number,
  duration: Number,
  isPlaying: Boolean,
  progress: Number,
})

const emit = defineEmits(['toggle', 'seek'])

/** 格式化时间 mm:ss */
function fmt(sec) {
  if (!sec || isNaN(sec)) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

const timeDisplay = computed(() => `${fmt(props.currentTime)} / ${fmt(props.duration)}`)

/** 进度条点击 seek */
function onProgressClick(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  const pct = ((e.clientX - rect.left) / rect.width) * 100
  emit('seek', Math.max(0, Math.min(100, pct)))
}
</script>

<template>
  <div class="audio-player" id="audio-player">
    <button
      id="play-btn"
      class="play-btn"
      :class="{ playing: isPlaying }"
      @click="emit('toggle')"
      :aria-label="isPlaying ? '暂停' : '播放'"
    >
      <!-- 播放图标 -->
      <svg v-if="!isPlaying" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M8 5v14l11-7z"/>
      </svg>
      <!-- 暂停图标 -->
      <svg v-else viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <rect x="6" y="4" width="4" height="16" rx="1"/>
        <rect x="14" y="4" width="4" height="16" rx="1"/>
      </svg>
    </button>

    <div class="progress-area" @click="onProgressClick">
      <div class="progress-track">
        <div
          class="progress-fill"
          :style="{ width: `${progress}%` }"
        ></div>
        <div
          class="progress-thumb"
          :style="{ left: `${progress}%` }"
        ></div>
      </div>
    </div>

    <span class="time-display">{{ timeDisplay }}</span>
  </div>
</template>

<style scoped>
.audio-player {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  background: rgba(10, 10, 15, 0.8);
  backdrop-filter: blur(24px) saturate(1.4);
  -webkit-backdrop-filter: blur(24px) saturate(1.4);
  border-top: 1px solid rgba(212, 165, 116, 0.08);
}

.play-btn {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1.5px solid var(--gold-dim);
  background: rgba(212, 165, 116, 0.08);
  color: var(--gold);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.play-btn:hover {
  background: rgba(212, 165, 116, 0.15);
  border-color: var(--gold-muted);
  transform: scale(1.05);
}

.play-btn:active {
  transform: scale(0.95);
}

.play-btn.playing {
  border-color: var(--gold);
  background: rgba(212, 165, 116, 0.12);
}

.progress-area {
  flex: 1;
  padding: 8px 0;
  cursor: pointer;
}

.progress-track {
  position: relative;
  height: 3px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 2px;
  overflow: visible;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--gold-dim), var(--gold));
  border-radius: 2px;
  transition: width 0.1s linear;
}

.progress-thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%) scale(0);
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--gold);
  transition: transform 0.2s ease;
  box-shadow: 0 0 8px rgba(212, 165, 116, 0.4);
}

.progress-area:hover .progress-thumb {
  transform: translate(-50%, -50%) scale(1);
}

.time-display {
  flex-shrink: 0;
  font-family: 'Noto Serif SC', monospace;
  font-size: 12px;
  color: var(--text-muted);
  min-width: 80px;
  text-align: right;
  letter-spacing: 0.5px;
}

@media (max-width: 640px) {
  .audio-player {
    padding: 12px 16px;
    gap: 12px;
  }
  .play-btn {
    width: 38px;
    height: 38px;
  }
  .time-display {
    font-size: 11px;
    min-width: 65px;
  }
}
</style>
