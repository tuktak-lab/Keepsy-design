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
  ['insights', '인사이트', '/insights', 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z'],
  ['campaigns', '캠페인 관리', '/campaigns', 'M21 3L3 10.5l7 3 3 7z M21 3L10 13.5'],
  ['performance', '성과 분석', '/performance', 'M5 20v-8 M12 20V5 M19 20v-5'],
  ['settings', '매장 설정', '/settings', 'M4 9l1.5-5h13L20 9 M4 9v11h16V9 M9 20v-6h6v6'],
];

export function Sidebar(props: { active?: string }) {
  const active = props.active || 'dashboard';

  return (
    <nav
      aria-label="주 메뉴"
      style={{
        width: '100%',
        boxSizing: 'border-box',
        padding: '44px 16px 28px 0',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Noto Sans KR', system-ui, sans-serif",
        color: '#4A403C',
        background: 'linear-gradient(180deg, #F6EEEA 0%, #F1E5DF 100%)',
        borderRight: '1px solid #E6D8D1',
        minHeight: '100%',
      }}
    >
      <div
        style={{
          padding: '0 0 44px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <img
          src={logo}
          alt="Keepsy"
          style={{ width: '132px', height: 'auto', display: 'block' }}
        />
        <span style={{ fontSize: '11px', color: '#9A8D88', letterSpacing: '.1em' }}>SMART BEAUTY CRM</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {NAV.map(([id, text, href, d]) => {
          const on = id === active;
          return (
            <AppLink
              href={href}
              aria-current={on ? 'page' : 'false'}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                height: '54px',
                boxSizing: 'border-box',
                padding: '0 18px 0 28px',
                borderRadius: '0 28px 28px 0',
                fontSize: '15px',
                fontWeight: on ? 600 : 400,
                textDecoration: 'none',
                background: on ? '#FFFDFB' : 'transparent',
                boxShadow: on ? '0 4px 14px rgba(120, 90, 80, .10)' : 'none',
                color: on ? '#2F2826' : '#5A4F4B',
              }}
              key={id}
            >
              {on && (
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '12px',
                    bottom: '12px',
                    width: '4px',
                    borderRadius: '0 4px 4px 0',
                    background: '#85505A',
                  }}
                />
              )}
              <span
                style={{
                  width: '36px',
                  height: '36px',
                  flex: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  background: on ? '#F9E8E5' : 'transparent',
                }}
              >
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

      <div
        style={{
          margin: '56px 0 0 16px',
          padding: '22px 20px',
          borderRadius: '20px',
          background: 'rgba(236, 224, 218, .7)',
          border: '1px solid rgba(255,255,255,.6)',
          fontSize: '12.5px',
          lineHeight: 1.7,
          color: '#6A5D58',
          position: 'relative',
          minHeight: '112px',
          boxSizing: 'border-box',
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#A8968F"
          strokeWidth="1.5"
          strokeLinejoin="round"
          aria-hidden="true"
          style={{ display: 'block', marginBottom: '8px' }}
        >
          <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"></path>
        </svg>
        <img src={logo} alt="Keepsy" style={{ height: '15px', width: 'auto', verticalAlign: '-2px', marginRight: '3px' }} />와 함께
        <br />
        더 스마트한 매장 관리를
        <br />
        시작해보세요!
        <AppLink
          href="/insights"
          aria-label="인사이트로 이동"
          style={{
            position: 'absolute',
            right: '14px',
            bottom: '14px',
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            background: '#85505A',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
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
