export function VLogo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg
      viewBox="40 185 900 450"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="VAcademy — логотип"
    >
      <defs>
        <linearGradient id="vio" x1="0" y1="0" x2="0.25" y2="1">
          <stop offset="0%" stopColor="#c9a0f7" />
          <stop offset="45%" stopColor="#9157dd" />
          <stop offset="100%" stopColor="#6129be" />
        </linearGradient>
        <linearGradient id="vioHi" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e5ccff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#b78af0" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="sil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#e8e6ee" />
          <stop offset="100%" stopColor="#b5b1c1" />
        </linearGradient>
      </defs>

      <path
        d="M778 205 L858 562 L918 602 L752 612 L708 400 L492 602 L340 612 Z"
        fill="url(#sil)"
        stroke="#1b1528"
        strokeWidth="28"
        paintOrder="stroke"
      />

      <path
        d="M60 218 L300 222 L332 442 L548 212 L708 212 L272 612 Z"
        fill="url(#vio)"
        stroke="#1b1528"
        strokeWidth="28"
        paintOrder="stroke"
      />

      <path d="M548 226 L632 226 L286 596 Z" fill="url(#vioHi)" opacity="0.7" />
      <path d="M118 240 L292 242 L318 430 L288 468 Z" fill="url(#vioHi)" opacity="0.6" />
    </svg>
  );
}
