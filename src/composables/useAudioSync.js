/**
 * 音频播放与经文同步 Composable
 * 
 * 使用 requestAnimationFrame 监听播放进度，
 * 二分查找算法定位当前高亮段落。
 */
import { ref, onUnmounted, computed } from 'vue'

export function useAudioSync(paragraphs) {
  const audio = new Audio()
  const currentTime = ref(0)
  const duration = ref(0)
  const isPlaying = ref(false)
  const isLoaded = ref(false)
  const currentParagraphId = ref(-1)

  /** 进度百分比 0-100 */
  const progress = computed(() =>
    duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0
  )

  let rafId = null

  // ---- 二分查找当前段落 ----
  function findCurrentParagraph(time) {
    const ps = paragraphs
    let lo = 0, hi = ps.length - 1, result = -1
    while (lo <= hi) {
      const mid = (lo + hi) >>> 1
      if (ps[mid].startTime <= time) {
        result = mid
        lo = mid + 1
      } else {
        hi = mid - 1
      }
    }
    if (result >= 0 && time < ps[result].endTime) {
      return ps[result].id
    }
    return -1
  }

  // ---- rAF 循环 ----
  function tick() {
    currentTime.value = audio.currentTime
    currentParagraphId.value = findCurrentParagraph(audio.currentTime)
    rafId = requestAnimationFrame(tick)
  }

  function startLoop() {
    if (rafId) return
    rafId = requestAnimationFrame(tick)
  }

  function stopLoop() {
    if (rafId) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  }

  // ---- 公开方法 ----
  function loadAudio(url) {
    audio.src = url
    audio.preload = 'auto'
    audio.addEventListener('loadedmetadata', () => {
      duration.value = audio.duration
      isLoaded.value = true
    })
    audio.addEventListener('ended', () => {
      isPlaying.value = false
      stopLoop()
    })
  }

  function play() {
    audio.play()
    isPlaying.value = true
    startLoop()
  }

  function pause() {
    audio.pause()
    isPlaying.value = false
    stopLoop()
  }

  function toggle() {
    isPlaying.value ? pause() : play()
  }

  function seek(time) {
    audio.currentTime = time
    currentTime.value = time
    currentParagraphId.value = findCurrentParagraph(time)
  }

  /** 按百分比 seek (0-100) */
  function seekByPercent(pct) {
    if (duration.value > 0) {
      seek((pct / 100) * duration.value)
    }
  }

  onUnmounted(() => {
    stopLoop()
    audio.pause()
    audio.src = ''
  })

  return {
    currentTime,
    duration,
    isPlaying,
    isLoaded,
    currentParagraphId,
    progress,
    loadAudio,
    play,
    pause,
    toggle,
    seek,
    seekByPercent,
  }
}
