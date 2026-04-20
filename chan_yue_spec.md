【禅阅 (ChanYue) - 核心技术规格书】

产品定位与核心功能

目标：一个极致纯粹、视觉优雅的佛经阅读 Web 应用。无广告、无社交、无繁琐词典。

核心功能：优雅的经文展示（带完美对齐的拼音）、高保真音频播放、音频与当前经文高亮同步（类似舒缓的歌词滚动）。

技术选型与规范

前端框架：Vue 3 (Composition API, <script setup> 语法) + Vite。

样式方案：Tailwind CSS（用于整体布局） + 原生 CSS（专用于打磨字体排版和 <ruby> 标签）。

UI 限制：绝对禁止引入 Element Plus、Ant Design 等任何第三方 UI 组件库。所有 UI 必须手写，保持代码极简和极高的定制性。

核心数据契约 (Data Schema)

经文数据必须严格遵循以下 JSON 结构，用于分离经文、拼音和时间轴：

JSON
{
  "id": "xinjing",
  "title": "般若波罗蜜多心经",
  "author": "唐三藏法师玄奘译",
  "audioUrl": "/audio/xinjing.mp3",
  "paragraphs": [
    {
      "id": 1,
      "startTime": 0.0,
      "endTime": 4.5,
      "lines": [
        [
          {"text": "观", "pinyin": "guān"},
          {"text": "自", "pinyin": "zì"},
          {"text": "在", "pinyin": "zài"},
          {"text": "菩", "pinyin": "pú"},
          {"text": "萨", "pinyin": "sà"}
        ]
      ]
    }
  ]
}
排版美学要求

优先使用系统级优雅中文字体（如宋体 SimSun、楷体 KaiTi 或苹果的 PingFang SC）。

使用 HTML5 原生 <ruby> 和 <rt> 标签实现拼音注音。

核心算法要求 (音频同步)

使用 requestAnimationFrame 监听音频播放进度，并结合二分查找算法确定当前应该高亮的 paragraph。禁止使用 setInterval，以保证动画和性能的平滑。