<script setup>
import catalog from '../data/catalog.json'
import { useRouter } from 'vue-router'

const router = useRouter()

function goToReader(id) {
  router.push(`/${id}/chapter_1`)
}
</script>

<template>
  <div class="home-container">
    <header class="home-header">
      <div class="ornament">◈</div>
      <h1 class="title">经 书 阁</h1>
      <p class="subtitle">禅思无界，阅心有道</p>
    </header>

    <div class="catalog-grid">
      <div 
        v-for="item in catalog" 
        :key="item.id" 
        class="book-card"
        @click="goToReader(item.id)"
      >
        <div class="card-content">
          <h2 class="book-name">{{ item.name }}</h2>
          <p class="book-cover-text">{{ item.coverText }}</p>
        </div>
        <div class="card-footer">
          <span class="read-btn">翻阅</span>
          <span class="arrow">→</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  min-height: 100vh;
  padding: 60px 20px;
  max-width: 800px;
  margin: 0 auto;
}

.home-header {
  text-align: center;
  margin-bottom: 60px;
  animation: fadeIn 1s ease both;
}

.ornament {
  font-size: 24px;
  color: var(--gold);
  opacity: 0.5;
  margin-bottom: 20px;
  letter-spacing: 16px;
}

.title {
  font-family: 'Noto Serif SC', serif;
  font-size: 32px;
  color: var(--text-primary);
  margin: 0 0 12px;
  letter-spacing: 8px;
}

.subtitle {
  font-family: 'Noto Serif SC', 'KaiTi', serif;
  color: var(--text-muted);
  font-size: 16px;
  letter-spacing: 4px;
}

.catalog-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.book-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(212, 175, 55, 0.1);
  border-radius: 12px;
  padding: 30px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  animation: slideUp 0.8s ease backwards;
}

.book-card:nth-child(1) { animation-delay: 0.1s; }
.book-card:nth-child(2) { animation-delay: 0.2s; }
.book-card:nth-child(3) { animation-delay: 0.3s; }

.book-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.05), transparent);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.book-card:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(212, 175, 55, 0.3);
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
}

.book-card:hover::before {
  opacity: 1;
}

.card-content {
  position: relative;
  z-index: 1;
  flex-grow: 1;
}

.book-name {
  font-family: 'Noto Serif SC', serif;
  font-size: 24px;
  color: var(--text-primary);
  margin: 0 0 16px;
  letter-spacing: 4px;
}

.book-cover-text {
  font-family: 'Noto Serif SC', 'KaiTi', serif;
  color: var(--text-muted);
  font-size: 15px;
  line-height: 1.6;
  letter-spacing: 2px;
}

.card-footer {
  position: relative;
  z-index: 1;
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 20px;
}

.read-btn {
  color: var(--gold);
  font-size: 14px;
  letter-spacing: 4px;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.arrow {
  color: var(--gold);
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

.book-card:hover .read-btn {
  opacity: 1;
}

.book-card:hover .arrow {
  opacity: 1;
  transform: translateX(0);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 640px) {
  .home-container {
    padding: 40px 16px;
  }
  .book-name {
    font-size: 20px;
  }
}
</style>
