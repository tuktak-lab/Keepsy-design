import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 기능 검색: 키워드로 해당 화면으로 이동합니다 (MVP는 키워드 사전 방식).
const SEARCH_MAP: [string[], string][] = [
  [['대시보드', '오늘'], '/'],
  [['예약', '마감', '일정', '캘린더'], '/schedule'],
  [['히스토리', '사진', '시술 기록'], '/history'],
  [['고객 등록', '고객', '연락처', '동의'], '/customers'],
  [['인사이트', '재방문', '주기', '이탈', '관리할'], '/insights'],
  [['캠페인', '발송', '템플릿', '문자'], '/campaigns'],
  [['매출', '성과', '전환', '대조군'], '/performance'],
  [['설정', 'PIN', '휴무', '영업시간', '스탭', '시술 메뉴'], '/settings'],
];

export function Topbar(props: { crumb?: string }) {
  const crumb = props.crumb ?? 'Customer Intelligence / Overview';
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [miss, setMiss] = useState(false);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const text = q.trim();
    if (!text) return;
    const hit = SEARCH_MAP.find(([keys]) => keys.some((k) => text.includes(k)));
    if (hit) {
      setMiss(false);
      setQ('');
      navigate(hit[1]);
    } else {
      setMiss(true);
    }
  }

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        padding: '0 32px 0 50px',
        height: '92px',
        boxSizing: 'border-box',
        fontFamily: "'Noto Sans KR', system-ui, sans-serif",
        fontSize: '14px',
        color: '#3E3532',
        background: 'transparent',
      }}
    >
      <span style={{ marginRight: 'auto', whiteSpace: 'nowrap' }}>{crumb}</span>
      <form
        onSubmit={onSearch}
        role="search"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          height: '42px',
          width: 'min(300px, 28vw)',
          padding: '0 16px',
          boxSizing: 'border-box',
          borderRadius: '999px',
          background: '#FFFFFF',
          border: `1px solid ${miss ? '#C98B8B' : '#EBD9D5'}`,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9A8D88" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7"></circle>
          <path d="M20 20l-4-4"></path>
        </svg>
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setMiss(false);
          }}
          placeholder={miss ? '찾는 기능이 없어요. 다른 말로 검색해 보세요' : '기능 검색 (예: 지난달 매출, 고객 등록)'}
          aria-label="기능 검색"
          style={{ flex: 1, minWidth: 0, border: 0, outline: 0, background: 'transparent', font: "400 13px 'Noto Sans KR', sans-serif", color: '#3E3532' }}
        />
      </form>
      <button
        type="button"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          border: 0,
          background: 'transparent',
          font: "400 13px 'Noto Sans KR', sans-serif",
          color: '#6A5D58',
          cursor: 'pointer',
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#3E3532', fontWeight: 500 }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#85505A' }} />
          근무자 서연
        </span>
        <span style={{ width: '1px', height: '14px', background: '#D9CBC4' }} />
        네일무드 성수의 데이터만 표시됩니다
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6"></path>
        </svg>
      </button>
      <span style={{ width: '1px', height: '26px', background: '#D9CBC4' }} />
      <button
        type="button"
        aria-label="알림 3건"
        style={{
          position: 'relative',
          border: 0,
          background: 'transparent',
          cursor: 'pointer',
          color: '#3E3532',
          display: 'flex',
          padding: '4px',
        }}
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 17V11a6 6 0 0 1 12 0v6l1.5 2h-15z M10 21h4"></path>
        </svg>
        <span
          style={{
            position: 'absolute',
            top: '3px',
            right: '4px',
            width: '9px',
            height: '9px',
            borderRadius: '50%',
            background: '#85505A',
          }}
        />
      </button>
      <span
        aria-hidden="true"
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: '#D8CCC6',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="#F3ECE8">
          <circle cx="12" cy="9" r="4.2"></circle>
          <path d="M3.5 24c0-5 3.8-8 8.5-8s8.5 3 8.5 8z"></path>
        </svg>
      </span>
    </header>
  );
}
