export type Lang = 'zh' | 'en'

const dict = {
  title: { zh: '喂巴哥', en: 'Feed the Pug' },
  subtitle: { zh: '3D 第一视角 · 轻轻喂一口', en: '3D first-person · One gentle bite' },
  start: { zh: '开始喂食', en: 'Start feeding' },
  pickColor: { zh: '选一只巴哥', en: 'Pick a pug' },
  continue: { zh: '带它回家', en: 'Take it home' },
  hunger: { zh: '饱腹感', en: 'Fullness' },
  mute: { zh: '静音', en: 'Mute' },
  unmute: { zh: '开声', en: 'Sound' },
  back: { zh: '换一只', en: 'Switch pug' },
  tip: { zh: '点选托盘里的食物，慢慢递到嘴边', en: 'Tap a treat, then bring it to the mouth' },
  longing: { zh: '好想吃……', en: 'So hungry…' },
  eating: { zh: '嗯嗯嗯！', en: 'Nom nom!' },
  happy: { zh: '哼哼～真香', en: 'Hmph~ yummy' },
  satisfied: { zh: '吃饱啦，眯一会', en: 'Full belly, nap time' },
  idle: { zh: '盯着你看', en: 'Watching you' },
  foods: {
    kibble: { zh: '狗粮', en: 'Kibble' },
    treat: { zh: '肉干', en: 'Treat' },
    carrot: { zh: '胡萝卜', en: 'Carrot' },
    apple: { zh: '苹果片', en: 'Apple' },
    water: { zh: '清水', en: 'Water' },
  },
  colors: {
    fawn: { zh: '奶茶色', en: 'Fawn' },
    black: { zh: '黑色', en: 'Black' },
    apricot: { zh: '杏色', en: 'Apricot' },
    silver: { zh: '银灰', en: 'Silver' },
  },
} as const

export type FoodId = keyof typeof dict.foods
export type ColorId = keyof typeof dict.colors

export function t(lang: Lang, key: keyof typeof dict): string {
  const entry = dict[key]
  if (typeof entry === 'object' && 'zh' in entry) {
    return entry[lang]
  }
  return ''
}

export function foodName(lang: Lang, id: FoodId): string {
  return dict.foods[id][lang]
}

export function colorName(lang: Lang, id: ColorId): string {
  return dict.colors[id][lang]
}
