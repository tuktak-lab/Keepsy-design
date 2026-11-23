import { useLayoutEffect } from 'react';

// 화면(컴포넌트)별 CSS를 그 화면이 떠 있는 동안에만 <head>에 넣습니다.
// 디자인 소스는 화면마다 따로 열렸기 때문에, 한 화면의 CSS가 다른 화면에 번지지 않도록 같은 효과를 냅니다.
const active = new Map<string, { el: HTMLStyleElement; count: number }>();

export function useStyleSheet(id: string, css: string) {
  useLayoutEffect(() => {
    let entry = active.get(id);
    if (!entry) {
      const el = document.createElement('style');
      el.setAttribute('data-style', id);
      el.textContent = css;
      document.head.appendChild(el);
      entry = { el, count: 0 };
      active.set(id, entry);
    }
    entry.count++;
    return () => {
      const e = active.get(id);
      if (!e) return;
      e.count--;
      if (e.count <= 0) {
        e.el.remove();
        active.delete(id);
      }
    };
  }, [id, css]);
}
