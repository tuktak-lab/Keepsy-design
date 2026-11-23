import { useLayoutEffect, useState } from 'react';
import { AppLink } from '@/components/common/AppLink';
import logo from '@/assets/images/keepsy-logo-thin.png';

const NAV: [string, string, string, string][] = [
  ['dashboard', '대시보드', '/', 'M4 11l8-7 8 7 M6 10v10h12V10 M10 20v-5h4v5'],
  [
    'schedule',
    '예약 관리',
    '/schedule',
    'M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M3 10h18 M8 2v4 M16 2v4',
  ],
  [
    'customers',
    '고객 목록',
    '/customers',
    'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M2.5 20c0-3.6 3-6 6.5-6s6.5 2.4 6.5 6 M17 11a2.5 2.5 0 1 0 0-5 M18 14c2.5.3 4 2.2 4 5',
  ],
  ['insights', '인사이트', '/insights', 'M20 11a8 8 0 1 0-2.3 5.7 M20 4v7h-7'],
  ['campaigns', '캠페인 관리', '/campaigns', 'M21 3L3 10.5l7 3 3 7z M21 3L10 13.5'],
  ['performance', '성과 분석', '/performance', 'M5 20v-8 M12 20V5 M19 20v-5'],
  ['settings', '매장 설정', '/settings', 'M4 9l1.5-5h13L20 9 M4 9v11h16V9 M9 20v-6h6v6'],
];

const ITEM = 54; // 메뉴 한 칸 높이
const GAP = 8;

// 화면을 옮기면 사이드바가 새로 그려지므로, 직전 활성 메뉴 위치를 기억했다가
// 그 자리에서 새 메뉴로 표시(배경 + 왼쪽 선)를 부드럽게 옮깁니다.
let lastIdx: number | null = null;

export function Sidebar(props: { active?: string; glass?: boolean }) {
  const active = props.active || 'dashboard';
  const idx = Math.max(
    0,
    NAV.findIndex(([id]) => id === active),
  );
  const [markIdx, setMarkIdx] = useState(lastIdx ?? idx);
  const [moving, setMoving] = useState(false);

  useLayoutEffect(() => {
    if (markIdx !== idx) {
      // 이전 위치에 먼저 그린 뒤 다음 프레임에 이동
      const r = requestAnimationFrame(() => {
        setMoving(true);
        setMarkIdx(idx);
      });
      lastIdx = idx;
      return () => cancelAnimationFrame(r);
    }
    lastIdx = idx;
  }, [idx]);

  return (
    <nav aria-label="주 메뉴" className="kp-nav">
      <div className="kp-nav-logo">
        <img src={logo} alt="Keepsy" />
        <span>SMART BEAUTY CRM</span>
      </div>

      <div className="kp-nav-list">
        <span
          className={'kp-nav-mark' + (moving ? ' moving' : '')}
          style={{ transform: `translateY(${markIdx * (ITEM + GAP)}px)` }}
          aria-hidden="true"
        ></span>
        {NAV.map(([id, text, href, d]) => {
          const on = id === active;
          return (
            <AppLink href={href} aria-current={on ? 'page' : 'false'} className={'kp-nav-item' + (on ? ' on' : '')} key={id}>
              <span className="kp-nav-ico">
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d={d}></path>
                </svg>
              </span>
              <span style={{ flex: 1 }}>{text}</span>
            </AppLink>
          );
        })}
      </div>

      <div className="kp-nav-card">
        <img src={logo} alt="Keepsy" style={{ height: '15px', width: 'auto', verticalAlign: '-2px', marginRight: '3px' }} />와 함께
        <br />
        더 스마트한 매장 관리를
        <br />
        시작해보세요!
        <AppLink href="/insights" aria-label="인사이트로 이동" className="kp-nav-go">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14 M13 6l6 6-6 6"></path>
          </svg>
        </AppLink>
      </div>
    </nav>
  );
}
