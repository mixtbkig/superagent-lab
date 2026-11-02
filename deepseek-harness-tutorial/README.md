# DeepSeek Harness 源码深度教程（网页版）

一套面向初学者、由浅入深的 **DeepSeek Harness** 源码学习网站。从 Claude Code / Codex 这类 agent harness 讲起，逐层拆解 Cordis 插件框架、Agent 主循环、事件溯源会话、工具流水线、上下文压缩、多智能体编排、前端传输与安全治理，最后给出 372 个包的完整全景与动手实践。

## 怎么打开

**最简单**：双击本目录下的 `index.html`，用浏览器打开即可（纯静态、无需联网、无需安装）。

**推荐（本地服务器）**：

```bash
cd deepseek-harness-tutorial
python3 -m http.server 8899
# 浏览器访问 http://127.0.0.1:8899
```

## 内容结构（21 章）

| 部 | 章 | 主题 |
|---|---|---|
| 一 · 建立直觉 | 00–03 | 为什么需要 Harness / Agent 最小循环 / 一切皆插件 Cordis / Profile 与组合包 |
| 二 · 核心引擎 | 04–09 | 全局架构 / 会话日志（事件溯源）/ 轮次步骤 / LLM 流 / 工具注册表 / 工具执行流水线 |
| 三 · 上下文与记忆 | 10–12 | 系统提示词 / 压缩与记忆 / 持久化与恢复 |
| 四 · 编排与扩展 | 13–14 | 子代理与 Workflow / Skills·MCP·动态扩展 |
| 五 · 外围与治理 | 15–17 | 人在环路 / 前端与多端 / 安全·可观测·工程约束 |
| 六 · 全景与实战 | 18–20 | 372 包全景图 / 写插件·用 SDK / 总结与学习路线 |

每章包含：🧸 小学生版比喻 → 原理讲解 → 可交互图示/动画 → 源码坐标 → 小测验。学习进度保存在浏览器 localStorage；右上角可切换深/浅色主题。

## 交互图示

- 可播放的 Agent 轮次时序图（第 1、4 章）
- 可点击的插件树 / 作用域 / 工具解析图（第 2、8 章）
- 逐级展开的工具执行流水线 stepper（第 9 章）
- 流式 `StreamChunk` 拼装动画（第 7 章）
- 上下文压缩「瘦身」动画（第 11 章）
- Profile 分层叠加动画（第 3 章）
- 可搜索 / 可按组筛选的 372 包全景图（第 18 章）

## 资料来源

基于 GitHub 仓库 [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)（master 分支）。所有结论都能在仓库的 `docs/` 与 `packages/` 中找到出处；教程用通俗语言重新组织并配图。

> 仓库仍在快速迭代（开发者预览阶段），字段与接口请以你 clone 的版本源码为准。

## 目录

```text
deepseek-harness-tutorial/
├── index.html        # 课程首页 / 地图
├── ch00.html … ch20.html
├── style.css
├── app.js            # 导航、进度、测验、代码高亮
├── diagrams.js       # 交互图示
└── data/packages.js  # 372 包清单（由源码 package.json 生成）
```
