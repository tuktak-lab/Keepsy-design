import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PAGE_TITLES } from './pageTitles';

// 화면을 옮길 때: 맨 위로 스크롤(또는 #해시 위치로), 탭 제목 바꾸기
export function RouteEffects() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) {
        el.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  useEffect(() => {
    document.title = PAGE_TITLES[pathname] ?? 'Keepsy';
  }, [pathname]);

  return null;
}
