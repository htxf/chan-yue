<!--
  App.vue - 禅阅根组件
  组装 Header / ModeSelector / Body / Player
  管理模式状态与音频同步
-->
<script setup>
import { ref, onMounted, watch } from 'vue'
import SutraHeader from './components/SutraHeader.vue'
import ModeSelector from './components/ModeSelector.vue'
import SutraBody from './components/SutraBody.vue'
import AudioPlayer from './components/AudioPlayer.vue'
import { useAudioSync } from './composables/useAudioSync.js'
import sutraData from './data/xinjing.json'

/** 当前模式：reading | listening */
const mode = ref('reading')

const {
  currentTime,
  duration,
  isPlaying,
  currentParagraphId,
  progress,
  loadAudio,
  toggle,
  pause,
  seekByPercent,
} = useAudioSync(sutraData.paragraphs)

onMounted(() => {
  loadAudio(sutraData.audioUrl)
})

/* 切换到阅读模式时暂停播放 */
watch(mode, (newMode) => {
  if (newMode === 'reading') {
    pause()
  }
})

/* 点击播放时，自动切换到禅听模式 */
function handleToggle() {
  if (mode.value === 'reading' && !isPlaying.value) {
    mode.value = 'listening'
  }
  toggle()
}
</script>

<template>
  <SutraHeader
    :title="sutraData.title"
    :author="sutraData.author"
  />

  <ModeSelector v-model:mode="mode" />

  <SutraBody
    :paragraphs="sutraData.paragraphs"
    :currentParagraphId="currentParagraphId"
    :currentTime="currentTime"
    :mode="mode"
  />

  <!-- 禅听模式下显示播放条 -->
  <AudioPlayer
    v-if="mode === 'listening'"
    :currentTime="currentTime"
    :duration="duration"
    :isPlaying="isPlaying"
    :progress="progress"
    @toggle="handleToggle"
    @seek="seekByPercent"
  />
</template>
