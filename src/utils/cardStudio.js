import { getUserScopedKey, hasToken } from './auth';

export const CARD_WIDTH = 1050;
export const CARD_HEIGHT = 600;
export const FONTS = ['Arial', 'Georgia', 'Verdana', 'Trebuchet MS', 'Courier New', 'Times New Roman'];
export const TEMPLATES = [
  { id: 'studio', name: 'Studio Essentials', category: 'Minimal', background: '#f3f0e9', ink: '#292c29', accent: '#596a56', font: 'Arial', layout: 'split' },
  { id: 'editorial', name: 'The Editorial', category: 'Elegant', background: '#292a2b', ink: '#f4eee2', accent: '#c2ac84', font: 'Georgia', layout: 'editorial' },
  { id: 'botanical', name: 'Evergreen', category: 'Creative', background: '#e8ecdf', ink: '#244a3e', accent: '#355f4e', font: 'Georgia', layout: 'arch' },
  { id: 'cobalt', name: 'Cobalt Studio', category: 'Bold', background: '#3157e0', ink: '#ffffff', accent: '#d3f682', font: 'Arial', layout: 'bold' },
  { id: 'terracotta', name: 'Warm Introductions', category: 'Creative', background: '#edd9ca', ink: '#5a3028', accent: '#ad5946', font: 'Georgia', layout: 'split' },
  { id: 'midnight', name: 'Midnight Collective', category: 'Elegant', background: '#172b36', ink: '#f0e8d7', accent: '#afc1bb', font: 'Arial', layout: 'editorial' },
  { id: 'mono', name: 'Less Is More', category: 'Minimal', background: '#ffffff', ink: '#202020', accent: '#d9d9d4', font: 'Arial', layout: 'bold' },
  { id: 'arc', name: 'Golden Hour', category: 'Bold', background: '#efb64f', ink: '#342b26', accent: '#e18158', font: 'Trebuchet MS', layout: 'arch' },
  { id: 'pastel', name: 'Soft Geometry', category: 'Creative', background: '#ece8f1', ink: '#443c59', accent: '#a89cbf', font: 'Arial', layout: 'split' },
];
const aliases = { classic: 'editorial', modern: 'terracotta', ocean: 'midnight', minimal: 'mono', espresso: 'editorial', forest: 'botanical', emerald: 'botanical', sunrise: 'arc', neon: 'cobalt', slate: 'editorial', quartz: 'pastel' };
export const templateFor = (id) => TEMPLATES.find(t => t.id === (aliases[id] || id)) || TEMPLATES[0];
export const newId = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
export const studioKey = (prefix = 'generatedCards') => hasToken() ? getUserScopedKey(prefix) : `${prefix}:guest`;
export const readList = (key) => {
  const data = JSON.parse(localStorage.getItem(key) || '[]');
  if (!Array.isArray(data)) throw new Error('Saved card data could not be read.');
  return data;
};
export const loadCards = () => readList(studioKey());
export const findCard = (id) => loadCards().find(card => String(card.id) === String(id)) || (hasToken() ? readList('generatedCards:guest').find(card => String(card.id) === String(id)) : null);
export const saveCard = (card) => {
  const key = studioKey();
  const cards = readList(key);
  const existingIndex = cards.findIndex(item => String(item.id) === String(card.id));
  if (existingIndex >= 0) cards[existingIndex] = card;
  else cards.unshift(card);
  localStorage.setItem(key, JSON.stringify(cards));
  return card;
};

export const createScene = (card = {}, templateId = 'studio') => {
  const t = templateFor(templateId);
  const elements = [];
  const shape = (id, x, y, w, h, color, kind = 'rect', opacity = 1) => elements.push({ id, type: 'shape', x, y, w, h, color, shape: kind, opacity, rotation: 0 });
  const text = (field, content, x, y, w, size, options = {}) => {
    const value = String(content ?? '').trim();
    if (!value) return;
    elements.push({ id: field, field, type: 'text', text: value, x, y, w, h: options.h || size * 1.65, fontSize: size, fontFamily: t.font, fontWeight: 400, color: t.ink, align: 'left', rotation: 0, opacity: 1, ...options });
  };
  const brand = String(card.businessName || '').trim();
  if (t.layout === 'split') {
    shape('brand-block', 0, 0, 368, 600, t.accent);
    shape('brand-line', 423, 98, 64, 3, t.accent);
    text('businessName', brand, 40, 282, 290, 36, { color: '#ffffff', fontWeight: 700, align: 'center', h: 150 });
    shape('brand-mark', 145, 165, 72, 72, '#ffffff', 'circle', .85);
  } else if (t.layout === 'arch') {
    shape('arch-large', 670, -130, 550, 700, t.accent, 'circle', .23);
    shape('arch-small', 800, 80, 240, 240, t.accent, 'circle', .25);
    text('businessName', brand, 65, 65, 800, 25, { fontWeight: 700 });
  } else if (t.layout === 'bold') {
    shape('side-bar', 965, 0, 85, 600, t.accent);
    shape('brand-mark', 65, 62, 35, 35, t.ink, 'circle');
    text('businessName', brand, 120, 57, 740, 25, { fontWeight: 700 });
  } else {
    shape('frame-top', 55, 55, 940, 2, t.accent, 'rect', .7);
    shape('frame-bottom', 55, 545, 940, 2, t.accent, 'rect', .7);
    text('businessName', brand, 65, 92, 800, 24, { color: t.accent, fontWeight: 700 });
    shape('seal', 850, 90, 75, 75, t.accent, 'circle', .4);
  }
  const x = t.layout === 'split' ? 425 : 65;
  const contentWidth = t.layout === 'split' ? 555 : 800;
  text('name', card.name, x, 195, contentWidth, t.layout === 'split' ? 45 : 58, { fontWeight: 700, h: 90 });
  text('occupation', card.occupation, x, 290, contentWidth, 23);
  text('email', card.email, x, 386, contentWidth, 21);
  text('contact', card.contact, x, 425, contentWidth, 21);
  text('website', card.website, x, 464, contentWidth, 21);
  if (card.address) text('address', card.address, x, 510, contentWidth, 16, { h: 65 });
  if (String(card.fax || '').trim()) text('fax', `Fax: ${String(card.fax).trim()}`, x, 558, contentWidth, 14, { h: 28 });
  if (card.slogan && card.slogan !== brand) text('slogan', card.slogan, t.layout === 'split' ? 40 : 650, t.layout === 'split' ? 440 : 510, t.layout === 'split' ? 290 : 325, 16, { align: 'center', color: t.layout === 'split' ? '#ffffff' : t.ink, h: 90 });
  if (isImageSource(card.logoPreview)) {
    const mark = elements.findIndex(el => el.id === 'brand-mark' || el.id === 'seal');
    if (mark >= 0) elements.splice(mark, 1);
    elements.push({ id: 'logo', field: 'logoPreview', type: 'image', src: card.logoPreview, x: t.layout === 'split' ? 130 : 855, y: t.layout === 'split' ? 150 : 82, w: 100, h: 100, rotation: 0, opacity: 1 });
  }
  return { version: 1, templateId: t.id, width: CARD_WIDTH, height: CARD_HEIGHT, background: t.background, backgroundEnd: t.background, gradient: false, elements };
};

export const isImageSource = (src) => typeof src === 'string' && /^data:image\/(png|jpeg|webp|gif|svg\+xml)[;,]/i.test(src);
export const sceneFor = (card) => card?.editorScene?.version === 1 && Array.isArray(card.editorScene.elements) ? card.editorScene : createScene(card, card?.design);
export const cardWithScene = (card, scene) => {
  const fields = ['name', 'businessName', 'occupation', 'email', 'contact', 'website', 'address', 'fax', 'slogan', 'logoPreview'];
  const next = { ...card, ...Object.fromEntries(fields.map(field => [field, ''])), editorScene: scene, updatedAt: new Date().toISOString() };
  scene.elements.forEach(el => {
    if (el.field && el.type === 'text') next[el.field] = el.field === 'fax' ? el.text.replace(/^Fax:\s*/i, '') : el.text;
    if (el.field === 'logoPreview' && el.type === 'image') next.logoPreview = el.src;
  });
  if (!scene.elements.some(el => el.field === 'logoPreview')) next.logoPreview = '';
  return next;
};

const escapeXml = value => String(value ?? '').replace(/[<>&"']/g, char => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[char]));
const number = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const color = value => /^#[a-f\d]{3,8}$/i.test(value) ? value : '#222222';
let measureContext;
export const textLines = (element) => {
  if (typeof document !== 'undefined' && !measureContext) measureContext = document.createElement('canvas').getContext('2d');
  const fontSize = number(element.fontSize, 24);
  if (measureContext) measureContext.font = `${element.fontWeight || 400} ${fontSize}px ${FONTS.includes(element.fontFamily) ? element.fontFamily : 'Arial'}`;
  const measure = value => measureContext ? measureContext.measureText(value).width : value.length * fontSize * .6;
  const lines = [];
  String(element.text || '').split('\n').forEach(paragraph => {
    let line = '';
    for (const char of paragraph) {
      if (line && measure(line + char) > number(element.w, 300)) { lines.push(line.trimEnd()); line = char === ' ' ? '' : char; }
      else line += char;
    }
    lines.push(line);
  });
  return lines.slice(0, Math.max(1, Math.floor(number(element.h, 60) / (fontSize * 1.2))));
};

export const sceneSvg = scene => {
  const nodes = scene.elements.map(el => {
    const x = number(el.x), y = number(el.y), w = Math.max(1, number(el.w, 100)), h = Math.max(1, number(el.h, 60));
    const transform = `rotate(${number(el.rotation)} ${x + w / 2} ${y + h / 2})`;
    const attrs = `transform="${transform}" opacity="${Math.max(0, Math.min(1, number(el.opacity, 1)))}"`;
    if (el.type === 'shape') return el.shape === 'circle'
      ? `<ellipse cx="${x + w / 2}" cy="${y + h / 2}" rx="${w / 2}" ry="${h / 2}" fill="${color(el.color)}" ${attrs}/>`
      : `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${el.shape === 'rounded' ? Math.min(w,h)*.15 : 0}" fill="${color(el.color)}" ${attrs}/>`;
    if (el.type === 'image' && isImageSource(el.src)) return `<image href="${escapeXml(el.src)}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="${el.fit === 'cover' ? 'xMidYMid slice' : 'xMidYMid meet'}" ${attrs}/>`;
    if (el.type !== 'text') return '';
    const align = ['center', 'right'].includes(el.align) ? el.align : 'left';
    const tx = align === 'center' ? x + w/2 : align === 'right' ? x + w : x;
    const size = Math.max(8, number(el.fontSize, 24));
    const font = FONTS.includes(el.fontFamily) ? el.fontFamily : 'Arial';
    return `<text fill="${color(el.color)}" font-family="${escapeXml(font)}" font-size="${size}" font-weight="${number(el.fontWeight,400)}" text-anchor="${align === 'center' ? 'middle' : align === 'right' ? 'end' : 'start'}" ${attrs}>${textLines(el).map((line,i)=>`<tspan x="${tx}" y="${y + size + i*size*1.2}">${escapeXml(line)}</tspan>`).join('')}</text>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1050" height="600" viewBox="0 0 1050 600"><defs><linearGradient id="card-bg" x2="1" y2="1"><stop stop-color="${color(scene.background)}"/><stop offset="1" stop-color="${color(scene.gradient ? scene.backgroundEnd : scene.background)}"/></linearGradient></defs><rect width="1050" height="600" fill="url(#card-bg)"/>${nodes}</svg>`;
};

export const readImageFile = file => new Promise((resolve, reject) => {
  if (!file || !['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) return reject(new Error('Choose a PNG, JPG, or WebP image.'));
  if (file.size > 3 * 1024 * 1024) return reject(new Error('Choose an image smaller than 3 MB.'));
  const reader = new FileReader();
  reader.onerror = () => reject(new Error('This image could not be read.'));
  reader.onload = () => {
    const image = new Image();
    image.onerror = () => reject(new Error('This image could not be opened.'));
    image.onload = () => resolve({ src: reader.result, width: image.naturalWidth, height: image.naturalHeight });
    image.src = reader.result;
  };
  reader.readAsDataURL(file);
});