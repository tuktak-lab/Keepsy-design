import type { CSSProperties } from 'react';

// "--x:1;width:10px" 같은 CSS 문자열을 React style 객체로 바꿉니다.
export function cssText(text: string): CSSProperties {
  const style: Record<string, string> = {};
  let cur = '';
  let depth = 0;
  let quote: string | null = null;
  const decls: string[] = [];
  for (const c of text ?? '') {
    if (quote) {
      cur += c;
      if (c === quote) quote = null;
      continue;
    }
    if (c === '"' || c === "'") quote = c;
    if (c === '(') depth++;
    if (c === ')') depth--;
    if (c === ';' && depth === 0) {
      decls.push(cur);
      cur = '';
      continue;
    }
    cur += c;
  }
  if (cur.trim()) decls.push(cur);
  for (const d of decls) {
    const i = d.indexOf(':');
    if (i < 0) continue;
    const k = d.slice(0, i).trim();
    const val = d.slice(i + 1).trim();
    if (!k) continue;
    if (k.startsWith('--')) style[k] = val;
    else {
      let key = k.replace(/^-ms-/, 'ms-').replace(/-([a-z])/g, (_, ch) => ch.toUpperCase());
      if (/^-(webkit|moz)/.test(k)) key = key[0].toUpperCase() + key.slice(1);
      style[key] = val;
    }
  }
  return style as CSSProperties;
}
