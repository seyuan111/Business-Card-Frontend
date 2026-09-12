export const LOGO_STORAGE_KEY = 'createdLogos';

const escapeXml = (value = '') =>
  value.replace(/[<>&'\"]/g, (character) => {
    const entities = { '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '\"': '&quot;' };
    return entities[character];
  });

const getLogoStyle = (industry = '') => {
  const normalized = industry.toLowerCase();

  if (normalized.includes('food') || normalized.includes('beverage') || normalized.includes('drink')) {
    return { primary: '#0f766e', secondary: '#f59e0b', background: '#fff7ed', icon: 'cup' };
  }
  if (normalized.includes('creative') || normalized.includes('design')) {
    return { primary: '#7c3aed', secondary: '#ec4899', background: '#faf5ff', icon: 'star' };
  }
  if (normalized.includes('health')) {
    return { primary: '#0f766e', secondary: '#14b8a6', background: '#f0fdfa', icon: 'cross' };
  }
  if (normalized.includes('finance') || normalized.includes('real')) {
    return { primary: '#1e3a8a', secondary: '#38bdf8', background: '#eff6ff', icon: 'bars' };
  }
  return { primary: '#1d4ed8', secondary: '#06b6d4', background: '#f0f9ff', icon: 'spark' };
};

const getIcon = (icon, primary, secondary) => {
  if (icon === 'cup') {
    return `<path d="M285 235h230l-20 285H305z" fill="${primary}"/><path d="M360 235c0-74 80-74 80 0M440 235c0-74 80-74 80 0" fill="none" stroke="${secondary}" stroke-width="18" stroke-linecap="round"/><path d="M330 325h140M345 410h110" stroke="${secondary}" stroke-width="14" stroke-linecap="round"/><circle cx="350" cy="555" r="13" fill="${secondary}"/><circle cx="400" cy="555" r="13" fill="${secondary}"/><circle cx="450" cy="555" r="13" fill="${secondary}"/>`;
  }
  if (icon === 'cross') return `<path d="M370 245h60v105h105v60H430v105h-60V410H265v-60h105z" fill="${primary}"/>`;
  if (icon === 'bars') return `<path d="M275 520V390h65v130zm95 0V300h65v220zm95 0V220h65v300z" fill="${primary}"/><path d="m270 315 90-55 85 28 100-86" fill="none" stroke="${secondary}" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>`;
  if (icon === 'printer') return `<path d="M285 330V220h230v110M285 470h-55V335h340v135h-55" fill="none" stroke="${primary}" stroke-width="24" stroke-linejoin="round"/><path d="M300 430h200v150H300z" fill="${secondary}"/><path d="M330 475h140M330 520h105" stroke="${primary}" stroke-width="14" stroke-linecap="round"/><circle cx="535" cy="375" r="12" fill="${secondary}"/>`;
  if (icon === 'coffee') return `<path d="M295 300h240v155c0 78-54 125-120 125s-120-47-120-125z" fill="${primary}"/><path d="M535 340h38c52 0 72 35 72 72s-20 72-72 72h-38" fill="none" stroke="${secondary}" stroke-width="20"/><path d="M350 235c-24-30 24-42 0-72M420 235c-24-30 24-42 0-72" fill="none" stroke="${secondary}" stroke-width="14" stroke-linecap="round"/><path d="M270 600h300" stroke="${secondary}" stroke-width="18" stroke-linecap="round"/>`;
  if (icon === 'dumbbell') return `<path d="M265 330v140M315 300v200M685 330v140M635 300v200" stroke="${secondary}" stroke-width="28" stroke-linecap="round"/><path d="M315 400h320" stroke="${primary}" stroke-width="34" stroke-linecap="round"/><path d="M360 330v140M640 330v140" stroke="${primary}" stroke-width="18" stroke-linecap="round"/>`;
  if (icon === 'pizza') return `<path d="m400 210 190 360H210z" fill="${secondary}" stroke="${primary}" stroke-width="18" stroke-linejoin="round"/><circle cx="360" cy="370" r="18" fill="${primary}"/><circle cx="455" cy="430" r="18" fill="${primary}"/><circle cx="405" cy="500" r="18" fill="${primary}"/>`;
  if (icon === 'cake') return `<path d="M260 380h280v170H260z" fill="${primary}"/><path d="M230 380h340v-35c0-42-48-65-85-38-28-45-82-45-110 0-38-27-85-4-85 38z" fill="${secondary}"/><path d="M315 275v-65M400 275v-65M485 275v-65" stroke="${primary}" stroke-width="18" stroke-linecap="round"/>`;
  if (icon === 'utensils') return `<path d="M300 210v160c0 35 55 35 55 0V210M327 210v190M470 210v390M470 210c95 50 95 150 0 160" fill="none" stroke="${primary}" stroke-width="22" stroke-linecap="round"/>`;
  if (icon === 'laptop') return `<rect x="275" y="240" width="250" height="190" rx="14" fill="none" stroke="${primary}" stroke-width="22"/><path d="M220 500h360l-45 60H265z" fill="${secondary}"/>`;
  if (icon === 'camera') return `<path d="M255 300h290v230H255z" fill="none" stroke="${primary}" stroke-width="22"/><circle cx="400" cy="415" r="62" fill="none" stroke="${secondary}" stroke-width="20"/><path d="M320 300 350 250h100l30 50" fill="${secondary}"/>`;
  if (icon === 'stethoscope') return `<path d="M290 230v105c0 92 130 92 130 0V230M290 230c0 42-65 42-65 0M420 230c0 42 65 42 65 0M420 435v55c0 80 130 80 130 0v-30" fill="none" stroke="${primary}" stroke-width="22" stroke-linecap="round"/><circle cx="550" cy="460" r="34" fill="${secondary}"/>`;
  if (icon === 'heart-pulse') return `<path d="M400 560 245 405c-85-85 35-220 155-105 120-115 240 20 155 105z" fill="none" stroke="${primary}" stroke-width="22"/><path d="M270 390h70l25-55 45 115 35-60 25 0" fill="none" stroke="${secondary}" stroke-width="18" stroke-linejoin="round"/>`;
  if (icon === 'shopping-bag') return `<path d="M275 300h250l-25 275H300z" fill="none" stroke="${primary}" stroke-width="22"/><path d="M345 310v-35c0-75 110-75 110 0v35" fill="none" stroke="${secondary}" stroke-width="20" stroke-linecap="round"/>`;
  if (icon === 'store') return `<path d="M245 300h310l-35-80H280zM275 300v280h250V300M245 300c0 55 75 55 75 0 0 55 75 55 75 0 0 55 75 55 75 0 0 55 75 75 0" fill="none" stroke="${primary}" stroke-width="20" stroke-linejoin="round"/><path d="M350 580v-105h80v105" fill="${secondary}"/>`;
  if (icon === 'car') return `<path d="M250 470h300l-35-115H285z" fill="${primary}"/><path d="M315 355h170l-30-65H345z" fill="${secondary}"/><circle cx="320" cy="480" r="35" fill="none" stroke="${secondary}" stroke-width="18"/><circle cx="480" cy="480" r="35" fill="none" stroke="${secondary}" stroke-width="18"/>`;
  if (icon === 'plane') return `<path d="m220 420 510-145-190 125 40 150-55 15-75-125-150 35z" fill="${primary}"/><path d="m405 382 45-120 55-15-20 145" fill="${secondary}"/>`;
  if (icon === 'paw-print') return `<circle cx="315" cy="300" r="42" fill="${secondary}"/><circle cx="485" cy="300" r="42" fill="${secondary}"/><circle cx="255" cy="390" r="38" fill="${secondary}"/><circle cx="545" cy="390" r="38" fill="${secondary}"/><path d="M400 350c-95 0-150 165 0 210 150-45 95-210 0-210z" fill="${primary}"/>`;
  if (icon === 'scissors') return `<circle cx="300" cy="480" r="55" fill="none" stroke="${primary}" stroke-width="20"/><circle cx="500" cy="480" r="55" fill="none" stroke="${primary}" stroke-width="20"/><path d="m340 440 180-200M460 440 280 240" stroke="${secondary}" stroke-width="20" stroke-linecap="round"/>`;
  if (icon === 'trophy') return `<path d="M300 230h200v110c0 125-200 125-200 0z" fill="${secondary}"/><path d="M300 270h-65c0 100 65 100 90 100M500 270h65c0 100-65 100-90 100M400 460v100M325 590h150" fill="none" stroke="${primary}" stroke-width="22" stroke-linecap="round"/>`;
  if (icon === 'music') return `<path d="M470 230v250c0 65-130 65-130 0 0-55 75-65 130-35M470 230l145-35v70l-145 35z" fill="none" stroke="${primary}" stroke-width="22" stroke-linejoin="round"/>`;
  if (icon === 'book-open') return `<path d="M400 275c-65-55-130-55-195-20v285c65-35 130-35 195 20zM400 275c65-55 130-55 195-20v285c-65-35-130-35-195 20z" fill="none" stroke="${primary}" stroke-width="22" stroke-linejoin="round"/><path d="M400 275v285" stroke="${secondary}" stroke-width="18"/>`;
  if (icon === 'leaf') return `<path d="M540 220c-210 0-285 100-285 210 0 95 95 125 170 50 80-80 100-180 115-260z" fill="none" stroke="${primary}" stroke-width="22"/><path d="M255 500c80-85 160-130 255-190" stroke="${secondary}" stroke-width="18" stroke-linecap="round"/>`;
  if (icon === 'home') return `<path d="m220 390 180-155 180 155v190H220z" fill="none" stroke="${primary}" stroke-width="22" stroke-linejoin="round"/><path d="M360 580v-110h80v110" fill="${secondary}"/>`;
  if (icon === 'star' || icon === 'sparkles') return `<path d="m400 205 38 119 126 2-100 75 35 121-99-70-99 70 35-121-100-75 126-2z" fill="${primary}" stroke="${secondary}" stroke-width="14" stroke-linejoin="round"/>`;
  return `<path d="m400 205 24 48 53 8-38 37 9 53-48-25-48 25 9-53-38-37 53-8z" fill="${secondary}"/><circle cx="400" cy="400" r="145" fill="none" stroke="${primary}" stroke-width="18"/><path d="M400 300v200M300 400h200" stroke="${primary}" stroke-width="12" stroke-linecap="round"/>`;
};

export const createLogoSvg = (companyName, industry, iconName = '') => {
  const safeName = escapeXml(companyName.trim());
  const style = getLogoStyle(industry);
  const selectedIcon = iconName === 'bubble-tea' ? 'cup' : iconName || style.icon;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="700" viewBox="0 0 1000 700">
  <g>${getIcon(selectedIcon, style.primary, style.secondary)}</g>
  <text x="500" y="610" text-anchor="middle" fill="${style.primary}" font-family="Georgia, serif" font-size="54" font-weight="700">${safeName}</text>
  <text x="500" y="655" text-anchor="middle" fill="${style.secondary}" font-family="Arial, sans-serif" font-size="18" letter-spacing="5">${escapeXml(industry || 'BRAND')}</text>
</svg>`;
};

export const svgToDataUrl = (svg) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

export const readCreatedLogos = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(LOGO_STORAGE_KEY) || '[]');
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
};
