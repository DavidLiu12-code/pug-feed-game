import { FoodIcon } from './FoodIcon'
import type { FoodId } from '../lib/i18n'

interface Props {
  foodId: FoodId | null
  phase: 'hidden' | 'approach' | 'feed' | 'retreat'
}

export function FeedHand({ foodId, phase }: Props) {
  if (!foodId || phase === 'hidden') return null

  const cls =
    phase === 'approach'
      ? 'feed-approach'
      : phase === 'feed'
        ? 'feed-hold'
        : 'feed-retreat'

  return (
    <div
      className={`pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center ${cls}`}
      aria-hidden
    >
      <div className="relative flex flex-col items-center">
        <div className="mb-1 rounded-full bg-[var(--cream)]/90 px-3 py-2 shadow-md ring-1 ring-[var(--ink-soft)]/10">
          <FoodIcon id={foodId} size={56} />
        </div>
        {/* simplified first-person hand/fingers */}
        <svg width="140" height="90" viewBox="0 0 140 90" className="drop-shadow-lg">
          <ellipse cx="70" cy="70" rx="55" ry="28" fill="#E8C4A8" />
          <rect x="30" y="20" width="16" height="50" rx="8" fill="#E8C4A8" />
          <rect x="50" y="10" width="16" height="55" rx="8" fill="#F0D0B8" />
          <rect x="70" y="8" width="16" height="55" rx="8" fill="#E8C4A8" />
          <rect x="90" y="18" width="16" height="48" rx="8" fill="#E0B898" />
          <ellipse cx="48" cy="55" rx="14" ry="12" fill="#D4A888" opacity="0.5" />
        </svg>
      </div>
    </div>
  )
}
