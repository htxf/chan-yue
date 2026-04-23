<script setup>
import { ref, onMounted, onUnmounted, watch, shallowRef, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SutraHeader from '../components/SutraHeader.vue'
import ModeSelector from '../components/ModeSelector.vue'
import SutraBody from '../components/SutraBody.vue'
import AudioPlayer from '../components/AudioPlayer.vue'
import { useAudioSync } from '../composables/useAudioSync.js'

const route = useRoute()
const router = useRouter()

const bookMeta = shallowRef(null)
const chapterData = shallowRef(null)
const mode = ref('reading')
const showControls = ref(false)
const showDrawer = ref(false)
let hideTimer = null

const bookId = computed(() => route.params.bookId)
const chapterId = computed(() => route.params.chapterId || 'chapter_1')

const paragraphsRef = computed(() => chapterData.value?.paragraphs || [])

const {
  currentTime,
  duration,
  isPlaying,
  currentParagraphId,
  progress,
  loadAudio,
  play,
  toggle,
  pause,
  seekByPercent,
} = useAudioSync(paragraphsRef, {
  onEnded: () => {
    goToNextChapter()
  }
})

// --- Interaction & UI Hide Logic ---
function handleInteraction() {
  if (showDrawer.value) return // Disable auto-hide if drawer is open
  showControls.value = true
  resetHideTimer()
}

function resetHideTimer() {
  if (hideTimer) clearTimeout(hideTimer)
  hideTimer = setTimeout(() => {
    if (!showDrawer.value) {
      showControls.value = false
    }
  }, 3000)
}

function goBack() {
  router.push('/')
}

function toggleDrawer() {
  showDrawer.value = !showDrawer.value
  if (showDrawer.value) {
    if (hideTimer) clearTimeout(hideTimer)
    showControls.value = true
  } else {
    resetHideTimer()
  }
}

function selectChapter(id) {
  showDrawer.value = false
  router.push(`/${bookId.value}/${id}`)
}

function goToNextChapter() {
  if (!bookMeta.value || !bookMeta.value.chapters) return
  const chapters = bookMeta.value.chapters
  const currentIndex = chapters.findIndex(c => (c.id || c.chapterId) === chapterId.value)
  if (currentIndex >= 0 && currentIndex < chapters.length - 1) {
    const nextChapter = chapters[currentIndex + 1]
    selectChapter(nextChapter.id || nextChapter.chapterId)
  }
}

// --- Data Loading ---
async function loadBookData() {
  try {
    const metaModule = await import(`../data/${bookId.value}/index.json`)
    bookMeta.value = metaModule.default || metaModule
  } catch (err) {
    console.error('Failed to load book metadata', err)
    router.push('/')
  }
}

async function loadChapterData() {
  try {
    const chId = chapterId.value
    const dataModule = await import(`../data/${bookId.value}/${chId}.json`)
    chapterData.value = dataModule.default || dataModule
    
    // Check if the current book has a global audioUrl or chapter-specific
    // Prefer chapter specific audio, fallback to book audio
    const audioUrl = chapterData.value.audioUrl || bookMeta.value?.audioUrl
    if (audioUrl) {
      loadAudio(audioUrl)
      // Auto-play next chapter in listening mode
      if (mode.value === 'listening') {
        setTimeout(() => play(), 300)
      }
    } else {
      pause()
      mode.value = 'reading'
    }
  } catch (err) {
    console.error('Failed to load chapter data', err)
  }
}

onMounted(async () => {
  await loadBookData()
  await loadChapterData()
  handleInteraction()
})


onUnmounted(() => {
  if (hideTimer) clearTimeout(hideTimer)
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
  <div class="reader-wrapper" @click="handleInteraction" @touchstart="handleInteraction" @mousemove="handleInteraction">
    
    <!-- Top Controls -->
    <transition name="fade">
      <div v-show="showControls" class="top-bar">
        <button class="control-btn" @click.stop="goBack">
          <span class="icon">←</span> 返回书阁
        </button>
        <button v-if="bookMeta && bookMeta.chapters && bookMeta.chapters.length > 1" class="control-btn" @click.stop="toggleDrawer">
          <span class="icon">☰</span> 目录
        </button>
      </div>
    </transition>

    <!-- Chapter Drawer -->
    <transition name="slide-right">
      <div v-if="showDrawer" class="drawer-overlay" @click.stop="toggleDrawer">
        <div class="drawer-content" @click.stop>
          <div class="drawer-header">
            <h3>目录</h3>
            <button class="close-btn" @click="toggleDrawer">×</button>
          </div>
          <div class="drawer-body">
            <div 
              v-for="chapter in bookMeta.chapters" 
              :key="chapter.id || chapter.chapterId"
              class="chapter-item"
              :class="{ active: (chapter.id || chapter.chapterId) === chapterId }"
              @click="selectChapter(chapter.id || chapter.chapterId)"
            >
              {{ chapter.title }}
            </div>
          </div>
        </div>
      </div>
    </transition>

    <template v-if="bookMeta && chapterData">
      
      <!-- We only show header if it's the first chapter or if chapter has no title, but let's show the book title and chapter title -->
      <SutraHeader
        :title="bookMeta.title"
        :subtitle="chapterData.title"
        :author="bookMeta.author"
      />

      <ModeSelector v-model:mode="mode" />

      <!-- Smooth transition when changing chapters -->
      <transition name="fade-chapter" mode="out-in">
        <SutraBody
          :key="chapterId"
          :paragraphs="chapterData.paragraphs"
          :currentParagraphId="currentParagraphId"
          :currentTime="currentTime"
          :mode="mode"
        />
      </transition>

      <!-- 禅听模式下显示播放条 -->
      <transition name="fade">
        <AudioPlayer
          v-if="mode === 'listening'"
          v-show="showControls"
          :currentTime="currentTime"
          :duration="duration"
          :isPlaying="isPlaying"
          :progress="progress"
          @toggle="handleToggle"
          @seek="seekByPercent"
          class="audio-player-fixed"
          @click.stop="handleInteraction"
        />
      </transition>
    </template>
  </div>
</template>

<style scoped>
.reader-wrapper {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

.top-bar {
  position: fixed;
  top: 20px;
  left: 20px;
  right: 20px;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  pointer-events: none;
}

.control-btn {
  pointer-events: auto;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(212, 175, 55, 0.3);
  color: var(--gold);
  padding: 8px 16px;
  border-radius: 20px;
  font-family: 'Noto Serif SC', serif;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  backdrop-filter: blur(4px);
  transition: all 0.3s ease;
}

.control-btn:hover {
  background: rgba(212, 175, 55, 0.1);
}

/* Drawer */
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 200;
  backdrop-filter: blur(2px);
}

.drawer-content {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 280px;
  background: #111;
  border-left: 1px solid rgba(212, 175, 55, 0.2);
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
}

.drawer-header {
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.drawer-header h3 {
  margin: 0;
  color: var(--gold);
  font-family: 'Noto Serif SC', serif;
  letter-spacing: 4px;
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 24px;
  cursor: pointer;
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 0;
}

.chapter-item {
  padding: 16px 24px;
  color: var(--text-primary);
  font-family: 'Noto Serif SC', serif;
  cursor: pointer;
  transition: background 0.2s;
  letter-spacing: 2px;
}

.chapter-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.chapter-item.active {
  color: var(--gold);
  background: rgba(212, 175, 55, 0.1);
  border-left: 3px solid var(--gold);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: opacity 0.3s ease;
}

.slide-right-enter-active .drawer-content,
.slide-right-leave-active .drawer-content {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-right-enter-from .drawer-content,
.slide-right-leave-to .drawer-content {
  transform: translateX(100%);
}

.slide-right-enter-from,
.slide-right-leave-to {
  opacity: 0;
}

.fade-chapter-enter-active,
.fade-chapter-leave-active {
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.fade-chapter-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-chapter-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.audio-player-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 50;
}
</style>
