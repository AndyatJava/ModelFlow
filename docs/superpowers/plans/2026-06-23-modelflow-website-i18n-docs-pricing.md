# ModelFlow 官网：年付定价、操作手册与多语言支持实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 改造 ModelFlow 官网，实现首页 8 语言国际化、Pro 定价月/年切换，并新增 8 语言站内操作手册。

**Architecture：** 使用原生 JS 维护一个 `translations` 对象，通过 `data-i18n` 属性在首页渲染多语言文本；定价区通过 JS 切换显示月付/年付价格；操作手册为每语言独立的静态 HTML 页面，共享一套文档样式与布局模板。

**Tech Stack：** HTML5、CSS3、原生 JavaScript（无框架/无构建工具）。

## Global Constraints

- 8 种语言：`en / zh-CN / zh-TW / ja / ko / de / fr / es`。
- 定价：月付 `$9.99/month`，年付 `$99.99/year`（Save 17%）。
- 截图来源：`C:\Users\majin\multi-agent-platform\store-assets\screenshots\{lang}\` 与 `C:\Users\majin\multi-agent-platform\copyright-registration\screenshots\`。
- 无新增外部依赖，继续使用 Google Fonts（Inter）。
- 所有新文件路径使用正斜杠；本地复制操作使用 OS 路径。
- 若某语言翻译/截图缺失，回退到 `en`。

---

## File Structure

```
.
├── index.html                          # 首页：增加 data-i18n、语言选择器、定价切换
├── css/
│   └── styles.css                      # 新增语言选择器、定价切换、文档页样式
├── js/
│   ├── main.js                         # 增加语言选择器事件、定价切换事件
│   └── i18n.js                         # 新增：翻译数据与渲染逻辑
├── docs/
│   ├── index.html                      # 文档入口：JS 重定向 + 无 JS 手动链接
│   ├── en/index.html                   # 英文操作手册
│   ├── zh-CN/index.html                # 简体中文操作手册
│   ├── zh-TW/index.html                # 繁體中文操作手册
│   ├── ja/index.html                   # 日文操作手册
│   ├── ko/index.html                   # 韩文操作手册
│   ├── de/index.html                   # 德文操作手册
│   ├── fr/index.html                   # 法文操作手册
│   ├── es/index.html                   # 西班牙文操作手册
│   └── assets/
│       └── screenshots/
│           ├── en/01-chat.png
│           ├── en/02-models.png
│           ├── en/03-workflow.png
│           ├── en/04-calllog.png
│           ├── common/05-memory.png
│           ├── common/06-skills.png
│           └── common/07-workspace.png
│           └── ...（其余 7 种语言对应截图）
└── docs/superpowers/plans/
    └── 2026-06-23-modelflow-website-i18n-docs-pricing.md
```

---

## Task 1: 创建 `js/i18n.js` 翻译引擎

**Files:**
- Create: `js/i18n.js`
- Modify: `index.html`（引入脚本）

**Interfaces:**
- Consumes: 无
- Produces: 全局 `window.I18n` 对象，暴露 `setLanguage(lang)`、`getLanguage()`、`t(key)`、`render()`。

- [ ] **Step 1: 创建 `js/i18n.js` 骨架**

```js
const DEFAULT_LANG = 'en';
const STORAGE_KEY = 'modelflow-lang';

const translations = {
  en: {
    nav: {
      features: 'Features',
      plugins: 'Plugins',
      pricing: 'Pricing',
      docs: 'Docs',
      download: 'Download',
    },
    hero: {
      tagline: 'Now in Microsoft Store',
      title: 'One Workspace.<br />Every Model.',
      subtitle: 'Bring all your AI models together. Chat with text, image, video, and audio models; run local CLI commands; build automations; and extend everything via plugins — all from one local-first desktop app.',
      ctaPrimary: 'Get ModelFlow Free',
      ctaSecondary: 'See Features',
      trust: 'Free download · 7-day Pro trial · Local-first',
    },
    features: {
      title: 'Built for model orchestration',
      subtitle: 'Everything you need to manage, switch, and chain AI models in one desktop workspace.',
      modelsTitle: 'All Your Models, One Config',
      modelsDesc: 'Connect text, image, video, and audio models — OpenAI, DeepSeek, Kimi, Qwen, Anthropic, Ollama, Wanx, Vidu, Kling, and more. Set roles, context windows, and cost limits per model.',
      mentionTitle: 'Mention to Switch',
      mentionDesc: 'Type <code>@</code> in any conversation to route the next reply to the right model. No tab switching, no copy-paste — just ask the best model for the job.',
      workflowTitle: 'Build Workflows That Ship',
      workflowDesc: 'Drag, connect, and run multi-model pipelines in a visual node editor. Add command nodes to execute local CLI tools, branch on conditions, and chain reasoning into reusable automations.',
    },
    capabilities: {
      title: 'More capabilities',
      subtitle: 'ModelFlow is built to handle the full spectrum of AI work — not just text chat.',
      cliTitle: 'Local CLI Execution',
      cliDesc: 'Models can invoke local commands, read files, and list directories. Run <code>/tool</code> in chat or wire command nodes into workflows.',
      mediaTitle: 'Image, Video & Audio',
      mediaDesc: 'Generate images, videos, and audio with providers like DALL·E, Stable Diffusion, Wanx, Vidu, Kling, Pika, Runway, and TTS models.',
      browserTitle: 'Browser Companion',
      browserDesc: 'Capture web pages and send them into ModelFlow with one click. Bring live context from your browser straight into chat and workflows.',
      pluginTitle: 'Open Plugin System',
      pluginDesc: 'Extend ModelFlow with verified plugins or build your own. Package tools, commands, and integrations that every model can call.',
    },
    plugins: {
      title: 'Extend ModelFlow Your Way',
      subtitle: 'Verified plugins and an open community for developers who want to add tools, commands, and integrations that every model can call.',
      verifiedTitle: 'Verified Plugins',
      verifiedDesc: 'Curated and security-reviewed plugins that just work out of the box. Search, code execution, file handling, and more.',
      verifiedLink: 'Browse verified plugins →',
      communityTitle: 'Plugin Community',
      communityDesc: 'Browse, share, and build plugins with other developers. Docs and discussions live on GitHub Wiki.',
      communityLink: 'Join the community →',
    },
    pricing: {
      title: 'Simple Pricing',
      subtitle: 'Start free. Upgrade when you need more models, advanced workflows, and official plugins.',
      monthly: 'Monthly',
      yearly: 'Yearly',
      saveBadge: 'Save 17%',
      freeName: 'Free',
      freeDesc: 'For individuals getting started.',
      freePrice: '$0',
      freeFeature1: 'Unlimited local conversations',
      freeFeature2: 'Up to 3 model configurations',
      freeFeature3: 'Text, image, video & audio models',
      freeFeature4: 'Basic workflows & CLI commands',
      freeFeature5: 'Community plugins',
      freeBtn: 'Download Free',
      proName: 'Pro',
      proDesc: 'For power users and teams.',
      proMonthlyPrice: '$9.99<span>/month</span>',
      proYearlyPrice: '$99.99<span>/year</span>',
      proYearlyBilling: 'billed annually · save 17%',
      proMonthlyBilling: 'billed monthly',
      proFeature1: 'Unlimited model configurations',
      proFeature2: 'Advanced workflows with variables & conditions',
      proFeature3: 'Verified plugins & tool calling',
      proFeature4: 'Call log export & advanced analytics',
      proFeature5: 'Priority support',
      proMonthlyBtn: 'Start 7-Day Free Trial',
      proYearlyBtn: 'Start 7-Day Free Trial — Save 17%',
      popularBadge: 'Most Popular',
    },
    cta: {
      title: 'Ready to orchestrate your AI team?',
      subtitle: 'Download ModelFlow from the Microsoft Store and start your 7-day Pro trial today.',
      btn: 'Get it on Microsoft Store',
    },
    footer: {
      tagline: 'One workspace for every AI model.',
      product: 'Product',
      resources: 'Resources',
      legal: 'Legal',
      privacy: 'Privacy',
      copyright: '© 2026 ModelFlow. All rights reserved.',
    },
    lang: {
      en: 'English',
      'zh-CN': '简体中文',
      'zh-TW': '繁體中文',
      ja: '日本語',
      ko: '한국어',
      de: 'Deutsch',
      fr: 'Français',
      es: 'Español',
    },
  },
  // Add complete translation objects for zh-CN, zh-TW, ja, ko, de, fr, es below,
  // using the same nested keys as the en object above.
};

function getBrowserLanguage() {
  const navLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
  const supported = Object.keys(translations);
  if (supported.includes(navLang)) return navLang;
  // 处理 zh-cn / zh-tw 等大小写
  const normalized = supported.find((l) => l.toLowerCase() === navLang);
  if (normalized) return normalized;
  // 简写匹配，如 'zh' -> 'zh-CN'
  const prefix = supported.find((l) => l.toLowerCase().startsWith(navLang + '-'));
  if (prefix) return prefix;
  return DEFAULT_LANG;
}

function getInitialLanguage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && translations[stored]) return stored;
  } catch (e) {
    // ignore
  }
  return getBrowserLanguage();
}

function resolveKey(obj, keyPath) {
  return keyPath.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
}

const I18n = {
  current: getInitialLanguage(),

  setLanguage(lang) {
    if (!translations[lang]) {
      console.warn(`[I18n] Unsupported language: ${lang}, falling back to ${DEFAULT_LANG}`);
      lang = DEFAULT_LANG;
    }
    this.current = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      // ignore
    }
    this.render();
    document.documentElement.lang = lang;
    window.dispatchEvent(new CustomEvent('modelflow:languagechange', { detail: { lang } }));
  },

  getLanguage() {
    return this.current;
  },

  t(key, fallback) {
    const value = resolveKey(translations[this.current], key);
    if (value !== undefined) return value;
    const defaultValue = resolveKey(translations[DEFAULT_LANG], key);
    if (defaultValue !== undefined) return defaultValue;
    if (fallback !== undefined) return fallback;
    console.warn(`[I18n] Missing key: ${key}`);
    return key;
  },

  render() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const value = this.t(key);
      if (el.hasAttribute('data-i18n-html')) {
        el.innerHTML = value;
      } else {
        el.textContent = value;
      }
    });

    // 更新 <title> 和 meta description
    const title = this.t('meta.title', 'ModelFlow — One Workspace. Every Model.');
    const desc = this.t('meta.description', 'Chat with text, image, video, and audio models. Run local CLI commands, build visual workflows, and extend via plugins — all in one local-first AI workspace.');
    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', desc);
  },
};

window.I18n = I18n;
```

- [ ] **Step 2: 补充其余 7 种语言翻译数据**

在 `js/i18n.js` 的 `translations` 对象中，为 `zh-CN`、`zh-TW`、`ja`、`ko`、`de`、`fr`、`es` 分别添加与 `en` 完全相同的键结构，并翻译为对应语言。所有 HTML 内容（`hero.title`、`pricing.proMonthlyPrice` 等）保留标签。

- [ ] **Step 3: 在 `index.html` 底部引入 `i18n.js`**

```html
<script src="js/i18n.js"></script>
<script src="js/main.js"></script>
```

- [ ] **Step 4: 在 `index.html` 加载时初始化语言**

在 `js/i18n.js` 末尾追加：

```js
document.addEventListener('DOMContentLoaded', () => {
  I18n.render();
});
```

- [ ] **Step 5: 本地验证**

Run: `python -m http.server 8000`  
Open: http://localhost:8000  
Expected: 页面以英文默认加载，控制台无 `[I18n] Missing key` 警告。

- [ ] **Step 6: Commit**

```bash
git add js/i18n.js index.html
git commit -m "feat(i18n): add translation engine and 8-language data"
```

---

## Task 2: 改造 `index.html` 支持 `data-i18n` 与语言选择器

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: `window.I18n`
- Produces: 首页所有可翻译文本使用 `data-i18n` 标记；导航栏出现语言选择器。

- [ ] **Step 1: 给所有文本元素添加 `data-i18n` 属性**

按以下映射为首页文本添加 `data-i18n`（保留原有 fallback 文本）：

| 元素 | `data-i18n` | 是否 HTML |
| --- | --- | --- |
| 导航 Features | `nav.features` | 否 |
| 导航 Plugins | `nav.plugins` | 否 |
| 导航 Pricing | `nav.pricing` | 否 |
| 导航 Docs | `nav.docs` | 否 |
| 下载按钮 | `nav.download` | 否 |
| hero tagline | `hero.tagline` | 否 |
| hero title | `hero.title` | 是（保留 `<br />`） |
| hero subtitle | `hero.subtitle` | 否 |
| hero 主按钮 | `hero.ctaPrimary` | 否 |
| hero 次按钮 | `hero.ctaSecondary` | 否 |
| hero trust | `hero.trust` | 否 |
| features title | `features.title` | 否 |
| ...（按相同模式处理所有 section） | ... | ... |

示例：

```html
<h1 class="hero-title" data-i18n="hero.title" data-i18n-html>
  One Workspace.<br />Every Model.
</h1>
```

- [ ] **Step 2: 在导航栏添加语言选择器**

在 `.nav-cta` 内 Download 按钮之前插入：

```html
<div class="lang-select" id="lang-select">
  <button type="button" class="lang-select-trigger" id="lang-select-trigger" aria-haspopup="listbox" aria-expanded="false">
    <span id="lang-select-current">English</span>
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
  </button>
  <ul class="lang-select-dropdown" id="lang-select-dropdown" role="listbox" aria-label="Select language">
    <li role="option" data-lang="en" tabindex="0">English</li>
    <li role="option" data-lang="zh-CN" tabindex="0">简体中文</li>
    <li role="option" data-lang="zh-TW" tabindex="0">繁體中文</li>
    <li role="option" data-lang="ja" tabindex="0">日本語</li>
    <li role="option" data-lang="ko" tabindex="0">한국어</li>
    <li role="option" data-lang="de" tabindex="0">Deutsch</li>
    <li role="option" data-lang="fr" tabindex="0">Français</li>
    <li role="option" data-lang="es" tabindex="0">Español</li>
  </ul>
</div>
```

- [ ] **Step 3: 更新 `<html lang>` 默认值**

```html
<html lang="en">
```

保持不变；`i18n.js` 会在初始化时更新为当前语言。

- [ ] **Step 4: 本地验证**

Run: `python -m http.server 8000`  
Open: http://localhost:8000  
Expected:
- 页面英文文本正常显示。
- 导航栏出现语言下拉，包含 8 个选项。
- 切换语言后所有 `data-i18n` 元素文本变化。

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat(i18n): add data-i18n markers and language selector to homepage"
```

---

## Task 3: 实现语言选择器交互

**Files:**
- Modify: `js/main.js`

**Interfaces:**
- Consumes: `window.I18n`
- Produces: 语言下拉可点击切换；点击外部关闭；支持键盘 Escape。

- [ ] **Step 1: 在 `main.js` 中添加语言选择器逻辑**

```js
function initLanguageSelector() {
  const trigger = document.getElementById('lang-select-trigger');
  const dropdown = document.getElementById('lang-select-dropdown');
  const current = document.getElementById('lang-select-current');

  if (!trigger || !dropdown) return;

  function updateCurrentLabel() {
    if (current && window.I18n) {
      current.textContent = window.I18n.t(`lang.${window.I18n.getLanguage()}`);
    }
  }

  function toggle(open) {
    dropdown.classList.toggle('open', open);
    trigger.setAttribute('aria-expanded', String(open));
  }

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dropdown.classList.contains('open');
    toggle(!isOpen);
  });

  dropdown.querySelectorAll('[data-lang]').forEach((item) => {
    item.addEventListener('click', () => {
      const lang = item.getAttribute('data-lang');
      if (window.I18n) {
        window.I18n.setLanguage(lang);
      }
      updateCurrentLabel();
      toggle(false);
    });
  });

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && e.target !== trigger) {
      toggle(false);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggle(false);
  });

  window.addEventListener('modelflow:languagechange', updateCurrentLabel);
  updateCurrentLabel();
}
```

- [ ] **Step 2: 在 `DOMContentLoaded` 中调用**

```js
document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initScrollSpy();
  initLanguageSelector();
  initPricingToggle();
});
```

- [ ] **Step 3: 本地验证**

Run: `python -m http.server 8000`  
Open: http://localhost:8000  
Expected:
- 点击语言选择器展开 8 个选项。
- 选择语言后页面文本切换，当前语言标签更新。
- 点击外部或按 Escape 下拉关闭。
- 刷新页面后语言保持。

- [ ] **Step 4: Commit**

```bash
git add js/main.js
git commit -m "feat(i18n): wire up language selector interactions"
```

---

## Task 4: 添加语言选择器与文档样式

**Files:**
- Modify: `css/styles.css`

**Interfaces:**
- Consumes: 现有 CSS 变量
- Produces: `.lang-select`、`.lang-select-dropdown`、`.pricing-toggle`、`.docs-*` 样式。

- [ ] **Step 1: 添加语言选择器样式**

```css
.lang-select {
  position: relative;
}

.lang-select-trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  color: var(--text-primary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.lang-select-trigger:hover {
  border-color: var(--accent);
}

.lang-select-dropdown {
  display: none;
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 160px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.35);
  list-style: none;
  padding: 6px;
  z-index: 1001;
}

.lang-select-dropdown.open {
  display: block;
}

.lang-select-dropdown li {
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--text-secondary);
  transition: background 0.2s ease, color 0.2s ease;
}

.lang-select-dropdown li:hover,
.lang-select-dropdown li:focus {
  background: rgba(46, 127, 247, 0.12);
  color: var(--text-primary);
  outline: none;
}

@media (max-width: 768px) {
  .lang-select-dropdown {
    right: auto;
    left: 0;
  }
}
```

- [ ] **Step 2: 添加定价切换样式**

```css
.pricing-toggle {
  display: inline-flex;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 4px;
  margin-bottom: 20px;
}

.pricing-toggle-btn {
  padding: 8px 16px;
  border-radius: 999px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.pricing-toggle-btn.active {
  background: var(--cta);
  color: #0B0C0F;
}

.pricing-save {
  display: inline-block;
  margin-left: 8px;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(245, 166, 35, 0.15);
  color: var(--cta);
  font-size: 0.75rem;
  font-weight: 700;
}
```

- [ ] **Step 3: 调整导航栏布局以容纳语言选择器**

确保 `.nav-cta` 的 gap 足够：

```css
.nav-cta {
  display: flex;
  align-items: center;
  gap: 12px;
}
```

- [ ] **Step 4: 本地验证**

Run: `python -m http.server 8000`  
Open: http://localhost:8000  
Expected:
- 语言下拉有正确的暗色样式和悬停效果。
- 导航栏在桌面端和移动端均不溢出。

- [ ] **Step 5: Commit**

```bash
git add css/styles.css
git commit -m "feat(styles): add language selector and pricing toggle styles"
```

---

## Task 5: 实现 Pro 定价月/年切换

**Files:**
- Modify: `index.html`（定价区）
- Modify: `js/main.js`
- Modify: `css/styles.css`（已在 Task 4 添加）

**Interfaces:**
- Consumes: `window.I18n`
- Produces: 点击 Monthly/Yearly 切换 Pro 价格、副标题、按钮文案和 Save 17% 角标。

- [ ] **Step 1: 改造 `index.html` Pro 卡片**

将 Pro 卡片替换为：

```html
<article class="pricing-card pricing-card-popular" data-pricing-card="pro">
  <span class="pricing-badge" data-i18n="pricing.popularBadge">Most Popular</span>
  <span class="pricing-save" id="pricing-save" data-i18n="pricing.saveBadge" style="display: none;">Save 17%</span>
  <h3 class="pricing-name" data-i18n="pricing.proName">Pro</h3>
  <p class="pricing-desc" data-i18n="pricing.proDesc">For power users and teams.</p>

  <div class="pricing-toggle">
    <button type="button" class="pricing-toggle-btn active" data-billing="monthly" data-i18n="pricing.monthly">Monthly</button>
    <button type="button" class="pricing-toggle-btn" data-billing="yearly" data-i18n="pricing.yearly">Yearly</button>
  </div>

  <div class="pricing-price" id="pro-price" data-i18n="pricing.proMonthlyPrice" data-i18n-html>$9.99<span>/month</span></div>
  <p class="pricing-billing" id="pro-billing" data-i18n="pricing.proMonthlyBilling">billed monthly</p>

  <ul class="pricing-features">
    <li data-i18n="pricing.proFeature1">Unlimited model configurations</li>
    <li data-i18n="pricing.proFeature2">Advanced workflows with variables &amp; conditions</li>
    <li data-i18n="pricing.proFeature3">Verified plugins &amp; tool calling</li>
    <li data-i18n="pricing.proFeature4">Call log export &amp; advanced analytics</li>
    <li data-i18n="pricing.proFeature5">Priority support</li>
  </ul>

  <a class="btn btn-cta pricing-btn" id="pro-btn" href="https://apps.microsoft.com/detail/9PKVZ235H6TD?hl=en-us&gl=CN&ocid=pdpshare" target="_blank" rel="noopener" data-i18n="pricing.proMonthlyBtn">Start 7-Day Free Trial</a>
</article>
```

Free 卡片保持不变，仅添加 `data-i18n` 属性。

- [ ] **Step 2: 在 `js/main.js` 实现 `initPricingToggle`**

```js
function initPricingToggle() {
  const card = document.querySelector('[data-pricing-card="pro"]');
  if (!card) return;

  const buttons = card.querySelectorAll('[data-billing]');
  const priceEl = document.getElementById('pro-price');
  const billingEl = document.getElementById('pro-billing');
  const btnEl = document.getElementById('pro-btn');
  const saveEl = document.getElementById('pricing-save');

  function applyBilling(billing) {
    buttons.forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-billing') === billing);
    });

    if (!window.I18n) return;

    if (billing === 'yearly') {
      priceEl.setAttribute('data-i18n', 'pricing.proYearlyPrice');
      billingEl.setAttribute('data-i18n', 'pricing.proYearlyBilling');
      btnEl.setAttribute('data-i18n', 'pricing.proYearlyBtn');
      if (saveEl) saveEl.style.display = 'inline-block';
    } else {
      priceEl.setAttribute('data-i18n', 'pricing.proMonthlyPrice');
      billingEl.setAttribute('data-i18n', 'pricing.proMonthlyBilling');
      btnEl.setAttribute('data-i18n', 'pricing.proMonthlyBtn');
      if (saveEl) saveEl.style.display = 'none';
    }

    window.I18n.render();
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const billing = btn.getAttribute('data-billing');
      applyBilling(billing);
    });
  });
}
```

- [ ] **Step 3: 本地验证**

Run: `python -m http.server 8000`  
Open: http://localhost:8000#pricing  
Expected:
- 默认显示 Monthly：`$9.99/month`、`billed monthly`。
- 点击 Yearly 后显示：`$99.99/year`、`billed annually · save 17%`、“Save 17%” 角标出现。
- 按钮文案同步变化。
- 切换语言后，再切换 Monthly/Yearly，文案仍正确。

- [ ] **Step 4: Commit**

```bash
git add index.html js/main.js
git commit -m "feat(pricing): add monthly/yearly toggle on Pro plan"
```

---

## Task 6: 创建文档页基础结构与入口

**Files:**
- Create: `docs/index.html`
- Create: `docs/assets/screenshots/` 目录

**Interfaces:**
- Consumes: 无
- Produces: `docs/index.html` 作为文档入口；8 个语言子目录待用。

- [ ] **Step 1: 创建 `docs/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ModelFlow Documentation</title>
  <meta name="description" content="ModelFlow user guide and documentation." />
  <script>
    (function () {
      var supported = ['en', 'zh-CN', 'zh-TW', 'ja', 'ko', 'de', 'fr', 'es'];
      var stored;
      try { stored = localStorage.getItem('modelflow-lang'); } catch (e) {}
      var lang = stored || (navigator.language || 'en');
      var match = supported.find(function (l) { return l.toLowerCase() === lang.toLowerCase(); });
      if (!match) match = supported.find(function (l) { return lang.toLowerCase().indexOf(l.toLowerCase() + '-') === 0; });
      if (!match) match = 'en';
      window.location.replace('./' + match + '/index.html');
    })();
  </script>
</head>
<body>
  <main style="display:flex;align-items:center;justify-content:center;min-height:100vh;background:#0B0C0F;color:#F5F7FA;font-family:system-ui,sans-serif;text-align:center;">
    <div>
      <h1>ModelFlow Documentation</h1>
      <p>Choose your language:</p>
      <ul style="list-style:none;padding:0;display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">
        <li><a href="./en/index.html" style="color:#2E7FF7;">English</a></li>
        <li><a href="./zh-CN/index.html" style="color:#2E7FF7;">简体中文</a></li>
        <li><a href="./zh-TW/index.html" style="color:#2E7FF7;">繁體中文</a></li>
        <li><a href="./ja/index.html" style="color:#2E7FF7;">日本語</a></li>
        <li><a href="./ko/index.html" style="color:#2E7FF7;">한국어</a></li>
        <li><a href="./de/index.html" style="color:#2E7FF7;">Deutsch</a></li>
        <li><a href="./fr/index.html" style="color:#2E7FF7;">Français</a></li>
        <li><a href="./es/index.html" style="color:#2E7FF7;">Español</a></li>
      </ul>
    </div>
  </main>
</body>
</html>
```

- [ ] **Step 2: 创建截图目录结构**

Run:

```bash
mkdir -p docs/assets/screenshots/en docs/assets/screenshots/zh-CN docs/assets/screenshots/zh-TW docs/assets/screenshots/ja docs/assets/screenshots/ko docs/assets/screenshots/de docs/assets/screenshots/fr docs/assets/screenshots/es docs/assets/screenshots/common
```

- [ ] **Step 3: 本地验证**

Run: `python -m http.server 8000`  
Open: http://localhost:8000/docs/  
Expected: 重定向到 `./en/index.html`（当前该文件不存在，会 404，这是预期行为）。

- [ ] **Step 4: Commit**

```bash
git add docs/index.html docs/assets
git commit -m "feat(docs): add documentation entry point and screenshot directories"
```

---

## Task 7: 复制截图到文档资源目录

**Files:**
- Create: `docs/assets/screenshots/{lang}/*.png`
- Create: `docs/assets/screenshots/common/*.png`

**Interfaces:**
- Consumes: 源截图路径
- Produces: 文档站可用截图

- [ ] **Step 1: 复制 8 语言主截图**

Run:

```bash
cp "C:/Users/majin/multi-agent-platform/store-assets/screenshots/en/01-chat.png" docs/assets/screenshots/en/
cp "C:/Users/majin/multi-agent-platform/store-assets/screenshots/en/02-models.png" docs/assets/screenshots/en/
cp "C:/Users/majin/multi-agent-platform/store-assets/screenshots/en/03-workflow.png" docs/assets/screenshots/en/
cp "C:/Users/majin/multi-agent-platform/store-assets/screenshots/en/04-calllog.png" docs/assets/screenshots/en/

# 对 zh-CN, zh-TW, ja, ko, de, fr, es 重复以上 4 条命令
```

- [ ] **Step 2: 复制通用截图**

Run:

```bash
cp "C:/Users/majin/multi-agent-platform/copyright-registration/screenshots/05-memory.png" docs/assets/screenshots/common/
cp "C:/Users/majin/multi-agent-platform/copyright-registration/screenshots/06-skills.png" docs/assets/screenshots/common/
cp "C:/Users/majin/multi-agent-platform/copyright-registration/screenshots/07-workspace.png" docs/assets/screenshots/common/
```

- [ ] **Step 3: 验证截图存在**

Run:

```bash
ls docs/assets/screenshots/*/
```

Expected: 每个语言目录下有 `01-chat.png`、`02-models.png`、`03-workflow.png`、`04-calllog.png`；`common` 目录下有 `05-memory.png`、`06-skills.png`、`07-workspace.png`。

- [ ] **Step 4: Commit**

```bash
git add docs/assets
git commit -m "feat(docs): copy localized and common screenshots"
```

---

## Task 8: 创建文档页模板与样式

**Files:**
- Create: `docs/en/index.html`（作为模板参考）
- Modify: `css/styles.css`（添加文档页样式）

**Interfaces:**
- Consumes: 无
- Produces: 英文操作手册页面 + 文档页通用样式。

- [ ] **Step 1: 创建 `docs/en/index.html` 模板**

页面结构：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ModelFlow User Guide — English</title>
  <meta name="description" content="Learn how to use ModelFlow: models, chat, workflows, plugins, CLI tools, call log, and settings." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../../css/styles.css" />
</head>
<body class="docs-body">
  <nav class="navbar docs-navbar">
    <div class="container">
      <a href="../../index.html" class="nav-brand">
        <img src="../../assets/logo.png" alt="ModelFlow logo" />
        <span>ModelFlow</span>
      </a>
      <div class="docs-lang-nav">
        <a href="../zh-CN/index.html">简体中文</a>
        <a href="../zh-TW/index.html">繁體中文</a>
        <a href="../ja/index.html">日本語</a>
        <a href="../ko/index.html">한국어</a>
        <a href="../de/index.html">Deutsch</a>
        <a href="../fr/index.html">Français</a>
        <a href="../es/index.html">Español</a>
      </div>
    </div>
  </nav>

  <div class="docs-layout container">
    <aside class="docs-sidebar">
      <ul>
        <li><a href="#quick-start">Quick Start</a></li>
        <li><a href="#models">Model Management</a></li>
        <li><a href="#chat">Chat &amp; @ Mentions</a></li>
        <li><a href="#workflows">Workflows</a></li>
        <li><a href="#plugins">Plugins</a></li>
        <li><a href="#cli-tools">Local CLI &amp; Tools</a></li>
        <li><a href="#call-log">Call Log &amp; Cost</a></li>
        <li><a href="#settings">Settings &amp; Privacy</a></li>
      </ul>
    </aside>

    <main class="docs-main">
      <section id="quick-start">
        <h1>ModelFlow User Guide</h1>
        <p>Welcome to ModelFlow. This guide covers everything from your first launch to advanced multi-model workflows.</p>
        <h2>Quick Start</h2>
        <ol>
          <li>Download ModelFlow from the Microsoft Store.</li>
          <li>Open the app and complete the onboarding.</li>
          <li>Add your first model in the Model Manager.</li>
          <li>Start a chat and type <code>@model-name</code> to switch models.</li>
        </ol>
      </section>

      <section id="models">
        <h2>Model Management</h2>
        <p>Use the Model Manager to add text, image, video, and audio models. For each model you can set the provider, API key, role, context window, and cost limits.</p>
        <figure>
          <img src="../assets/screenshots/en/02-models.png" alt="Model Manager" />
          <figcaption>Model Manager with multiple providers configured.</figcaption>
        </figure>
      </section>

      <section id="chat">
        <h2>Chat &amp; @ Mentions</h2>
        <p>Type <code>@</code> followed by a model name to route the next reply to that model. You can chain multiple models in the same conversation.</p>
        <figure>
          <img src="../assets/screenshots/en/01-chat.png" alt="Chat with @ mention" />
          <figcaption>Use @mentions to switch models mid-conversation.</figcaption>
        </figure>
      </section>

      <section id="workflows">
        <h2>Workflows</h2>
        <p>Open the Workflow Editor to build visual pipelines. Drag model nodes, condition nodes, and command nodes onto the canvas, then connect them.</p>
        <figure>
          <img src="../assets/screenshots/en/03-workflow.png" alt="Workflow Editor" />
          <figcaption>Visual workflow editor with connected nodes.</figcaption>
        </figure>
      </section>

      <section id="plugins">
        <h2>Plugins</h2>
        <p>ModelFlow supports verified plugins and community plugins. Install plugins from the Plugin Manager or build your own.</p>
        <figure>
          <img src="../assets/screenshots/common/06-skills.png" alt="Plugin Manager" />
          <figcaption>Browse and manage plugins.</figcaption>
        </figure>
      </section>

      <section id="cli-tools">
        <h2>Local CLI &amp; Tools</h2>
        <p>Models can run local commands, read files, and list directories. Type <code>/tool</code> in chat or add a Command Node to a workflow.</p>
        <figure>
          <img src="../assets/screenshots/common/05-memory.png" alt="Memory and tools" />
          <figcaption>Tool execution with security policies.</figcaption>
        </figure>
      </section>

      <section id="call-log">
        <h2>Call Log &amp; Cost</h2>
        <p>The Call Log tracks every AI call, tool execution, token usage, and estimated cost. Export logs for analysis.</p>
        <figure>
          <img src="../assets/screenshots/en/04-calllog.png" alt="Call Log" />
          <figcaption>Track every call and cost.</figcaption>
        </figure>
      </section>

      <section id="settings">
        <h2>Settings &amp; Privacy</h2>
        <p>ModelFlow is local-first. Your sessions, model configs, and plugins are stored on your machine. Change language, workspace, and export data in Settings.</p>
        <figure>
          <img src="../assets/screenshots/common/07-workspace.png" alt="Workspace settings" />
          <figcaption>Workspace and settings panel.</figcaption>
        </figure>
      </section>
    </main>
  </div>

  <footer class="footer">
    <div class="container footer-bottom">
      <p>© 2026 ModelFlow. All rights reserved.</p>
    </div>
  </footer>
</body>
</html>
```

- [ ] **Step 2: 在 `css/styles.css` 添加文档页样式**

```css
.docs-body {
  padding-top: var(--nav-height);
}

.docs-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--nav-height);
  background: rgba(11, 12, 15, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  z-index: 1000;
}

.docs-navbar .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.docs-lang-nav {
  display: flex;
  gap: 16px;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.docs-lang-nav a {
  transition: color 0.2s ease;
}

.docs-lang-nav a:hover {
  color: var(--text-primary);
}

.docs-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 64px;
  padding-top: 48px;
  padding-bottom: 96px;
}

.docs-sidebar {
  position: sticky;
  top: calc(var(--nav-height) + 48px);
  align-self: start;
}

.docs-sidebar ul {
  list-style: none;
}

.docs-sidebar li {
  margin-bottom: 8px;
}

.docs-sidebar a {
  display: block;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font-size: 0.9375rem;
  transition: background 0.2s ease, color 0.2s ease;
}

.docs-sidebar a:hover,
.docs-sidebar a.active {
  background: rgba(46, 127, 247, 0.12);
  color: var(--text-primary);
}

.docs-main {
  max-width: 720px;
}

.docs-main h1 {
  font-size: 2.5rem;
  margin-bottom: 16px;
}

.docs-main h2 {
  font-size: 1.75rem;
  margin-top: 48px;
  margin-bottom: 16px;
}

.docs-main p,
.docs-main ol,
.docs-main ul {
  color: var(--text-secondary);
  margin-bottom: 16px;
  line-height: 1.7;
}

.docs-main code {
  background: rgba(255, 255, 255, 0.08);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
}

.docs-main figure {
  margin: 24px 0;
  border-radius: var(--radius);
  overflow: hidden;
  border: 1px solid var(--border);
  background: var(--bg-secondary);
}

.docs-main figure img {
  width: 100%;
}

.docs-main figcaption {
  padding: 12px 16px;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

@media (max-width: 992px) {
  .docs-layout {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .docs-sidebar {
    position: static;
  }

  .docs-lang-nav {
    display: none;
  }
}
```

- [ ] **Step 3: 本地验证**

Run: `python -m http.server 8000`  
Open: http://localhost:8000/docs/en/index.html  
Expected:
- 英文文档页渲染正常。
- 侧边栏导航、语言链接、截图均正确。
- 移动端布局合理。

- [ ] **Step 4: Commit**

```bash
git add docs/en/index.html css/styles.css
git commit -m "feat(docs): add English user guide template and styles"
```

---

## Task 9-16: 创建其余 7 种语言文档页

**Files:**
- Create: `docs/{lang}/index.html` for `zh-CN`, `zh-TW`, `ja`, `ko`, `de`, `fr`, `es`

**Interfaces:**
- Consumes: `docs/en/index.html` 结构
- Produces: 对应语言的操作手册页面

### Task 9: 简体中文文档页 `docs/zh-CN/index.html`

- [ ] **Step 1: 复制英文模板并翻译**

将 `docs/en/index.html` 复制到 `docs/zh-CN/index.html`，修改：
- `<html lang="en">` → `<html lang="zh-CN">`
- `<title>` → `ModelFlow 用户指南 — 简体中文`
- `<meta name="description">` → 简体中文描述
- 所有正文内容翻译为简体中文
- 图片路径 `../assets/screenshots/en/` → `../assets/screenshots/zh-CN/`
- 语言链接中的 `../en/index.html` 保留，高亮当前语言可用 CSS 或 `aria-current`

- [ ] **Step 2: 本地验证**

Open: http://localhost:8000/docs/zh-CN/index.html  
Expected: 简体中文页面正常，截图加载 `zh-CN` 目录。

- [ ] **Step 3: Commit**

```bash
git add docs/zh-CN/index.html
git commit -m "feat(docs): add Simplified Chinese user guide"
```

### Task 10-16: 繁體中文、日文、韩文、德文、法文、西班牙文

对 `zh-TW`、`ja`、`ko`、`de`、`fr`、`es` 重复 Task 9 的三步：复制模板、翻译、验证、单独 commit。

每个任务应包含：
- 完整的 `docs/{lang}/index.html` 文件
- 对应语言的 `<html lang>`、`<title>`、`<meta description>`
- 对应语言的截图路径
- 本地验证命令与预期结果
- Commit 命令

---

## Task 17: 更新首页 Docs 链接

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: `window.I18n`
- Produces: 首页 Docs 链接指向本地文档入口，并随语言变化。

- [ ] **Step 1: 修改 Docs 导航链接**

将：

```html
<li><a href="https://github.com/ModelFlow-App/multi-agent-platform/wiki" target="_blank" rel="noopener">Docs</a></li>
```

改为：

```html
<li><a href="./docs/index.html" data-i18n="nav.docs" data-docs-link>Docs</a></li>
```

- [ ] **Step 2: 在 `js/main.js` 监听语言变化更新 Docs 链接**

```js
function updateDocsLink() {
  const link = document.querySelector('[data-docs-link]');
  if (!link || !window.I18n) return;
  const lang = window.I18n.getLanguage();
  link.href = `./docs/${lang}/index.html`;
}

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initScrollSpy();
  initLanguageSelector();
  initPricingToggle();
  updateDocsLink();
});

window.addEventListener('modelflow:languagechange', updateDocsLink);
```

- [ ] **Step 3: 本地验证**

Open: http://localhost:8000  
Expected:
- 导航 Docs 链接指向 `./docs/en/index.html`（默认）。
- 切换语言后，Docs 链接同步变为 `./docs/{lang}/index.html`。
- 点击 Docs 进入对应语言文档页。

- [ ] **Step 4: Commit**

```bash
git add index.html js/main.js
git commit -m "feat(nav): point Docs link to local multilingual guide"
```

---

## Task 18: 更新 README 与最终验证

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: 无
- Produces: README 反映新结构。

- [ ] **Step 1: 更新 `README.md` 结构说明**

在 `README.md` 的 Structure 部分追加：

```markdown
- `docs/` — Multilingual user guide (8 languages)
  - `docs/{lang}/index.html` — Language-specific guide
  - `docs/assets/screenshots/` — Product screenshots
- `js/i18n.js` — Homepage internationalization
```

- [ ] **Step 2: 最终验证清单**

Run: `python -m http.server 8000`  
Open: http://localhost:8000  
验证：
- [ ] 8 种语言切换后首页文本正确。
- [ ] 定价 Monthly/Yearly 切换与按钮文案。
- [ ] `localStorage.lang` 持久化。
- [ ] Docs 链接随当前语言变化。
- [ ] 文档入口重定向。
- [ ] 8 个文档页截图正确加载。
- [ ] 移动端语言下拉与导航不重叠。
- [ ] 无 JS 时页面仍可阅读。

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs(readme): update structure and features"
```

---

## Spec Coverage Check

| Spec 要求 | 对应任务 |
| --- | --- |
| 首页 8 语言国际化 | Task 1-4 |
| Pro 月/年付切换 | Task 5 |
| 站内操作手册 | Task 6-8, Task 9-16 |
| 截图资源复制 | Task 7 |
| 导航 Docs 改为本地 | Task 17 |
| SEO / 可访问性 | Task 1 (`<html lang>`、title/meta)，Task 8 (alt/figcaption) |
| 降级/错误处理 | Task 1 (翻译缺失回退)，Task 6 (无 JS 手动链接) |

## Placeholder Scan

- 无 `TBD`、`TODO`、`implement later`。
- 翻译数据完整列出英文示例，其余语言明确说明需要翻译。
- 8 个语言文档页使用模板复用，每个语言任务步骤一致。

## Type Consistency

- `window.I18n` API 在所有任务中一致：`setLanguage(lang)`、`getLanguage()`、`t(key)`、`render()`。
- 语言代码在所有任务中一致：`en / zh-CN / zh-TW / ja / ko / de / fr / es`。
- `localStorage` 键一致：`modelflow-lang`。
