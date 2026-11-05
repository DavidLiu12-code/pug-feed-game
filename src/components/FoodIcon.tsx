import type { FoodId } from '../lib/i18n'

export function FoodIcon({ id, size = 40 }: { id: FoodId; size?: number }) {
  const s = size
  switch (id) {
    case 'kibble':
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" aria-hidden>
          <ellipse cx="16" cy="28" rx="9" ry="7" fill="#C4A060" transform="rotate(-20 16 28)" />
          <ellipse cx="28" cy="22" rx="8" ry="6" fill="#D4B070" transform="rotate(15 28 22)" />
          <ellipse cx="34" cy="32" rx="7" ry="5.5" fill="#A89050" transform="rotate(-10 34 32)" />
        </svg>
      )
    case 'treat':
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" aria-hidden>
          <rect x="10" y="18" width="28" height="14" rx="4" fill="#A0522D" />
          <rect x="12" y="20" width="24" height="4" rx="1" fill="#C07040" opacity="0.5" />
          <circle cx="18" cy="25" r="2" fill="#6B3410" opacity="0.4" />
          <circle cx="28" cy="25" r="2" fill="#6B3410" opacity="0.4" />
        </svg>
      )
    case 'carrot':
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" aria-hidden>
          <path d="M24 10 L28 18 L20 18 Z" fill="#27AE60" />
          <path d="M22 16 L26 16 L30 42 Q24 46 18 42 Z" fill="#E67E22" />
          <path d="M22 22 L27 24" stroke="#D35400" strokeWidth="1.5" opacity="0.5" />
          <path d="M21 30 L26 32" stroke="#D35400" strokeWidth="1.5" opacity="0.5" />
        </svg>
      )
    case 'apple':
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" aria-hidden>
          <path d="M14 22 Q14 12 24 14 Q34 12 34 22 Q36 38 24 40 Q12 38 14 22 Z" fill="#E74C3C" />
          <path d="M24 14 Q26 8 30 6" fill="none" stroke="#5D4037" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="28" cy="10" rx="5" ry="3" fill="#27AE60" transform="rotate(20 28 10)" />
          <path d="M18 24 L30 28" stroke="#F5D76E" strokeWidth="2" opacity="0.5" />
        </svg>
      )
    case 'water':
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" aria-hidden>
          <path
            d="M16 18 Q16 12 24 10 Q32 12 32 18 L30 38 Q24 42 18 38 Z"
            fill="#AED6F1"
            stroke="#5DADE2"
            strokeWidth="2"
          />
          <ellipse cx="24" cy="28" rx="6" ry="4" fill="#5DADE2" opacity="0.45" />
          <path d="M20 22 Q24 20 28 22" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.6" />
        </svg>
      )
  }
}
