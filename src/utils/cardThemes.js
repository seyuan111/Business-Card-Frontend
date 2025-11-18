export const CARD_THEMES = {
  classic: {
    labelText: 'Classic',
    base: 'bg-gradient-to-br from-[#5e2a10] via-[#8b4a1e] to-[#2c1208] text-white',
    swatch: 'bg-gradient-to-br from-[#5e2a10] via-[#8b4a1e] to-[#2c1208]',
    accentElements: [
      '-top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl',
      'top-8 right-10 w-16 h-16 border border-white/40 rounded-full',
      '-bottom-6 left-10 w-28 h-28 bg-amber-500/30 rounded-full blur-xl',
    ],
    label: 'text-amber-100/80',
    sub: 'text-white/80',
    heart: 'text-white',
    logoBg: 'bg-white/10 border-white/30',
    logoText: 'text-white/70',
    print: {
      background: 'linear-gradient(135deg, #5e2a10, #8b4a1e)',
      text: '#ffffff',
      subText: 'rgba(255,255,255,0.8)',
      border: 'none',
    },
  },
  modern: {
    labelText: 'Modern',
    base: 'bg-gradient-to-r from-[#f5e0c3] via-[#f0c48a] to-[#b3521d] text-slate-900',
    swatch: 'bg-gradient-to-r from-[#f5e0c3] via-[#f0c48a] to-[#b3521d]',
    accentElements: [
      '-top-8 right-10 w-32 h-32 bg-white/40 rounded-full blur-2xl',
      'bottom-0 left-0 w-36 h-36 bg-[#9f592c]/30 rounded-tr-[80px]',
      'top-0 left-6 w-12 h-12 border-2 border-[#b3521d]/30 rounded-full',
    ],
    label: 'text-[#8a4318]',
    sub: 'text-[#7a5131]',
    heart: 'text-[#8a4318]',
    logoBg: 'bg-white/60 border-[#8a4318]/30',
    logoText: 'text-[#8a4318]',
    print: {
      background: 'linear-gradient(135deg, #f5e0c3, #b3521d)',
      text: '#1f2937',
      subText: '#7a5131',
      border: 'none',
    },
  },
  ocean: {
    labelText: 'Ocean',
    base: 'bg-gradient-to-br from-[#003843] via-[#015f63] to-[#0f2d3a] text-white',
    swatch: 'bg-gradient-to-br from-[#003843] via-[#015f63] to-[#0f2d3a]',
    accentElements: [
      '-top-6 left-4 w-24 h-24 border border-white/30 rounded-full',
      '-bottom-6 right-0 w-32 h-32 bg-cyan-400/40 rounded-tl-[120px]',
      'top-10 right-12 w-12 h-12 bg-white/20 rounded-full',
    ],
    label: 'text-cyan-100/80',
    sub: 'text-white/70',
    heart: 'text-white',
    logoBg: 'bg-white/10 border-white/30',
    logoText: 'text-white/70',
    print: {
      background: 'linear-gradient(135deg, #015f63, #0f2d3a)',
      text: '#ffffff',
      subText: 'rgba(255,255,255,0.8)',
      border: 'none',
    },
  },
  minimal: {
    labelText: 'Minimal',
    base: 'bg-white text-slate-900 border border-slate-200',
    swatch: 'bg-white border border-slate-200',
    accentElements: [
      'top-5 right-5 w-12 h-12 border border-slate-200 rounded-full',
      'bottom-0 left-0 w-full h-10 bg-slate-100',
    ],
    label: 'text-slate-500',
    sub: 'text-slate-500',
    heart: 'text-slate-400',
    logoBg: 'bg-slate-100 border-slate-200',
    logoText: 'text-slate-500',
    badge: { label: 'Free', bg: 'bg-emerald-100 text-emerald-700' },
    print: {
      background: '#ffffff',
      text: '#111827',
      subText: '#6b7280',
      border: '1px solid #e5e7eb',
    },
  },
  espresso: {
    labelText: 'Espresso',
    base: 'bg-gradient-to-br from-[#3b1f0f] via-[#5c2d17] to-[#1f0b04] text-white',
    swatch: 'bg-gradient-to-br from-[#3b1f0f] via-[#5c2d17] to-[#1f0b04]',
    accentElements: [
      'top-4 right-6 w-16 h-16 border border-amber-200/50 rounded-full',
      '-bottom-8 left-4 w-32 h-32 bg-amber-500/25 rounded-full blur-xl',
      '-top-6 left-10 w-20 h-20 bg-white/5 rounded-full',
    ],
    label: 'text-amber-100/80',
    sub: 'text-white/75',
    heart: 'text-white',
    logoBg: 'bg-white/10 border-white/30',
    logoText: 'text-amber-100',
    print: {
      background: 'linear-gradient(135deg, #3b1f0f, #5c2d17)',
      text: '#ffffff',
      subText: 'rgba(255,255,255,0.75)',
      border: 'none',
    },
  },
  forest: {
    labelText: 'Forest',
    base: 'bg-gradient-to-br from-[#0b3d2e] via-[#166534] to-[#0e2416] text-white',
    swatch: 'bg-gradient-to-br from-[#0b3d2e] via-[#166534] to-[#0e2416]',
    accentElements: [
      '-top-6 right-6 w-20 h-20 bg-emerald-400/30 rounded-full blur-lg',
      '-bottom-10 left-6 w-28 h-28 bg-emerald-700/40 rounded-full blur-xl',
      'top-10 left-10 w-10 h-10 border border-white/30 rounded-full',
    ],
    label: 'text-emerald-100/80',
    sub: 'text-white/75',
    heart: 'text-white',
    logoBg: 'bg-white/10 border-white/30',
    logoText: 'text-emerald-100',
    print: {
      background: 'linear-gradient(135deg, #166534, #0b3d2e)',
      text: '#ffffff',
      subText: 'rgba(255,255,255,0.75)',
      border: 'none',
    },
  },
  emerald: {
    labelText: 'Emerald',
    base: 'bg-gradient-to-br from-[#0b8a4d] via-[#0b6b3a] to-[#06351d] text-white',
    swatch: 'bg-gradient-to-br from-[#0b8a4d] via-[#0b6b3a] to-[#06351d]',
    accentElements: [
      'top-0 right-6 w-14 h-14 border border-white/30 rounded-full',
      '-bottom-6 right-8 w-24 h-24 bg-emerald-300/40 rounded-tl-[80px]',
      '-top-6 left-0 w-32 h-32 bg-emerald-500/25 rounded-full blur-xl',
    ],
    label: 'text-emerald-50/80',
    sub: 'text-white/80',
    heart: 'text-white',
    logoBg: 'bg-white/10 border-white/30',
    logoText: 'text-emerald-50',
    print: {
      background: 'linear-gradient(135deg, #0b8a4d, #06351d)',
      text: '#ffffff',
      subText: 'rgba(255,255,255,0.8)',
      border: 'none',
    },
  },
};

export const getCardTheme = (design = 'classic') =>
  CARD_THEMES[design] || CARD_THEMES.classic;

export const CARD_THEME_OPTIONS = Object.entries(CARD_THEMES).map(
  ([key, theme]) => ({
    key,
    label: theme.labelText,
  })
);
