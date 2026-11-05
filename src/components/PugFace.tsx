import type { Coat, Mood } from '../lib/types'

interface Props {
  coat: Coat
  mood: Mood
  blinking: boolean
}

export function PugFace({ coat, mood, blinking }: Props) {
  const eyesOpen = !blinking && mood !== 'satisfied'
  const pupilScale =
    mood === 'longing' ? 1.25 : mood === 'eating' ? 0.85 : mood === 'happy' ? 1.1 : 1
  const mouthOpen = mood === 'eating' || mood === 'longing'
  const browLift = mood === 'longing' || mood === 'happy'

  return (
    <svg
      viewBox="0 0 320 340"
      className="pug-face w-full max-w-[420px] drop-shadow-md"
      aria-hidden
    >
      <defs>
        <radialGradient id="furGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={coat.fur} />
          <stop offset="100%" stopColor={coat.furDark} />
        </radialGradient>
        <filter id="soft">
          <feGaussianBlur stdDeviation="0.4" />
        </filter>
      </defs>

      {/* ears */}
      <ellipse cx="78" cy="88" rx="48" ry="62" fill={coat.fur} />
      <ellipse cx="78" cy="92" rx="28" ry="38" fill={coat.ear} opacity="0.85" />
      <ellipse cx="242" cy="88" rx="48" ry="62" fill={coat.fur} />
      <ellipse cx="242" cy="92" rx="28" ry="38" fill={coat.ear} opacity="0.85" />

      {/* head */}
      <ellipse cx="160" cy="178" rx="118" ry="112" fill="url(#furGrad)" className="pug-breathe" />

      {/* wrinkles */}
      <path
        d="M95 130 Q160 118 225 130"
        fill="none"
        stroke={coat.wrinkle}
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M105 148 Q160 138 215 148"
        fill="none"
        stroke={coat.wrinkle}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path
        d="M118 162 Q160 154 202 162"
        fill="none"
        stroke={coat.wrinkle}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.4"
      />

      {/* brows — lift when longing/happy */}
      <path
        d={`M100 ${browLift ? 148 : 155} Q125 ${browLift ? 138 : 148} 145 ${browLift ? 148 : 155}`}
        fill="none"
        stroke={coat.mask}
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d={`M175 ${browLift ? 148 : 155} Q195 ${browLift ? 138 : 148} 220 ${browLift ? 148 : 155}`}
        fill="none"
        stroke={coat.mask}
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.7"
      />

      {/* eyes */}
      <g className="pug-eyes">
        {eyesOpen ? (
          <>
            <ellipse cx="122" cy="175" rx="22" ry="24" fill="#FFF8EE" />
            <ellipse cx="198" cy="175" rx="22" ry="24" fill="#FFF8EE" />
            <g style={{ transformOrigin: '122px 178px', transform: `scale(${pupilScale})` }}>
              <ellipse cx="122" cy="178" rx="12" ry="13" fill="#1A1208" />
              <circle cx="126" cy="173" r="4" fill="#FFF8EE" opacity="0.9" />
              {mood === 'longing' && (
                <ellipse cx="118" cy="184" rx="5" ry="3" fill="#5B9BD5" opacity="0.35" />
              )}
            </g>
            <g style={{ transformOrigin: '198px 178px', transform: `scale(${pupilScale})` }}>
              <ellipse cx="198" cy="178" rx="12" ry="13" fill="#1A1208" />
              <circle cx="202" cy="173" r="4" fill="#FFF8EE" opacity="0.9" />
              {mood === 'longing' && (
                <ellipse cx="194" cy="184" rx="5" ry="3" fill="#5B9BD5" opacity="0.35" />
              )}
            </g>
          </>
        ) : (
          <>
            <path
              d="M100 178 Q122 168 144 178"
              fill="none"
              stroke="#1A1208"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M176 178 Q198 168 220 178"
              fill="none"
              stroke="#1A1208"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </>
        )}
      </g>

      {/* black mask / muzzle */}
      <ellipse cx="160" cy="230" rx="58" ry="48" fill={coat.mask} />
      <ellipse cx="160" cy="218" rx="36" ry="22" fill={coat.mask} />

      {/* nose */}
      <ellipse cx="160" cy="210" rx="22" ry="16" fill="#0D0A07" />
      <ellipse cx="154" cy="206" rx="5" ry="3.5" fill="#4A3A2A" opacity="0.6" />
      <ellipse cx="166" cy="206" rx="5" ry="3.5" fill="#4A3A2A" opacity="0.6" />

      {/* mouth */}
      {mouthOpen ? (
        <>
          <ellipse
            cx="160"
            cy="248"
            rx={mood === 'eating' ? 22 : 16}
            ry={mood === 'eating' ? 16 : 10}
            fill="#1A0E08"
          />
          <ellipse cx="160" cy="242" rx="14" ry="5" fill="#E8A0A0" opacity="0.7" />
        </>
      ) : mood === 'happy' || mood === 'satisfied' ? (
        <path
          d="M138 245 Q160 262 182 245"
          fill="none"
          stroke="#0D0A07"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M142 248 Q160 255 178 248"
          fill="none"
          stroke="#0D0A07"
          strokeWidth="3"
          strokeLinecap="round"
        />
      )}

      {/* cheek blush when happy */}
      {(mood === 'happy' || mood === 'eating') && (
        <>
          <ellipse cx="88" cy="210" rx="16" ry="10" fill="#E8A090" opacity="0.35" />
          <ellipse cx="232" cy="210" rx="16" ry="10" fill="#E8A090" opacity="0.35" />
        </>
      )}
    </svg>
  )
}
