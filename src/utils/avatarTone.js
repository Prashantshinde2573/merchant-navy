// Letter avatars (shown when a company has no image) get a background colour picked
// from the company name, so the same company always gets the same colour.
// The colours themselves live in styles/mobile.css (.avatar-tone-0 … .avatar-tone-4).
const TONE_COUNT = 5;

export function avatarToneClass(name = '') {
  let hash = 0;
  for (const ch of String(name)) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return `avatar-tone avatar-tone-${hash % TONE_COUNT}`;
}
