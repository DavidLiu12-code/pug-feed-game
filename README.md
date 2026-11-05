# 喂巴哥 · Pug Feed Game

第一视角喂**巴哥犬**的 3D 互动小游戏。可选毛色、点选食物递到嘴边；巴哥用真实照片贴图呈现，会哼哼唧唧、瞪圆渴望的眼睛，再开心地嚼一口。

## 怎么玩

1. 打开页面 → **开始喂食**
2. 选一只巴哥（奶茶 / 黑 / 杏 / 银灰）——背后是 Three.js 3D 场景实时预览
3. 在底部托盘点选食物（狗粮、肉干、胡萝卜、苹果片、清水）
4. 3D 手与食物从第一视角递到嘴边，巴哥会进食并哼哼
5. 右上角可 **静音 / 开声**，左上角可切 **中文 / EN**

饱腹感会随喂食上升，慢慢回落；吃得太饱会眯眼满足。

## 技术

- Vite + React + TypeScript + Tailwind CSS v4
- **Three.js + React Three Fiber + Drei**：工作室光、接触阴影、呼吸/渴望前倾、进食挤压、相机轻颤
- 真实巴哥照片作脸部贴图（见 `public/pugs/`，署名 [`CREDITS.md`](public/pugs/CREDITS.md)）
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

## 致谢

- 巴哥照片：Pexels（详见 `public/pugs/CREDITS.md`）
- UI 去味参考：[unslop](https://github.com/heydamir/unslop) by Damir Sokolovsky / CC BY
