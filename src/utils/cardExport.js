import { sceneSvg } from './cardStudio';

const loadImage = src => new Promise((resolve, reject) => {
  const image = new Image();
  image.onload = () => resolve(image);
  image.onerror = () => reject(new Error('The card could not be rendered. Try replacing the uploaded image.'));
  image.src = src;
});

export const renderCard = async scene => {
  await document.fonts.ready;
  const source = URL.createObjectURL(new Blob([sceneSvg(scene)], { type: 'image/svg+xml;charset=utf-8' }));
  try {
    const image = await loadImage(source);
    const canvas = document.createElement('canvas');
    canvas.width = 1050;
    canvas.height = 600;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Your browser does not support image export.');
    context.drawImage(image, 0, 0, 1050, 600);
    return canvas;
  } finally { URL.revokeObjectURL(source); }
};

// A single-page PDF with a 300 DPI image at the physical 3.5 x 2 inch card size.
export const canvasPdf = canvas => {
  const jpeg = Uint8Array.from(atob(canvas.toDataURL('image/jpeg', 1).split(',')[1]), char => char.charCodeAt(0));
  const encoder = new TextEncoder();
  const parts = [];
  const offsets = [0];
  let length = 0;
  const add = value => { const bytes = typeof value === 'string' ? encoder.encode(value) : value; parts.push(bytes); length += bytes.length; };
  const object = (id, body) => { offsets[id] = length; add(`${id} 0 obj\n${body}\nendobj\n`); };
  add('%PDF-1.4\n');
  object(1, '<< /Type /Catalog /Pages 2 0 R >>');
  object(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
  object(3, '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 252 144] /Resources << /XObject << /Card 4 0 R >> >> /Contents 5 0 R >>');
  offsets[4] = length;
  add(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width 1050 /Height 600 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`);
  add(jpeg);
  add('\nendstream\nendobj\n');
  const content = 'q\n252 0 0 144 0 0 cm\n/Card Do\nQ\n';
  object(5, `<< /Length ${encoder.encode(content).length} >>\nstream\n${content}endstream`);
  const xref = length;
  add(`xref\n0 6\n0000000000 65535 f \n${offsets.slice(1).map(offset => `${String(offset).padStart(10,'0')} 00000 n \n`).join('')}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);
  return new Blob(parts, { type: 'application/pdf' });
};

export const downloadCard = async (scene, format = 'png', name = 'business-card') => {
  const canvas = await renderCard(scene);
  const blob = format === 'pdf' ? canvasPdf(canvas) : await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('Your browser could not create the download.');
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${String(name || 'business-card').replace(/[^a-z0-9_-]+/gi, '-').slice(0, 80)}.${format}`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
};

export const printCard = scene => {
  const popup = window.open('', '_blank', 'width=850,height=650');
  if (!popup) throw new Error('Allow pop-ups to print your card.');
  popup.opener = null;
  popup.document.write(`<!doctype html><html><head><title>Business card — Print</title><style>@page{size:3.5in 2in;margin:0}*{box-sizing:border-box}body{margin:0;background:#fff}svg{display:block;width:3.5in;height:2in}button{margin:24px;padding:12px 24px;cursor:pointer}@media print{button{display:none}body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body>${sceneSvg(scene)}<button onclick="window.print()">Print business card</button></body></html>`);
  popup.document.close();
  popup.addEventListener('load', () => { popup.focus(); popup.print(); }, { once: true });
};