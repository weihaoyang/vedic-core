# 吠陀占星 · vedic core

恒星黄经、宿位及十六分盘。从 [知几排盘](https://github.com/weihaoyang/qimen-llm-chart) 提取 TypeScript 实现、共享依赖模块与回归测试；暂未发布 npm 包。

## 运行

需要 Node.js 20 或更高版本。

```sh
npm install
npm run patch:3meta
npm test
npm run typecheck
```

运行前的补丁会修正本地依赖中的计算口径。入口位于 `src/lib/vedic/`。

## 资料与案例

[研究论文：古籍、现代模型与待核事项](https://github.com/weihaoyang/qimen-llm-chart/blob/main/docs/research/calculation-audit-paper.md)

- ships the twelve rashis, twenty-seven nakshatras and sixteen vargas（`src/lib/vedic/chart.test.ts`）
- anchors J2000 to the mean Lahiri equinox（`src/lib/vedic/chart.test.ts`）
- uses the mean node for Rahu / Ketu（`src/lib/vedic/chart.test.ts`）
- matches independent osculating node reference longitudes（`src/lib/vedic/chart.test.ts`）
- assigns all 108 pada boundaries to the new interval（`src/lib/vedic/chart.test.ts`）

案例验证具体输出字段，不验证占断效果。

## 授权与来源

本仓代码按 [GPL-3.0-only](LICENSE) 发布，源自知几排盘。分盘与岁差参考 vedic-kundali 和 vedic-panchanga，MIT 原许可见 `LICENSES/`。 其他随仓代码及依赖许可见 `LICENSES/`。不附古籍影像，其授权另按[影像权利记录](https://github.com/weihaoyang/qimen-llm-chart/blob/main/docs/research/sources/RIGHTS.md)核查。
