# 喂巴哥 · Pug Feed Game

第一视角喂巴哥犬的可爱互动小游戏。可选毛色、点选食物递到嘴边，巴哥会哼哼唧唧、瞪圆渴望的眼睛，再开心地嚼一口。

## 怎么玩

1. 打开页面 → **开始喂食**
2. 选一只巴哥（奶茶 / 黑 / 杏 / 银灰）
3. 在底部托盘点选食物（狗粮、肉干、胡萝卜、苹果片、清水）
4. 手与食物从第一视角递到嘴边，巴哥会进食并哼哼
5. 右上角可 **静音 / 开声**，左上角可切 **中文 / EN**

饱腹感会随喂食上升，慢慢回落；吃得太饱会眯眼满足。

## 技术

- Vite + React + TypeScript + Tailwind CSS v4
- SVG 巴哥表情与呼吸动画（非写实贴图）
- Web Audio API 合成哼哼 / 咀嚼 / 开心音（无版权素材）
- 默认中文，可切英文

## 本地运行

```bash
npm install
npm run dev
```

构建（产出 `dist/`，并复制到 GitHub Pages 用的 `docs/`）：

```bash
npm run build:docs
```

## GitHub Pages

- Vite `base` 已设为 `/pug-feed-game/`
- 用仓库 **Settings → Pages → Deploy from branch → `/docs`**
- 建议仓库名：`pug-feed-game`
- 上线地址示例：`https://<user>.github.io/pug-feed-game/`

若仓库名不同，请同步修改 `vite.config.ts` 里的 `base`。
