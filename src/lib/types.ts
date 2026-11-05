import type { ColorId, FoodId } from './i18n'

export type Screen = 'splash' | 'pick' | 'play'
export type Mood = 'idle' | 'longing' | 'eating' | 'happy' | 'satisfied'
export type FeedPhase = 'hidden' | 'approach' | 'feed' | 'retreat'

export interface Coat {
  id: ColorId
  /** Real photo texture under public/pugs/ */
  photo: string
  fur: string
  furDark: string
  ear: string
  mask: string
}

export const COATS: Coat[] = [
  {
    id: 'fawn',
    photo: 'pugs/fawn.jpg',
    fur: '#C4A574',
    furDark: '#A88655',
    ear: '#8B6914',
    mask: '#2A1A0E',
  },
  {
    id: 'black',
    photo: 'pugs/black.jpg',
    fur: '#2C2419',
    furDark: '#1A140F',
    ear: '#1A140F',
    mask: '#0D0A07',
  },
  {
    id: 'apricot',
    photo: 'pugs/apricot.jpg',
    fur: '#E8B88A',
    furDark: '#D49A68',
    ear: '#C47A4A',
    mask: '#3D2914',
  },
  {
    id: 'silver',
    photo: 'pugs/silver.jpg',
    fur: '#B8B0A4',
    furDark: '#9A9286',
    ear: '#7A7268',
    mask: '#2A2520',
  },
]

export interface FoodItem {
  id: FoodId
  fill: number
  color: string
  accent: string
}

export const FOODS: FoodItem[] = [
  { id: 'kibble', fill: 14, color: '#C4A060', accent: '#8B6914' },
  { id: 'treat', fill: 18, color: '#A0522D', accent: '#6B3410' },
  { id: 'carrot', fill: 10, color: '#E67E22', accent: '#27AE60' },
  { id: 'apple', fill: 12, color: '#E74C3C', accent: '#F5D76E' },
  { id: 'water', fill: 8, color: '#5DADE2', accent: '#AED6F1' },
]

/** Vite base-aware public asset URL */
export function publicUrl(path: string): string {
  const base = import.meta.env.BASE_URL || '/'
  return `${base}${path.replace(/^\//, '')}`
}
