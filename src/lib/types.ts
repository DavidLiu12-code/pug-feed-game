import type { ColorId, FoodId } from './i18n'

export type Screen = 'splash' | 'pick' | 'play'
export type Mood = 'idle' | 'longing' | 'eating' | 'happy' | 'satisfied'

export interface Coat {
  id: ColorId
  fur: string
  furDark: string
  ear: string
  mask: string
  wrinkle: string
}

export const COATS: Coat[] = [
  {
    id: 'fawn',
    fur: '#C4A574',
    furDark: '#A88655',
    ear: '#8B6914',
    mask: '#2A1A0E',
    wrinkle: '#8B7355',
  },
  {
    id: 'black',
    fur: '#2C2419',
    furDark: '#1A140F',
    ear: '#1A140F',
    mask: '#0D0A07',
    wrinkle: '#3D3228',
  },
  {
    id: 'apricot',
    fur: '#E8B88A',
    furDark: '#D49A68',
    ear: '#C47A4A',
    mask: '#3D2914',
    wrinkle: '#C4946A',
  },
  {
    id: 'silver',
    fur: '#B8B0A4',
    furDark: '#9A9286',
    ear: '#7A7268',
    mask: '#2A2520',
    wrinkle: '#8A8278',
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
