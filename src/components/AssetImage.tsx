import { useState, type CSSProperties } from 'react';

type FallbackType = 'rider' | 'restaurant' | 'grocery' | 'medical' | 'house' | 'logo';

interface AssetImageProps {
  src: string;
  fallbackType: FallbackType;
  alt?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Renders a PNG from /public/assets/ if present.
 * Falls back to a polished, 3D-styled inline SVG illustration
 * if the image has not been dropped into /public/assets/ yet.
 */
export function AssetImage({
  src,
  fallbackType,
  alt = '',
  className = '',
  style,
}: AssetImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!hasError) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={style}
        onError={() => setHasError(true)}
        loading="lazy"
      />
    );
  }

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
      role="img"
      aria-label={alt || fallbackType}
    >
      <FallbackSVG type={fallbackType} />
    </div>
  );
}

/* ── Fallback SVGs ─────────────────────────────────────────── */

function FallbackSVG({ type }: { type: FallbackType }) {
  switch (type) {
    case 'restaurant':
      return <RestaurantSVG />;
    case 'grocery':
      return <GrocerySVG />;
    case 'medical':
      return <MedicalSVG />;
    case 'rider':
      return <RiderSVG />;
    case 'house':
      return <HouseSVG />;
    case 'logo':
      return <LogoSVG />;
    default:
      return <LogoSVG />;
  }
}

function RestaurantSVG() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', maxWidth: 280 }}>
      {/* Shadow */}
      <ellipse cx="100" cy="180" rx="60" ry="10" fill="rgba(0,0,0,0.08)" />
      {/* Building body */}
      <rect x="40" y="60" width="120" height="110" rx="12" fill="url(#rest-grad)" />
      {/* Roof */}
      <path d="M30 65 Q100 20 170 65" fill="#FF6B35" stroke="#e55a28" strokeWidth="2" />
      {/* Window */}
      <rect x="60" y="85" width="35" height="30" rx="6" fill="#FFF8E1" opacity="0.9" />
      <rect x="105" y="85" width="35" height="30" rx="6" fill="#FFF8E1" opacity="0.9" />
      {/* Door */}
      <rect x="80" y="130" width="40" height="40" rx="8" fill="#E8562A" />
      <circle cx="112" cy="150" r="3" fill="#FFD93D" />
      {/* Awning stripes */}
      <rect x="55" y="75" width="12" height="4" rx="2" fill="#FFD93D" opacity="0.6" />
      <rect x="73" y="75" width="12" height="4" rx="2" fill="#FFD93D" opacity="0.6" />
      <rect x="91" y="75" width="12" height="4" rx="2" fill="#FFD93D" opacity="0.6" />
      <rect x="109" y="75" width="12" height="4" rx="2" fill="#FFD93D" opacity="0.6" />
      <rect x="127" y="75" width="12" height="4" rx="2" fill="#FFD93D" opacity="0.6" />
      {/* Steam lines */}
      <path d="M75 55 Q78 45 75 35" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" opacity="0.5">
        <animate attributeName="d" values="M75 55 Q78 45 75 35;M75 55 Q72 45 75 35;M75 55 Q78 45 75 35" dur="2s" repeatCount="indefinite" />
      </path>
      <path d="M100 50 Q103 40 100 30" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" opacity="0.5">
        <animate attributeName="d" values="M100 50 Q103 40 100 30;M100 50 Q97 40 100 30;M100 50 Q103 40 100 30" dur="2.5s" repeatCount="indefinite" />
      </path>
      <path d="M125 55 Q128 45 125 35" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" opacity="0.5">
        <animate attributeName="d" values="M125 55 Q128 45 125 35;M125 55 Q122 45 125 35;M125 55 Q128 45 125 35" dur="1.8s" repeatCount="indefinite" />
      </path>
      <defs>
        <linearGradient id="rest-grad" x1="40" y1="60" x2="160" y2="170" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF8C5A" />
          <stop offset="1" stopColor="#FF6B35" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function GrocerySVG() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', maxWidth: 280 }}>
      {/* Shadow */}
      <ellipse cx="100" cy="180" rx="55" ry="10" fill="rgba(0,0,0,0.08)" />
      {/* Bag body */}
      <path d="M50 75 L45 165 Q45 175 55 175 L145 175 Q155 175 155 165 L150 75 Z" fill="url(#groc-grad)" />
      {/* Bag handle */}
      <path d="M75 75 Q75 45 100 45 Q125 45 125 75" stroke="#1B8A4A" strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* Produce - carrot */}
      <rect x="70" y="90" width="12" height="40" rx="6" fill="#FF7043" transform="rotate(-8 76 110)" />
      <path d="M73 88 Q76 78 79 88" fill="#4CAF50" />
      {/* Produce - apple */}
      <circle cx="105" cy="105" r="16" fill="#E53935" />
      <path d="M105 90 Q108 82 112 88" stroke="#4CAF50" strokeWidth="2" fill="none" />
      {/* Produce - leaf */}
      <ellipse cx="130" cy="100" rx="10" ry="18" fill="#66BB6A" transform="rotate(15 130 100)" />
      <line x1="130" y1="85" x2="130" y2="115" stroke="#388E3C" strokeWidth="1.5" />
      {/* Bread */}
      <ellipse cx="90" cy="140" rx="18" ry="12" fill="#FFB74D" />
      <path d="M78 138 Q90 130 102 138" stroke="#F57C00" strokeWidth="1" fill="none" />
      {/* Milk bottle */}
      <rect x="115" y="125" width="16" height="30" rx="4" fill="white" stroke="#E0E0E0" strokeWidth="1" />
      <rect x="117" y="120" width="12" height="8" rx="2" fill="#42A5F5" />
      <defs>
        <linearGradient id="groc-grad" x1="50" y1="75" x2="155" y2="175" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4ADE80" />
          <stop offset="1" stopColor="#22C55E" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function MedicalSVG() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', maxWidth: 280 }}>
      {/* Shadow */}
      <ellipse cx="100" cy="180" rx="55" ry="10" fill="rgba(0,0,0,0.08)" />
      {/* Kit body */}
      <rect x="40" y="70" width="120" height="90" rx="14" fill="url(#med-grad)" />
      {/* Kit handle */}
      <path d="M75 70 Q75 50 100 50 Q125 50 125 70" stroke="#2563EB" strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* Cross */}
      <rect x="88" y="95" width="24" height="8" rx="3" fill="white" />
      <rect x="96" y="87" width="8" height="24" rx="3" fill="white" />
      {/* Latch */}
      <rect x="92" y="145" width="16" height="6" rx="3" fill="#1E40AF" />
      {/* Pill 1 */}
      <ellipse cx="55" cy="140" rx="8" ry="5" fill="#FCA5A5" transform="rotate(-20 55 140)" />
      <line x1="55" y1="136" x2="55" y2="144" stroke="white" strokeWidth="1" opacity="0.6" transform="rotate(-20 55 140)" />
      {/* Pill 2 */}
      <ellipse cx="145" cy="135" rx="8" ry="5" fill="#93C5FD" transform="rotate(15 145 135)" />
      <line x1="145" y1="131" x2="145" y2="139" stroke="white" strokeWidth="1" opacity="0.6" transform="rotate(15 145 135)" />
      {/* Heartbeat line */}
      <path d="M50 55 L70 55 L78 40 L86 65 L94 48 L102 55 L150 55" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7">
        <animate attributeName="opacity" values="0.7;0.3;0.7" dur="1.5s" repeatCount="indefinite" />
      </path>
      <defs>
        <linearGradient id="med-grad" x1="40" y1="70" x2="160" y2="160" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60A5FA" />
          <stop offset="1" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function RiderSVG() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', maxWidth: 280 }}>
      {/* Shadow */}
      <ellipse cx="100" cy="180" rx="50" ry="8" fill="rgba(0,0,0,0.1)" />
      {/* Scooter body */}
      <path d="M60 140 Q50 140 50 130 L55 110 Q58 100 68 100 L140 100 Q150 100 150 110 L155 130 Q155 140 145 140 Z" fill="url(#rider-grad)" />
      {/* Back wheel */}
      <circle cx="70" cy="155" r="18" fill="#333" />
      <circle cx="70" cy="155" r="10" fill="#666" />
      <circle cx="70" cy="155" r="4" fill="#999" />
      {/* Front wheel */}
      <circle cx="135" cy="155" r="18" fill="#333" />
      <circle cx="135" cy="155" r="10" fill="#666" />
      <circle cx="135" cy="155" r="4" fill="#999" />
      {/* Handlebars */}
      <path d="M140 100 L150 80 L160 75" stroke="#333" strokeWidth="3" strokeLinecap="round" />
      {/* Rider torso */}
      <rect x="90" y="55" width="25" height="40" rx="8" fill="#FCE869" />
      {/* Rider head */}
      <circle cx="102" cy="42" r="14" fill="#FFD93D" />
      {/* Helmet */}
      <path d="M88 42 Q88 28 102 26 Q116 28 116 42" fill="#333" />
      {/* Delivery bag */}
      <rect x="65" y="68" width="30" height="28" rx="5" fill="#FF6B35" />
      <rect x="73" y="74" width="14" height="3" rx="1.5" fill="white" opacity="0.7" />
      <defs>
        <linearGradient id="rider-grad" x1="50" y1="100" x2="155" y2="140" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FCE869" />
          <stop offset="1" stopColor="#E8D45E" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function HouseSVG() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', maxWidth: 280 }}>
      {/* Shadow */}
      <ellipse cx="100" cy="185" rx="60" ry="8" fill="rgba(0,0,0,0.08)" />
      {/* House body */}
      <rect x="45" y="90" width="110" height="85" rx="8" fill="url(#house-grad)" />
      {/* Roof */}
      <path d="M35 95 L100 40 L165 95 Z" fill="#E8562A" />
      <path d="M35 95 L100 40 L165 95" stroke="#D14C22" strokeWidth="2" fill="none" />
      {/* Chimney */}
      <rect x="130" y="50" width="16" height="30" rx="3" fill="#C0392B" />
      {/* Window left */}
      <rect x="60" y="108" width="25" height="22" rx="4" fill="#FFF8E1" />
      <line x1="72.5" y1="108" x2="72.5" y2="130" stroke="#E0E0E0" strokeWidth="1" />
      <line x1="60" y1="119" x2="85" y2="119" stroke="#E0E0E0" strokeWidth="1" />
      {/* Window right */}
      <rect x="115" y="108" width="25" height="22" rx="4" fill="#FFF8E1" />
      <line x1="127.5" y1="108" x2="127.5" y2="130" stroke="#E0E0E0" strokeWidth="1" />
      <line x1="115" y1="119" x2="140" y2="119" stroke="#E0E0E0" strokeWidth="1" />
      {/* Door */}
      <rect x="85" y="140" width="30" height="35" rx="6" fill="#8B4513" />
      <circle cx="108" cy="158" r="2.5" fill="#FFD93D" />
      {/* Welcome mat */}
      <rect x="82" y="172" width="36" height="4" rx="2" fill="#4CAF50" opacity="0.6" />
      <defs>
        <linearGradient id="house-grad" x1="45" y1="90" x2="155" y2="175" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFF3E0" />
          <stop offset="1" stopColor="#FFE0B2" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function LogoSVG() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', maxWidth: 280 }}>
      {/* Outer ring */}
      <circle cx="100" cy="100" r="80" fill="url(#logo-grad)" />
      <circle cx="100" cy="100" r="72" fill="#FCE869" />
      {/* W letter */}
      <path
        d="M55 70 L70 130 L85 90 L100 130 L115 90 L130 130 L145 70"
        stroke="#1a1a1a"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Speed lines */}
      <line x1="48" y1="145" x2="72" y2="145" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      <line x1="55" y1="153" x2="80" y2="153" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <line x1="120" y1="145" x2="152" y2="145" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      <line x1="125" y1="153" x2="148" y2="153" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <defs>
        <linearGradient id="logo-grad" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD93D" />
          <stop offset="1" stopColor="#FF6B35" />
        </linearGradient>
      </defs>
    </svg>
  );
}
