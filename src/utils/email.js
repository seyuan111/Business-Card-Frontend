export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export function isEmail(value) {
  return EMAIL_RE.test(String(value).trim());
}