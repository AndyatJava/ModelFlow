# ModelFlow 官网：年付定价、操作手册与多语言支持设计文档

**日期：** 2026-06-23  
**作者：** Claude Code  
**状态：** 待实现  

---

## 背景与目标

当前 ModelFlow 官网（`index.html`）存在以下问题：

1. **定价展示不清晰**：`$99/year` 仅以副标题形式出现在 Pro 卡片中，没有作为独立的年付订阅选项展示。
2. **文档为空**：顶部导航的 Docs 链接指向 GitHub Wiki，站点本地没有操作手册内容。
3. **无国际化**：页面仅支持英文，而 ModelFlow 应用本身支持 8 种语言。

本设计旨在解决以上三点，为官网增加：
- 显性的月付/年付定价切换；
- 站内多语言操作手册；
- 全站 8 语言国际化支持。

---

## 范围

在本次设计中，我们将对现有静态站点做以下改动：

- 修改 `index.html` 的定价区，增加月付/年付切换。
- 新增 `docs/{lang}/index.html` 多语言操作手册。
- 新增 `js/i18n.js` 实现首页国际化。
- 修改 `js/main.js` 加载 `i18n.js` 并处理语言切换。
- 修改 `css/styles.css` 增加语言切换器与定价切换样式。
- 从 `C:\Users\majin\multi-agent-platform\store-assets\screenshots\{lang}\` 复制 `01-chat.png`、`02-models.png`、`03-workflow.png`、`04-calllog.png` 到本站 `docs/assets/screenshots/{lang}/`。
- 从 `C:\Users\majin\multi-agent-platform\copyright-registration\screenshots\` 复制 `05-memory.png`、`06-skills.png`、`07-workspace.png` 到本站 `docs/assets/screenshots/common/`（这些截图无多语言版本，全语言共用）。

不在本次范围内的内容：

- 不改动应用本体（multi-agent-platform）。
- 不实现后端或支付接口。
- 不重新设计整体视觉风格，保持现有暗色主题。

---

## 语言列表

ModelFlow 应用支持以下 8 种语言，官网将同步支持：

| 语言代码 | 语言名称 |
| --- | --- |
| `en` | English |
| `zh-CN` | 简体中文 |
| `zh-TW` | 繁體中文 |
| `ja` | 日本語 |
| `ko` | 한국어 |
| `de` | Deutsch |
| `fr` | Français |
| `es` | Español |

---

## 架构

### 文件结构

```
.
├── index.html                          # 首页（模板化，由 JS 渲染文本）
├── css/
│   └── styles.css                      # 现有样式 + 新增样式
├── js/
│   ├── main.js                         # 导航、滚动、移动端菜单
│   └── i18n.js                         # 翻译数据、语言检测与切换
├── docs/
│   ├── index.html                      # 文档入口，重定向到默认语言
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
│           └── ...（其他 7 种语言）
└── docs/superpowers/specs/
    └── 2026-06-23-modelflow-website-i18n-docs-pricing-design.md
```

### 组件划分

| 组件 | 职责 | 所在文件 |
| --- | --- | --- |
| `I18n` | 管理翻译数据、检测语言、切换语言、渲染 `data-i18n` 元素 | `js/i18n.js` |
| `Navbar` | 导航、滚动效果、移动端菜单、语言下拉 | `js/main.js` + `index.html` |
| `PricingToggle` | 月付/年付切换与价格显示 | `js/main.js` + `index.html` |
| `DocsPage` | 操作手册静态页面（每种语言一个） | `docs/{lang}/index.html` |

---

## 详细设计

### 1. 首页国际化

#### 1.1 翻译数据结构

在 `js/i18n.js` 中维护一个 `translations` 对象，键为语言代码，值为嵌套对象：

```js
const translations = {
  en: {
    nav: { features: 'Features', plugins: 'Plugins', pricing: 'Pricing', docs: 'Docs' },
    hero: { title: 'One Workspace. Every Model.', ... },
    pricing: { free: 'Free', pro: 'Pro', monthly: 'Monthly', yearly: 'Yearly', ... },
    ...
  },
  'zh-CN': { ... },
  ...
};
```

#### 1.2 DOM 标记

首页所有需要翻译的文本使用 `data-i18n` 属性标记：

```html
<h1 class="hero-title" data-i18n="hero.title">One Workspace.<br />Every Model.</h1>
```

#### 1.3 语言检测与切换

- 检测顺序：`localStorage.lang` → `navigator.language` → 默认 `en`。
- 切换语言时：更新 `localStorage.lang`，调用 `I18n.setLanguage(lang)` 重新渲染所有 `data-i18n` 元素。
- 如果当前语言缺少某个键，回退到 `en`。

#### 1.4 语言选择器

- 在导航栏右侧、Download 按钮旁边增加下拉选择器。
- 显示当前语言名称，点击展开 8 个语言选项。
- 移动端：下拉在汉堡菜单内或作为独立按钮显示。

### 2. 定价区改造

#### 2.1 月付/年付切换

在 Pro 卡片顶部增加切换按钮组：

```html
<div class="pricing-toggle">
  <button class="pricing-toggle-btn active" data-billing="monthly">Monthly</button>
  <button class="pricing-toggle-btn" data-billing="yearly">Yearly</button>
</div>
```

#### 2.2 价格展示

- Monthly：显示 `$9.9<span>/month</span>`，副标题为空或显示 “billed monthly”。
- Yearly：显示 `$99<span>/year</span>`，副标题显示 “billed annually · save 17%”。

#### 2.3 视觉反馈

- 当前选中的切换按钮使用 `background: var(--cta); color: #0B0C0F;`。
- Yearly 选中时，Pro 卡片显示 “Save 17%” 角标。

#### 2.4 降级方案

- 如果 JS 被禁用，页面显示默认静态内容：`$9.9/month · or $99/year · 14-day free trial`。

### 3. 操作手册

#### 3.1 页面结构

每个语言版本都是独立静态 HTML，结构如下：

```html
<nav>...</nav>
<aside class="docs-sidebar">...</aside>
<main class="docs-main">
  <section id="quick-start">...</section>
  <section id="models">...</section>
  ...
</main>
```

#### 3.2 章节内容

| 章节 ID | 标题 | 配图 |
| --- | --- | --- |
| `quick-start` | 快速开始 | logo / hero |
| `models` | 模型管理 | `02-models.png` |
| `chat` | 聊天与 `@` 提及 | `01-chat.png` |
| `workflows` | 工作流 | `03-workflow.png` |
| `plugins` | 插件 | `copyright-registration/06-skills.png` |
| `cli-tools` | 本地 CLI 与工具 | `copyright-registration/05-memory.png` |
| `call-log` | 通话记录与成本 | `04-calllog.png` |
| `settings` | 设置与隐私 | `copyright-registration/07-workspace.png` |

#### 3.3 截图处理

- 从 `C:\Users\majin\multi-agent-platform\store-assets\screenshots\{lang}\` 复制 `01-chat.png`、`02-models.png`、`03-workflow.png`、`04-calllog.png`。
- 如果某语言截图缺失，回退到 `en` 版本。
- 图片使用 `<figure>` 和 `<figcaption>` 包裹，增加可访问性。

### 4. 导航与入口

- 首页 `Docs` 链接改为 `./docs/en/index.html`，并根据当前选择语言动态切换为 `./docs/{lang}/index.html`。
- 文档入口 `docs/index.html` 包含一段 JS，读取 `localStorage.lang` 后重定向到对应语言子目录，无记录则默认 `en`。
- `docs/index.html` 在 JS 禁用时显示 8 个语言链接供手动选择。
- 每个文档页顶部都有语言切换器，可在 8 种语言间跳转。

### 5. SEO 与可访问性

- 每个页面设置正确的 `<html lang="{lang}">`。
- 提供对应语言的 `<title>` 和 `<meta name="description">`。
- 图片提供 `alt` 文本。
- 按钮和链接保持键盘可访问。

---

## 数据流

1. 用户访问首页。
2. `i18n.js` 检测语言，加载对应翻译。
3. 渲染所有 `data-i18n` 元素。
4. 用户切换语言时，更新 `localStorage`，重新渲染。
5. 用户点击 Docs 进入 `docs/index.html`，根据 `localStorage.lang` 重定向。
6. 文档页为静态 HTML，无需额外渲染。

---

## 错误处理

| 场景 | 处理 |
| --- | --- |
| 翻译键缺失 | 回退到 `en`，控制台警告 |
| 语言代码未知 | 回退到 `en` |
| JS 禁用 | 首页显示英文默认内容；文档页静态可用 |
| 某语言截图缺失 | 使用 `en` 截图 |
| 网络字体加载失败 | 使用系统字体回退 |

---

## 测试与验证

- [ ] 本地启动 `python -m http.server 8000`。
- [ ] 验证 8 种语言切换后首页文本正确。
- [ ] 验证定价 Monthly/Yearly 切换与按钮文案。
- [ ] 验证 `localStorage.lang` 持久化。
- [ ] 验证 Docs 链接随当前语言变化。
- [ ] 验证文档入口重定向。
- [ ] 验证 8 个文档页截图正确加载。
- [ ] 验证移动端语言下拉与导航不重叠。
- [ ] 验证无 JS 时页面仍可阅读。

---

## 依赖

- 无新增外部依赖。
- 继续使用现有 Google Fonts（Inter）。
- 截图来源：`C:\Users\majin\multi-agent-platform\store-assets\screenshots\`。
