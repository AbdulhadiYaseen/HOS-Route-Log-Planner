import React from 'react';

// Common wrapper style for 3D icons to support hover effects and consistent sizing
const IconWrapper = ({ children, size = 24, className = '', style = {} }) => {
  return (
    <span 
      className={`icon-3d-wrapper ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: `${size}px`,
        height: `${size}px`,
        verticalAlign: 'middle',
        ...style
      }}
    >
      {children}
    </span>
  );
};

// 1. Lightning3D / Logo3D (⚡ replacement)
export const Lightning3D = ({ size = 24, className = '' }) => (
  <IconWrapper size={size} className={className}>
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="lightningFront" x1="12" y1="4" x2="48" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="lightningSide" x1="16" y1="4" x2="52" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <filter id="lightningGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#f59e0b" floodOpacity="0.4" />
        </filter>
      </defs>
      {/* 3D Extrusion Side */}
      <path 
        d="M38 2L14 34H26L18 62L50 26H34L38 2Z" 
        fill="url(#lightningSide)" 
        transform="translate(3, 3)"
      />
      {/* Front Face */}
      <path 
        d="M38 2L14 34H26L18 62L50 26H34L38 2Z" 
        fill="url(#lightningFront)" 
        filter="url(#lightningGlow)"
      />
      {/* Inner highlight line */}
      <path 
        d="M37 5L17 33H28L21 57" 
        stroke="#fff" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeOpacity="0.5"
      />
    </svg>
  </IconWrapper>
);

// 2. Shield3D (🛡️ replacement - Safety Managers)
export const Shield3D = ({ size = 24, className = '' }) => (
  <IconWrapper size={size} className={className}>
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="shieldFront" x1="32" y1="2" x2="32" y2="62" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="shieldSide" x1="32" y1="2" x2="32" y2="62" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
        <linearGradient id="shieldRim" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.3" />
        </linearGradient>
        <filter id="shieldShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#1e3a8a" floodOpacity="0.5" />
        </filter>
      </defs>
      {/* Back extrusion shadow */}
      <path 
        d="M32 62C32 62 56 46 56 22V8L32 2L8 8V22C8 46 32 62 32 62Z" 
        fill="url(#shieldSide)" 
        transform="translate(2, 3)"
      />
      {/* Front shield face */}
      <path 
        d="M32 62C32 62 56 46 56 22V8L32 2L8 8V22C8 46 32 62 32 62Z" 
        fill="url(#shieldFront)" 
        filter="url(#shieldShadow)"
      />
      {/* Silver metallic rim outline */}
      <path 
        d="M32 59C32 59 52 44 52 22V10L32 5L12 10V22C12 44 32 59 32 59Z" 
        stroke="url(#shieldRim)" 
        strokeWidth="3" 
        fill="none"
      />
      {/* Inner check or lock symbol on shield */}
      <path 
        d="M23 28L29 34L41 22" 
        stroke="#ffffff" 
        strokeWidth="4" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  </IconWrapper>
);

// 3. Compass3D (🧭 replacement - Dispatchers)
export const Compass3D = ({ size = 24, className = '' }) => (
  <IconWrapper size={size} className={className}>
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id="compassFace" cx="32" cy="32" r="28" fx="24" fy="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#374151" />
          <stop offset="80%" stopColor="#1f2937" />
          <stop offset="100%" stopColor="#111827" />
        </radialGradient>
        <linearGradient id="compassRim" x1="4" y1="4" x2="60" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
        <linearGradient id="needleNorth" x1="32" y1="8" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
        <linearGradient id="needleSouth" x1="32" y1="32" x2="32" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#e5e7eb" />
          <stop offset="100%" stopColor="#9ca3af" />
        </linearGradient>
        <filter id="compassShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.4" />
        </filter>
      </defs>
      {/* 3D Side Rim Extrusion */}
      <circle cx="32" cy="34" r="28" fill="#4b5563" />
      {/* Main outer rim */}
      <circle cx="32" cy="32" r="28" stroke="url(#compassRim)" strokeWidth="4" fill="url(#compassFace)" filter="url(#compassShadow)" />
      {/* Dial ticks */}
      <line x1="32" y1="8" x2="32" y2="12" stroke="#d97706" strokeWidth="2" />
      <line x1="32" y1="52" x2="32" y2="56" stroke="#9ca3af" strokeWidth="2" />
      <line x1="8" y1="32" x2="12" y2="32" stroke="#9ca3af" strokeWidth="2" />
      <line x1="52" y1="32" x2="56" y2="32" stroke="#9ca3af" strokeWidth="2" />
      {/* Needle Shadow */}
      <path d="M32 10L37 32L32 35L27 32L32 10Z" fill="#000" fillOpacity="0.3" transform="translate(2, 3)" />
      <path d="M32 54L37 32L32 29L27 32L32 54Z" fill="#000" fillOpacity="0.3" transform="translate(2, 3)" />
      {/* Needle North (Red) */}
      <path d="M32 10L36 32H28L32 10Z" fill="url(#needleNorth)" />
      {/* Needle South (Silver) */}
      <path d="M32 54L36 32H28L32 54Z" fill="url(#needleSouth)" />
      {/* Center cap */}
      <circle cx="32" cy="32" r="3" fill="#ffffff" />
      <circle cx="32" cy="32" r="1.5" fill="#111827" />
    </svg>
  </IconWrapper>
);

// 4. Chart3D (📊 replacement - Fleet Directors / Analytics)
export const Chart3D = ({ size = 24, className = '' }) => (
  <IconWrapper size={size} className={className}>
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="gridGrad" x1="0" y1="64" x2="64" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        {/* Colors for 3D Bar 1 */}
        <linearGradient id="bar1Front" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="bar1Side" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        {/* Colors for 3D Bar 2 */}
        <linearGradient id="bar2Front" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="bar2Side" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        {/* Colors for 3D Bar 3 */}
        <linearGradient id="bar3Front" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="bar3Side" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
        <filter id="chartShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.3" />
        </filter>
      </defs>
      {/* 3D Base grid plate */}
      <path d="M4 48 L28 58 L60 44 L36 34 Z" fill="url(#gridGrad)" filter="url(#chartShadow)" />
      
      {/* Bar 1 (Left - Green) - Height 20 */}
      {/* Front Face */}
      <path d="M12 40 L20 44V51L12 47V40Z" fill="url(#bar1Front)" />
      {/* Side Face */}
      <path d="M20 44 L28 40V47L20 51V44Z" fill="url(#bar1Side)" />
      {/* Top Face */}
      <path d="M12 40 L20 36 L28 40 L20 44 Z" fill="#6ee7b7" />

      {/* Bar 2 (Middle - Blue) - Height 32 */}
      {/* Front Face */}
      <path d="M26 24 L34 28V44L26 40V24Z" fill="url(#bar2Front)" />
      {/* Side Face */}
      <path d="M34 28 L42 24V40L34 44V28Z" fill="url(#bar2Side)" />
      {/* Top Face */}
      <path d="M26 24 L34 20 L42 24 L34 28 Z" fill="#93c5fd" />

      {/* Bar 3 (Right - Purple) - Height 42 */}
      {/* Front Face */}
      <path d="M40 10 L48 14V34L40 30V10Z" fill="url(#bar3Front)" />
      {/* Side Face */}
      <path d="M48 14 L56 10V30L48 34V14Z" fill="url(#bar3Side)" />
      {/* Top Face */}
      <path d="M40 10 L48 6 L56 10 L48 14 Z" fill="#c4b5fd" />
    </svg>
  </IconWrapper>
);

// 5. Truck3D (🚚 replacement - Owner-Operators)
export const Truck3D = ({ size = 24, className = '' }) => (
  <IconWrapper size={size} className={className}>
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="cabGrad" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
        <linearGradient id="containerGrad" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
        <linearGradient id="wheelGrad" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#374151" />
          <stop offset="100%" stopColor="#111827" />
        </linearGradient>
        <filter id="truckShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.4" />
        </filter>
      </defs>
      {/* 3D ground shadow */}
      <ellipse cx="32" cy="52" rx="26" ry="6" fill="#000" fillOpacity="0.3" />

      <g filter="url(#truckShadow)">
        {/* CARGO CONTAINER (3D box, back left) */}
        <path d="M6 18 L34 26V42L6 34V18Z" fill="url(#containerGrad)" />
        <path d="M34 26 L44 21V37L34 42V26Z" fill="#64748b" /> {/* Container side panel */}
        <path d="M6 18 L16 13 L44 21 L34 26 Z" fill="#f1f5f9" /> {/* Container top panel */}

        {/* TRUCK CAB (Red 3D block, front right) */}
        <path d="M34 32 L46 35V49L34 46V32Z" fill="url(#cabGrad)" /> {/* Cab rear section */}
        <path d="M46 35 L56 31V45L46 49V35Z" fill="#991b1b" /> {/* Cab hood front/side */}
        <path d="M34 32 L44 28 L54 31 L46 35 Z" fill="#f87171" /> {/* Cab top roof */}

        {/* Windows and details */}
        <path d="M48 34 L53 32V38L48 40V34Z" fill="#38bdf8" stroke="#1e293b" strokeWidth="0.5" /> {/* Windshield */}
        <path d="M38 34 L43 35V41L38 40V34Z" fill="#38bdf8" stroke="#1e293b" strokeWidth="0.5" /> {/* Side window */}
        <path d="M46 49 H52" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" /> {/* Front yellow bumper light */}

        {/* WHEELS */}
        <circle cx="16" cy="48" r="5" fill="url(#wheelGrad)" stroke="#6b7280" strokeWidth="1" />
        <circle cx="16" cy="48" r="2.5" fill="#d1d5db" />

        <circle cx="28" cy="51" r="5" fill="url(#wheelGrad)" stroke="#6b7280" strokeWidth="1" />
        <circle cx="28" cy="51" r="2.5" fill="#d1d5db" />

        <circle cx="48" cy="47" r="5" fill="url(#wheelGrad)" stroke="#6b7280" strokeWidth="1" />
        <circle cx="48" cy="47" r="2.5" fill="#d1d5db" />
      </g>
    </svg>
  </IconWrapper>
);

// 6. Clipboard3D (📋 replacement - Safety Auditors / Log sheets)
export const Clipboard3D = ({ size = 24, className = '' }) => (
  <IconWrapper size={size} className={className}>
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="boardBase" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
        <linearGradient id="paperGrad" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f1f5f9" />
        </linearGradient>
        <filter id="clipboardShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.3" />
        </filter>
      </defs>
      {/* 3D Board Extrusion */}
      <rect x="14" y="10" width="36" height="46" rx="3" fill="#451a03" transform="translate(2, 3)" />
      {/* Board Base */}
      <rect x="14" y="10" width="36" height="46" rx="3" fill="url(#boardBase)" filter="url(#clipboardShadow)" />
      
      {/* Sheet of paper */}
      <rect x="18" y="16" width="28" height="36" rx="1" fill="url(#paperGrad)" />
      
      {/* Horizontal document lines */}
      <line x1="22" y1="24" x2="34" y2="24" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
      <line x1="22" y1="30" x2="42" y2="30" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
      <line x1="22" y1="36" x2="38" y2="36" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
      <line x1="22" y1="42" x2="42" y2="42" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
      
      {/* 3D Top Metal Clip */}
      <path d="M26 6 H38 V12 H26 Z" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
      <path d="M26 6 L30 3 H34 L38 6 Z" fill="#cbd5e1" />
      <circle cx="32" cy="9" r="1.5" fill="#475569" />
    </svg>
  </IconWrapper>
);

// 7. Map3D (🗺️ replacement - Interactive Planner)
export const Map3D = ({ size = 24, className = '' }) => (
  <IconWrapper size={size} className={className}>
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="mapLeft" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="mapMid" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
        <linearGradient id="mapRight" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#075985" />
        </linearGradient>
        <filter id="mapShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0284c7" floodOpacity="0.3" />
        </filter>
      </defs>
      
      {/* 3D Drop Shadow below */}
      <path d="M6 46 L24 54 L42 46 L60 54 L58 57 L42 49 L24 57 L8 49 Z" fill="#000" fillOpacity="0.2" />

      <g filter="url(#mapShadow)">
        {/* Folded Map Panel 1 (Left) */}
        <path d="M6 16 L24 24 V52 L6 44 Z" fill="url(#mapLeft)" />
        {/* Folded Map Panel 2 (Middle) */}
        <path d="M24 24 L42 16 V44 L24 52 Z" fill="url(#mapMid)" />
        {/* Folded Map Panel 3 (Right) */}
        <path d="M42 16 L60 24 V52 L42 44 Z" fill="url(#mapRight)" />

        {/* Route markings */}
        <path 
          d="M10 36 Q18 30 24 38 T36 28 T54 36" 
          stroke="#f59e0b" 
          strokeWidth="3.5" 
          strokeLinecap="round" 
          fill="none" 
          strokeDasharray="1 1"
        />

        {/* Pins */}
        <circle cx="16" cy="30" r="3" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
        <circle cx="50" cy="34" r="3" fill="#10b981" stroke="#ffffff" strokeWidth="1" />
      </g>
    </svg>
  </IconWrapper>
);

// 8. Robot3D (🤖 replacement - AI Assistant)
export const Robot3D = ({ size = 24, className = '' }) => (
  <IconWrapper size={size} className={className}>
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="botHead" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
        <linearGradient id="botEar" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
        <radialGradient id="cyanEye" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a5f3fc" />
          <stop offset="60%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#0891b2" />
        </radialGradient>
        <filter id="botShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#475569" floodOpacity="0.4" />
        </filter>
      </defs>
      {/* Ground shadow */}
      <ellipse cx="32" cy="56" rx="20" ry="4" fill="#000" fillOpacity="0.2" />

      {/* Ears */}
      <rect x="6" y="24" width="6" height="16" rx="2" fill="url(#botEar)" />
      <rect x="52" y="24" width="6" height="16" rx="2" fill="url(#botEar)" />

      {/* Robot Head Body */}
      <rect x="10" y="14" width="44" height="36" rx="8" fill="url(#botHead)" filter="url(#botShadow)" stroke="#cbd5e1" strokeWidth="1" />
      {/* 3D Front glass faceplate */}
      <rect x="14" y="18" width="36" height="20" rx="4" fill="#1e293b" />

      {/* Glowing Eyes */}
      <circle cx="24" cy="28" r="4.5" fill="url(#cyanEye)" />
      <circle cx="40" cy="28" r="4.5" fill="url(#cyanEye)" />

      {/* Mouth grill */}
      <rect x="22" y="42" width="20" height="3" rx="1.5" fill="#475569" />
      <line x1="26" y1="42" x2="26" y2="45" stroke="#94a3b8" />
      <line x1="32" y1="42" x2="32" y2="45" stroke="#94a3b8" />
      <line x1="38" y1="42" x2="38" y2="45" stroke="#94a3b8" />

      {/* Top Antenna */}
      <line x1="32" y1="14" x2="32" y2="6" stroke="#64748b" strokeWidth="3" />
      <circle cx="32" cy="4" r="4" fill="#22c55e" /> {/* Glowing green dot */}
    </svg>
  </IconWrapper>
);

// 9. Brain3D (🧠 replacement - AI compliance Router)
export const Brain3D = ({ size = 24, className = '' }) => (
  <IconWrapper size={size} className={className}>
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="brainNode" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <linearGradient id="brainNodeCenter" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <filter id="brainGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {/* 3D Nodes connections */}
      <g stroke="#e2e8f0" strokeWidth="2" strokeOpacity="0.4">
        <line x1="32" y1="32" x2="20" y2="20" />
        <line x1="32" y1="32" x2="44" y2="20" />
        <line x1="32" y1="32" x2="16" y2="36" />
        <line x1="32" y1="32" x2="48" y2="36" />
        <line x1="32" y1="32" x2="32" y2="52" />
        
        <line x1="20" y1="20" x2="16" y2="36" />
        <line x1="44" y1="20" x2="48" y2="36" />
        <line x1="16" y1="36" x2="32" y2="52" />
        <line x1="48" y1="36" x2="32" y2="52" />
      </g>

      {/* Nodes */}
      <circle cx="32" cy="32" r="9" fill="url(#brainNodeCenter)" filter="url(#brainGlow)" />
      <circle cx="30" cy="30" r="3" fill="#f5f3ff" fillOpacity="0.4" />

      <circle cx="20" cy="20" r="7" fill="url(#brainNode)" />
      <circle cx="18" cy="18" r="2.5" fill="#fff" fillOpacity="0.4" />

      <circle cx="44" cy="20" r="7" fill="url(#brainNode)" />
      <circle cx="42" cy="18" r="2.5" fill="#fff" fillOpacity="0.4" />

      <circle cx="16" cy="36" r="7" fill="url(#brainNode)" />
      <circle cx="14" cy="34" r="2.5" fill="#fff" fillOpacity="0.4" />

      <circle cx="48" cy="36" r="7" fill="url(#brainNode)" />
      <circle cx="46" cy="34" r="2.5" fill="#fff" fillOpacity="0.4" />

      <circle cx="32" cy="52" r="7" fill="url(#brainNode)" />
      <circle cx="30" cy="50" r="2.5" fill="#fff" fillOpacity="0.4" />
    </svg>
  </IconWrapper>
);

// 10. Lock3D (🔒 replacement - Secure & Reliable)
export const Lock3D = ({ size = 24, className = '' }) => (
  <IconWrapper size={size} className={className}>
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="lockBody" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="lockShackle" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
        <filter id="lockShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.3" />
        </filter>
      </defs>
      {/* Shackle Extrusion */}
      <path d="M18 28 V18 C18 10 24 6 32 6 C40 6 46 10 46 18 V28" stroke="#4b5563" strokeWidth="6" strokeLinecap="round" fill="none" transform="translate(1, 2)" />
      {/* Main Shackle */}
      <path d="M18 28 V18 C18 10 24 6 32 6 C40 6 46 10 46 18 V28" stroke="url(#lockShackle)" strokeWidth="6" strokeLinecap="round" fill="none" />

      {/* Lock Body 3D Extrusion */}
      <rect x="12" y="24" width="40" height="32" rx="6" fill="#78350f" transform="translate(2, 3)" />
      {/* Lock Body */}
      <rect x="12" y="24" width="40" height="32" rx="6" fill="url(#lockBody)" filter="url(#lockShadow)" />

      {/* Keyhole */}
      <circle cx="32" cy="36" r="3.5" fill="#1e293b" />
      <path d="M30.5 38 L33.5 38 L35 48 H29 Z" fill="#1e293b" />
    </svg>
  </IconWrapper>
);

// 11. Collaboration3D (🤝 replacement - Easy Collaboration)
export const Collaboration3D = ({ size = 24, className = '' }) => (
  <IconWrapper size={size} className={className}>
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="ringBlue" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="ringPurple" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#7e22ce" />
        </linearGradient>
        <filter id="collabShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.3" />
        </filter>
      </defs>
      {/* Two interlinked 3D metallic torus rings */}
      <g filter="url(#collabShadow)">
        {/* Ring 1 */}
        <ellipse cx="24" cy="32" rx="16" ry="12" stroke="url(#ringBlue)" strokeWidth="6" fill="none" transform="rotate(-15 24 32)" />
        
        {/* Ring 2 */}
        <ellipse cx="40" cy="32" rx="16" ry="12" stroke="url(#ringPurple)" strokeWidth="6" fill="none" transform="rotate(15 40 32)" />

        {/* Overlay patch of Ring 1 */}
        <path d="M22 41 C27 41 33 37 36 34" stroke="url(#ringBlue)" strokeWidth="6" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  </IconWrapper>
);

// 12. Building3D (🏢 replacement - Workspace Management)
export const Building3D = ({ size = 24, className = '' }) => (
  <IconWrapper size={size} className={className}>
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="buildFront" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <linearGradient id="buildSide" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <filter id="buildShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.4" />
        </filter>
      </defs>
      
      {/* Ground Shadow */}
      <ellipse cx="32" cy="56" rx="22" ry="5" fill="#000" fillOpacity="0.3" />

      {/* Skyscraper */}
      <g filter="url(#buildShadow)">
        {/* Front Face */}
        <path d="M14 20 L32 28 V52 L14 44 Z" fill="url(#buildFront)" />
        {/* Side Face */}
        <path d="M32 28 L50 20 V44 L32 52 Z" fill="url(#buildSide)" />
        {/* Top Face */}
        <path d="M14 20 L32 12 L50 20 L32 28 Z" fill="#64748b" />

        {/* Windows on Front Face */}
        <g fill="#38bdf8" fillOpacity="0.8">
          <path d="M18 26 L23 28 V30 L18 28 Z" />
          <path d="M25 29 L30 31 V33 L25 31 Z" />
          
          <path d="M18 32 L23 34 V36 L18 34 Z" />
          <path d="M25 35 L30 37 V39 L25 37 Z" />
          
          <path d="M18 38 L23 40 V42 L18 40 Z" />
          <path d="M25 41 L30 43 V45 L25 43 Z" />
        </g>

        {/* Windows on Side Face */}
        <g fill="#38bdf8" fillOpacity="0.5">
          <path d="M34 31 L39 29 V31 L34 33 Z" />
          <path d="M41 28 L46 26 V28 L41 30 Z" />
          
          <path d="M34 37 L39 35 V37 L34 39 Z" />
          <path d="M41 34 L46 32 V34 L41 36 Z" />
          
          <path d="M34 43 L39 41 V43 L34 45 Z" />
          <path d="M41 40 L46 38 V40 L41 42 Z" />
        </g>
      </g>
    </svg>
  </IconWrapper>
);

// 13. Bell3D (🔔 replacement - Safety Alerts / Notifications)
export const Bell3D = ({ size = 24, className = '' }) => (
  <IconWrapper size={size} className={className}>
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="bellGold" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <filter id="bellShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#d97706" floodOpacity="0.4" />
        </filter>
      </defs>
      {/* 3D Clapper */}
      <circle cx="32" cy="50" r="6" fill="#78350f" />

      {/* Bell Body */}
      <path 
        d="M32 6 C20 6 16 18 16 30 C16 36 12 40 8 44 H56 C52 40 48 36 48 30 C48 18 44 6 32 6 Z" 
        fill="url(#bellGold)" 
        filter="url(#bellShadow)" 
        stroke="#f59e0b" 
        strokeWidth="1"
      />

      {/* Bottom lip */}
      <path d="M8 44 C8 44 20 48 32 48 C44 48 56 44 56 44" stroke="#b45309" strokeWidth="3" fill="none" />

      {/* Top loop */}
      <circle cx="32" cy="5" r="4" stroke="url(#bellGold)" strokeWidth="3" fill="none" />
    </svg>
  </IconWrapper>
);

// 14. Clock3D (🕒 / ⏱️ replacement - Saved Trips / Time Clocks)
export const Clock3D = ({ size = 24, className = '' }) => (
  <IconWrapper size={size} className={className}>
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="clockRim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <linearGradient id="clockFace" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <filter id="clockShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.4" />
        </filter>
      </defs>
      {/* 3D Side depth */}
      <circle cx="32" cy="34" r="26" fill="#1e293b" />

      {/* Clock Outer Rim */}
      <circle cx="32" cy="32" r="26" stroke="url(#clockRim)" strokeWidth="4" fill="url(#clockFace)" filter="url(#clockShadow)" />

      {/* Hour ticks */}
      <line x1="32" y1="12" x2="32" y2="15" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
      <line x1="32" y1="49" x2="32" y2="52" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="32" x2="15" y2="32" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
      <line x1="49" y1="32" x2="52" y2="32" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />

      {/* Clock Hands */}
      <line x1="32" y1="32" x2="42" y2="24" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="32" y1="32" x2="32" y2="18" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />

      {/* Center Pin */}
      <circle cx="32" cy="32" r="2" fill="#ffffff" />
    </svg>
  </IconWrapper>
);

// 15. Gear3D (⚙️ replacement - Settings)
export const Gear3D = ({ size = 24, className = '' }) => (
  <IconWrapper size={size} className={className}>
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="gearGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
        <filter id="gearShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.4" />
        </filter>
      </defs>
      {/* 3D Side depth */}
      <path 
        d="M32 20C25.4 20 20 25.4 20 32C20 38.6 25.4 44 32 44C38.6 44 44 38.6 44 32C44 25.4 38.6 20 32 20Z" 
        fill="#334155" 
        transform="translate(1, 2)"
      />
      
      {/* Gear Base Ring */}
      <g filter="url(#gearShadow)">
        <circle cx="32" cy="32" r="14" fill="url(#gearGrad)" />
        <circle cx="32" cy="32" r="5" fill="#1f2937" />
        
        {/* Gear Teeth */}
        <g stroke="url(#gearGrad)" strokeWidth="5" strokeLinecap="round">
          <line x1="32" y1="13" x2="32" y2="18" />
          <line x1="32" y1="46" x2="32" y2="51" />
          <line x1="13" y1="32" x2="18" y2="32" />
          <line x1="46" y1="32" x2="51" y2="32" />
          
          <line x1="18.5" y1="18.5" x2="22" y2="22" />
          <line x1="42" y1="42" x2="45.5" y2="45.5" />
          <line x1="45.5" y1="18.5" x2="42" y2="22" />
          <line x1="22" y1="42" x2="18.5" y2="45.5" />
        </g>
      </g>
    </svg>
  </IconWrapper>
);

// 16. Envelope3D (✉️ replacement - Contact / Email)
export const Envelope3D = ({ size = 24, className = '' }) => (
  <IconWrapper size={size} className={className}>
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="envBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
        <linearGradient id="envFlap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <filter id="envShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0284c7" floodOpacity="0.4" />
        </filter>
      </defs>
      {/* 3D Back side extrusion */}
      <rect x="8" y="16" width="48" height="32" rx="4" fill="#075985" transform="translate(1, 3)" />

      {/* Main envelope body */}
      <rect x="8" y="16" width="48" height="32" rx="4" fill="url(#envBody)" filter="url(#envShadow)" />

      {/* Flaps */}
      <path d="M8 16 L28 34 C30.5 36 33.5 36 36 34 L56 16" stroke="#075985" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M8 48 L28 32 C30 30.5 34 30.5 36 32 L56 48" stroke="#075985" strokeWidth="2" strokeLinejoin="round" />

      {/* Top flap */}
      <path d="M8 16 L30 32 C31 33 33 33 34 32 L56 16 Z" fill="url(#envFlap)" opacity="0.9" />
    </svg>
  </IconWrapper>
);

// 17. Pin3D (📍 replacement - Location selector)
export const Pin3D = ({ size = 24, className = '' }) => (
  <IconWrapper size={size} className={className}>
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="pinGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
        <filter id="pinShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#991b1b" floodOpacity="0.4" />
        </filter>
      </defs>
      {/* Base shadow */}
      <ellipse cx="32" cy="56" rx="10" ry="3" fill="#000" fillOpacity="0.3" />

      {/* Pin Body */}
      <g filter="url(#pinShadow)">
        <path 
          d="M32 54C32 54 50 36 50 24C50 14 42 6 32 6C22 6 14 14 14 24C14 36 32 54 32 54Z" 
          fill="url(#pinGrad)" 
        />
        <circle cx="32" cy="22" r="7" fill="#ffffff" />
        <circle cx="32" cy="22" r="4" fill="#991b1b" />
      </g>
    </svg>
  </IconWrapper>
);

// 18. Warning3D (⚠️ / 🚨 / warning notification replacement)
export const Warning3D = ({ size = 24, className = '' }) => (
  <IconWrapper size={size} className={className}>
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="warningGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <filter id="warnShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#b45309" floodOpacity="0.4" />
        </filter>
      </defs>
      {/* Extrusion */}
      <path d="M32 6 L58 50 H6 Z" fill="#b45309" transform="translate(1, 3)" />
      
      {/* Warning triangle */}
      <path d="M32 6 L58 50 H6 Z" fill="url(#warningGrad)" filter="url(#warnShadow)" />

      {/* Exclamation */}
      <rect x="30" y="20" width="4" height="15" rx="2" fill="#ffffff" />
      <circle cx="32" cy="42" r="2.5" fill="#ffffff" />
    </svg>
  </IconWrapper>
);

// 19. Check3D (✅ replacement)
export const Check3D = ({ size = 24, className = '' }) => (
  <IconWrapper size={size} className={className}>
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="checkGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <filter id="checkShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#047857" floodOpacity="0.4" />
        </filter>
      </defs>
      <circle cx="32" cy="34" r="26" fill="#047857" />
      <circle cx="32" cy="32" r="26" fill="url(#checkGrad)" filter="url(#checkShadow)" />
      <path 
        d="M20 32 L28 40 L44 20" 
        stroke="#ffffff" 
        strokeWidth="6" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  </IconWrapper>
);

// 20. User3D (👤 replacement)
export const User3D = ({ size = 24, className = '' }) => (
  <IconWrapper size={size} className={className}>
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="userGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <filter id="userShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0284c7" floodOpacity="0.4" />
        </filter>
      </defs>
      {/* Shoulder base */}
      <path d="M12 50 C12 40 20 36 32 36 C44 36 52 40 52 50 V54 H12 V50 Z" fill="url(#userGrad)" filter="url(#userShadow)" />
      {/* Head */}
      <circle cx="32" cy="22" r="10" fill="url(#userGrad)" filter="url(#userShadow)" />
      <circle cx="30" cy="19" r="3" fill="#ffffff" fillOpacity="0.3" />
    </svg>
  </IconWrapper>
);

// 21. Search3D (🔍 replacement)
export const Search3D = ({ size = 24, className = '' }) => (
  <IconWrapper size={size} className={className}>
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="searchGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <filter id="searchShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0284c7" floodOpacity="0.4" />
        </filter>
      </defs>
      {/* Handle extrusion */}
      <line x1="42" y1="42" x2="56" y2="56" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" transform="translate(1, 2)" />
      <line x1="42" y1="42" x2="56" y2="56" stroke="url(#searchGrad)" strokeWidth="6" strokeLinecap="round" />
      {/* Glass ring */}
      <circle cx="28" cy="28" r="16" stroke="url(#searchGrad)" strokeWidth="5" fill="none" filter="url(#searchShadow)" />
      <circle cx="25" cy="25" r="10" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.3" fill="none" />
    </svg>
  </IconWrapper>
);


